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

import SwipeCards from "react-native-swipe-cards";

import RecommendCard from "./RecommendCard";

export default class RecommendationsTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recs: [],
      tastes: this.props.userInfo.tastes === null
        ? ""
        : this.props.userInfo.tastes,
      opacity: new Animated.Value(1),
      percentageText: new Animated.Value(0)
    };

    this.letterCounter = this.letterCounter.bind(this);
    this.saveData = this.saveData.bind(this);
  }

  componentDidMount() {
    const array = [];
    firebase.firestore().collection("recommendations").get().then(snapShot => {
      snapShot.forEach(doc => {
        const data = doc.data();
        array.push({
          title: data.title,
          description: data.description,
          page: data.page
        });
      });
      this.setState({
        recs: array
      });
    });

    Animated.timing(this.state.opacity, {
      toValue: 0,
      delay: 2000,
      duration: 2000
    }).start();

    Animated.timing(this.state.percentageText, {
      toValue: 1,
      delay: 4000,
      duration: 2000
    }).start();
  }

  letterCounter(str) {
    var letters = 0;
    var alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ10";
    var ar = alphabet.split("");
    for (var i = 0; i < str.length; i++) {
      if (ar.indexOf(str[i]) > -1) {
        letters = letters + 1;
      }
    }
    return letters;
  }

  saveData() {
    firebase.firestore().doc(`users/${this.props.user.uid}`).update({
      tastes: this.state.tastes
    });
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
            renderCard={data => <RecommendCard rec={data} />}
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
  user: PropTypes.object.isRequired,
  userInfo: PropTypes.object.isRequired,
  close: PropTypes.func.isRequired
};
