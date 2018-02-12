/*

A Sign Up screen to sign up users and show onboarding pages

*/

import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Dimensions,
  Alert,
  Animated,
  Easing
} from "react-native";
import styled from "styled-components/native";
import firebase from "react-native-firebase";

import RecommendationsTest from "../Components/RecommendationsTest";
import OnboardingScreens from "../Components/OnboardingScreens";

export default class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      submitted: false // check if user has submitted sign up request
    };

    this.spinValue = new Animated.Value(0);
    this.spin = this.spin.bind(this);

    this.signUp = this.signUp.bind(this);
    this.cont = this.cont.bind(this);
  }

  componentDidMount() {
    this.spin();
  }

  cont() {
    // Function to check form values and continue user to onboarding
    if (!this.state.email || this.state.email === "") {
      Alert.alert("You need to put an email");
      return;
    } else if (!this.state.password || this.state.password === "") {
      Alert.alert("You need to put a password!");
      return;
    } else if (!this.state.firstName || this.state.firstName === "") {
      Alert.alert("You need to put a first name!");
      return;
    } else if (!this.state.lastName || this.state.firstName === "") {
      Alert.alert("You need to put a last name!");
      return;
    }

    this.setState({
      submitted: !this.state.submitted
    });
  }

  signUp() {
    // Function to sign up users

    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password) // Firebase auth function
      .then(user => {
        // Add user to database using user's UID
        firebase
          .firestore()
          .doc(`users/${user.uid}`)
          .set({
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            tastes: ""
          })
          .then(() => this.setState({ user, submitted: true }));
      })
      .catch(error =>
        Alert.alert("There was an error in the sign up process!")
      );
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

  render() {
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"]
    });
    return (
      <View>
        {!this.state.submitted &&
          <View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: Dimensions.get("window").width
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 40,
                  marginTop: Dimensions.get("window").height * 0.15
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
                <Text
                  style={{
                    fontFamily: "Avenir-Book",
                    fontSize: 16,
                    textAlign: "center",
                    color: "#639BFF",
                    width: 150,
                    position: "absolute"
                  }}
                >
                  Welcome to the {" "}
                  <Text style={{ fontFamily: "Avenir-Black" }}>Walt Grace</Text>
                  {"\n"}Library!
                </Text>
              </View>
              <TextInput
                style={{
                  backgroundColor: "#DCDCDC",
                  overflow: "hidden",
                  padding: 5,
                  width: Dimensions.get("window").width * 0.6,
                  textAlign: "center",
                  borderRadius: 8,
                  margin: 7.5
                }}
                autoCapitalize="none"
                onChangeText={firstName => this.setState({ firstName })}
                value={this.state.firstName}
                placeholder="First Name"
              />
              <TextInput
                style={{
                  backgroundColor: "#DCDCDC",
                  overflow: "hidden",
                  padding: 5,
                  width: Dimensions.get("window").width * 0.6,
                  textAlign: "center",
                  borderRadius: 8,
                  margin: 7.5
                }}
                autoCapitalize="none"
                onChangeText={lastName => this.setState({ lastName })}
                value={this.state.lastName}
                placeholder="Last Name"
              />
              <TextInput
                style={{
                  backgroundColor: "#DCDCDC",
                  overflow: "hidden",
                  padding: 5,
                  width: Dimensions.get("window").width * 0.6,
                  textAlign: "center",
                  borderRadius: 8,
                  margin: 7.5
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
                  borderRadius: 8,
                  margin: 7.5
                }}
              />
              <Button
                style={{ margin: 7.5 }}
                title="Get Started"
                onPress={() => this.cont()}
              />
            </View>
          </View>}
        {this.state.submitted &&
          <OnboardingScreens back={this.cont} finish={this.signUp} />}
      </View>
    );
  }
}
