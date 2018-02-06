import React, { Component } from "react";
import { View, Text, TextInput, Button, Dimensions } from "react-native";
import styled from "styled-components/native";
import firebase from "react-native-firebase";

import RecommendationsTest from "../Components/RecommendationsTest";

export default class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      submitted: false
    };

    this.signUp = this.signUp.bind(this);
  }

  signUp() {
    /*firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(user => {
        this.setState({ user });
        firebase.firestore().document("users/" + user.uid).set({
          firstName: this.state.firstName,
          lastName: this.state.lastName
        });
      })
      .catch(error => console.log(error)); */

    this.setState({
      submitted: true
    });
  }

  render() {
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        {!this.state.submitted &&
          <View>
            <Text
              style={{
                fontFamily: "Avenir-Book",
                fontSize: 28,
                margin: 20,
                textAlign: "center"
              }}
            >
              Welcome to the Walt Grace Library!
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
                borderRadius: 8
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
            <Button title="Sign Up" onPress={() => this.signUp()} />
          </View>}
        {this.state.submitted && <RecommendationsTest user={this.state.user} />}
      </View>
    );
  }
}
