/*

A recommendations test to find data on users' tastes

*/

import React, { Component } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Animated
} from "react-native";
import PropTypes from "prop-types";
import firebase from "react-native-firebase";
import Icon from "react-native-vector-icons/FontAwesome";
import ReactNativeHaptic from "react-native-haptic";

import SwipeCards from "react-native-swipe-cards"; // Library to create Tinder-like swipe cards

import RecommendCard from "./RecommendCard";

export default class RecommendationsTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recs: [],
      tastes: this.props.userInfo.tastes === null
        ? ""
        : this.props.userInfo.tastes,
      opacity: new Animated.Value(1), // Value to change opacity of instructions
      percentageText: new Animated.Value(0) // Value to change opacity of percentage
    };

    this.letterCounter = this.letterCounter.bind(this);
    this.saveData = this.saveData.bind(this);
  }

  componentDidMount() {
    /*
    Fetch Recommendations collection from Firestore database
    Record Recommendations data as recs variable
    */
    const array = [];
    firebase.firestore().collection("recommendations").get().then(snapShot => {
      snapShot.forEach(doc => {
        const data = doc.data();
        array.push({
          title: data.title,
          description: data.description,
          page: data.page,
          key: doc.id
        });
      });
      this.setState({
        recs: array
      });
    });

    Animated.timing(this.state.opacity, {
      // Change opacity of instructions
      toValue: 0,
      delay: 4000,
      duration: 2000
    }).start();

    Animated.timing(this.state.percentageText, {
      // Change opacity of percentage
      toValue: 1,
      delay: 6000,
      duration: 2000
    }).start();
  }

  letterCounter(str) {
    // Function to count number of characters in a user tastes string
    var letters = 0; // Letters count
    var alphabet = "10"; // Letters to count for
    var ar = alphabet.split(""); // Get array of all characters in word
    for (var i = 0; i < str.length; i++) {
      // Loop through ar array
      if (ar.indexOf(str[i]) > -1) {
        // If each character is in alphabet string
        letters = letters + 1; // Add to letter count
      }
    }
    return letters;
  }

  saveData() {
    // Save and update user tastes
    firebase.firestore().doc(`users/${this.props.user.uid}`).update({
      tastes: this.state.tastes
    });
    this.props.userInfo.tastes = this.state.tastes;
  }

  render() {
    return (
      <View
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
          alignItems: "center",
          backgroundColor: "#F6EFDE"
        }}
      >
        <Animated.Text
          style={{
            fontFamily: "Avenir",
            fontSize: 16,
            textAlign: "center",
            color: "#43352F",
            margin: 50,
            marginBottom: 0,
            position: "absolute",
            top: 50,
            opacity: this.state.opacity
          }}
        >
          Swipe right if you like what you read!{"\n"} Swipe left if you
          don&#39;t.
        </Animated.Text>
        <Animated.Text
          style={{
            fontFamily: "Avenir",
            fontSize: 14,
            color: "#B87E22",
            position: "absolute",
            top: 150,
            opacity: this.state.percentageText
          }}
        >
          {Math.round(
            this.letterCounter(this.state.tastes) / this.state.recs.length * 100
          )}%
        </Animated.Text>
        {this.state.recs.length > 0 &&
          <SwipeCards
            style={{ marginTop: 0 }}
            cards={this.state.recs.slice(this.letterCounter(this.state.tastes))}
            renderCard={data => <RecommendCard rec={data} key={data.key} />}
            yupView={<Icon size={30} name="thumbs-up" color="#43352F" />}
            yupStyle={{ borderColor: "transparent" }}
            noView={<Icon size={30} name="thumbs-down" color="#43352F" />}
            nopeStyle={{ borderColor: "transparent" }}
            handleYup={() => {
              this.setState({ tastes: this.state.tastes + "1" });
              ReactNativeHaptic.generate("impact");
            }}
            handleNope={() => {
              this.setState({ tastes: this.state.tastes + "0" });
              ReactNativeHaptic.generate("impact");
            }}
          />}
        <TouchableOpacity
          underlayColor="transparent"
          style={{ marginTop: 5, position: "absolute", bottom: 150 }}
          onPress={() => {
            this.props.close();
            this.saveData();
          }}
        >
          <Text
            style={{
              fontFamily: "Avenir",
              fontSize: 14,
              color: "#B87E22"
            }}
          >
            Done
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

RecommendationsTest.propTypes = {
  user: PropTypes.object.isRequired, // User object storing Firebase info
  userInfo: PropTypes.object.isRequired, // Object storing a user's first name, last name, and tastes
  close: PropTypes.func.isRequired // Function to close class
};
