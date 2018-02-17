/*

Root View to check if user's logged in
If logged in, LaunchScreen directs user to MainView
If not, LaunchScreen shows Login screen

*/

import React, { Component } from "react";
import {
  ScrollView,
  Text,
  Image,
  View,
  TextInput,
  Button,
  Dimensions,
  TouchableOpacity,
  Alert,
  Platform,
  Animated,
  Easing
} from "react-native";
import firebase from "react-native-firebase";
import { AccessToken, LoginManager } from "react-native-fbsdk";

import MainView from "./MainView";
import SignUp from "./SignUp";

export default class LaunchScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      signUp: false // Records whether the user has chosen to sign up,
    };
    this.spinValue = new Animated.Value(0);
    this.spin = this.spin.bind(this);
    this.login = this.login.bind(this);
    this.signUpFacebook = this.signUpFacebook.bind(this);
    this.getPushToken = this.getPushToken.bind(this);
  }

  componentDidMount() {
    this.spin();
    this.handle = firebase.auth().onAuthStateChanged(user => {
      // Check if there's a user already logged in
      if (user !== null && user !== undefined) {
        firebase.messaging().requestPermissions();
        firebase.messaging().subscribeToTopic("notifications");
        firebase.messaging().subscribeToTopic(user.uid);
        firebase.messaging().onMessage(message => {
          Alert.alert(JSON.stringify(message));
          firebase.messaging().createLocalNotification({
            body: message.body,
            title: message.title
          });
        });
        firebase.messaging().getInitialNotification(message => {
          Alert.alert(JSON.stringify(message));
          firebase.messaging().createLocalNotification({
            body: message.body,
            title: message.title
          });
        });
        this.setState({ user }); // Set user
        firebase.firestore().doc(`users/${user.uid}`).get().then(snapShot => {
          // Get database information for user
          const data = snapShot.data();
          var tastes = null;
          if (data.tastes !== undefined && data.tastes !== null) {
            // Get tastes if they aren't null or undefined
            tastes = data.tastes;
          }
          this.setState({
            userInfo: {
              firstName: data.firstName,
              lastName: data.lastName,
              tastes: tastes, // Tastes variable = a string of 1's and 0's showing a user's answers to the RecommendationsTest
              pushToken: this.getPushToken(data.pushToken)
            }
          });
        });

        firebase
          .firestore()
          .collection(`users/${user.uid}/history`) // Get user's book history
          .get()
          .then(snapShot => {
            const array = [];
            snapShot.forEach(doc => {
              const data = doc.data();
              array.push(data);
            });
            this.setState({ userHistory: array });
          });
      }
    });
  }

  spin() {
    // Function using the Animated API to spin the wheel design
    this.spinValue.setValue(0);
    Animated.timing(this.spinValue, {
      toValue: 1,
      duration: 40000,
      easing: Easing.linear
    }).start(() => this.spin());
  }

  getPushToken(token) {
    firebase.messaging().getToken().then(tk => {
      firebase
        .firestore()
        .doc(`users/${this.state.user.uid}`)
        .update({ pushToken: tk });
    });
  }

  login() {
    // Function to login user
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(user => {
        this.setState({ user });
      })
      .catch(error => console.log(error));
  }

  signUp() {
    // Function to enlarge Sign Up screen
    this.setState({
      signUp: true
    });
  }

  signUpFacebook = () => {
    // Method to sign up users with Facebook
    return LoginManager.logInWithReadPermissions(["public_profile", "email"]) // Get read permissions
      .then(result => {
        if (!result.isCancelled) {
          console.log(
            `Login success with permissions: ${result.grantedPermissions.toString()}`
          );
          // get the access token
          return AccessToken.getCurrentAccessToken(); // Need access token to create Firebase credentials
        }
      })
      .then(data => {
        // Create a new firebase credential with the token
        const credential = firebase.auth.FacebookAuthProvider.credential(
          data.accessToken
        );

        // Login with credential
        firebase
          .auth()
          .signInWithCredential(credential)
          .then(currentUser => {
            firebase
              .firestore()
              .doc(`users/${currentUser.uid}`) // Get userInfo from Firestore
              .get()
              .then(snapShot => {
                const data = snapShot.data();
                if (data.firstName) {
                  // If there's already a database entry
                  this.setState({ user: currentUser }); // Just continue
                } else {
                  // If not
                  firebase.firestore().doc(`users/${currentUser.uid}`).set({
                    // Make a new database entry with the user's display name
                    firstName: currentUser.displayName.substring(
                      0,
                      currentUser.displayName.indexOf(" ")
                    ), // First name is display name substring up until the space
                    lastName: currentUser.displayName.substring(
                      currentUser.displayName.indexOf(" ") + 1
                    ), // Last name is display name substring past the space
                    tastes: ""
                  });
                  this.setState({
                    user: currentUser,
                    userInfo: {
                      firstName: currentUser.displayName.substring(
                        0,
                        currentUser.displayName.indexOf(" ")
                      ),
                      lastName: currentUser.displayName.substring(
                        currentUser.displayName.indexOf(" ") + 1
                      ),
                      tastes: ""
                    }
                  });
                }
              })
              .catch(() => {
                firebase.firestore().doc(`users/${currentUser.uid}`).set({
                  firstName: currentUser.displayName.substring(
                    0,
                    currentUser.displayName.indexOf(" ")
                  ),
                  lastName: currentUser.displayName.substring(
                    currentUser.displayName.indexOf(" ") + 1
                  ),
                  tastes: ""
                });
                this.setState({
                  user: currentUser,
                  userInfo: {
                    firstName: currentUser.displayName.substring(
                      0,
                      currentUser.displayName.indexOf(" ")
                    ),
                    lastName: currentUser.displayName.substring(
                      currentUser.displayName.indexOf(" ") + 1
                    ),
                    tastes: ""
                  }
                });
              });
          })
          .catch(error => {
            Alert.alert("There was an error with the login!");
          });
      });
  };

  render() {
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"]
    });
    return (
      <View
        style={{
          backgroundColor: "white",
          height: Dimensions.get("window").height
        }}
      >
        {!this.state.user &&
          !this.state.signUp &&
          <View
            style={{
              alignItems: "center",
              marginTop: Dimensions.get("window").height * 0.15
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 40
              }}
            >
              <Animated.Image
                source={require("../Images/circles.png")}
                style={{
                  height: Dimensions.get("window").height * 0.4,
                  width: Dimensions.get("window").height * 0.4,
                  transform: [{ rotate: spin }]
                }}
              />
              <Image
                style={{ position: "absolute", width: 76, height: 46 }}
                source={require("../Images/logo-abb.png")}
              />
            </View>
            <TextInput
              style={{
                backgroundColor: "#DCDCDC",
                overflow: "hidden",
                padding: 5,
                width: Dimensions.get("window").width * 0.6,
                textAlign: "center",
                borderRadius: 8,
                marginBottom: 15
              }}
              autoCapitalize="none"
              onChangeText={email => this.setState({ email })}
              value={this.state.email}
              placeholder="Email"
            />
            <TextInput
              onChangeText={password => this.setState({ password })}
              value={this.state.password}
              placeholder="Password"
              secureTextEntry={true}
              autoCapitalize="none"
              style={{
                backgroundColor: "#DCDCDC",
                overflow: "hidden",
                padding: 5,
                width: Dimensions.get("window").width * 0.6,
                textAlign: "center",
                borderRadius: 8
              }}
            />
            <TouchableOpacity onPress={() => this.login()}>
              <View
                style={{
                  padding: 10,
                  width: Dimensions.get("window").width * 0.6,
                  borderRadius: 20,
                  overflow: "hidden",
                  backgroundColor: "#639BFF",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 15
                }}
              >
                <Text
                  style={{
                    fontFamily: "Avenir-Black",
                    color: "white",
                    fontSize: 16
                  }}
                >
                  Log In
                </Text>
              </View>
            </TouchableOpacity>
            <Button title="Sign Up" onPress={() => this.signUp()} />
            <TouchableOpacity onPress={() => this.signUpFacebook()}>
              <View
                style={{
                  padding: 10,
                  width: Dimensions.get("window").width * 0.6,
                  borderRadius: 20,
                  overflow: "hidden",
                  backgroundColor: "#4054B2",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 15
                }}
              >
                <Text
                  style={{
                    fontFamily: "Avenir-Black",
                    color: "white",
                    fontSize: 16
                  }}
                >
                  Log In With Facebook
                </Text>
              </View>
            </TouchableOpacity>

          </View>}
        {this.state.signUp && <SignUp user={null} />}
        {this.state.userInfo &&
          this.state.userHistory &&
          this.state.user &&
          <MainView
            user={this.state.user}
            userInfo={this.state.userInfo}
            userHistory={this.state.userHistory}
            navigation={this.props.navigation}
            context={this}
          />}
      </View>
    );
  }
}
