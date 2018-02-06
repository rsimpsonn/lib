import React, { Component } from "react";
import {
  ScrollView,
  Text,
  Image,
  View,
  TextInput,
  Button,
  Dimensions
} from "react-native";
import firebase from "react-native-firebase";

import MainView from "./MainView";
import SignUp from "./SignUp";

export default class LaunchScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      signUp: false
    };

    this.login = this.login.bind(this);
  }

  componentDidMount() {
    this.handle = firebase.auth().onAuthStateChanged(user => {
      if (user !== null && user !== undefined) {
        this.setState({ user });

        firebase.firestore().doc(`users/${user.uid}`).get().then(snapShot => {
          const data = snapShot.data();
          var tastes = null;
          if (data.tastes !== undefined && data.tastes !== null) {
            tastes = data.tastes;
          }
          this.setState({
            userInfo: {
              firstName: data.firstName,
              lastName: data.lastName,
              tastes: tastes
            }
          });
        });

        firebase
          .firestore()
          .collection(`users/${user.uid}/history`)
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

  login() {
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(user => this.setState({ user }))
      .catch(error => console.log(error));
  }

  signUp() {
    this.setState({
      signUp: true
    });
  }

  render() {
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
              marginTop: Dimensions.get("window").height * 0.4
            }}
          >
            <Text
              style={{
                fontFamily: "Avenir-Book",
                fontSize: 28,
                marginBottom: 20
              }}
            >
              Walt Grace
            </Text>
            <TextInput
              style={{
                backgroundColor: "#DCDCDC",
                overflow: "hidden",
                padding: 5,
                width: Dimensions.get("window").width * 0.6,
                textAlign: "center",
                borderRadius: 8
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
            <Button title="Log In" onPress={() => this.login()} />
            <Button title="Sign Up" onPress={() => this.signUp()} />
          </View>}
        {this.state.signUp && <SignUp user={null} />}
        {this.state.userInfo &&
          <MainView
            user={this.state.user}
            userInfo={this.state.userInfo}
            userHistory={this.state.userHistory}
            navigation={this.props.navigation}
          />}
      </View>
    );
  }
}
