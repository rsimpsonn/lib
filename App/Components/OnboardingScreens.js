import React, { Component } from "react";
import { View, Image, Text, Button, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import Icon from "react-native-vector-icons/FontAwesome";

import Swiper from "./Swiper";

export default class OnboardingScreens extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <TouchableOpacity
          style={{ position: "absolute", top: 15, left: 15 }}
          onPress={() => this.props.back()}
        >
          <Icon name="chevron-circle-left" size={30} color="#639BFF" />
        </TouchableOpacity>
        <Swiper>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Image source={require("../Images/books.png")} />
            <Text
              style={{
                textAlign: "center",
                color: "#639BFF",
                fontFamily: "Avenir-Medium",
                fontSize: 20,
                margin: 50,
                marginTop: 140
              }}
            >
              Reserve, Check Out, and Return Books
            </Text>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 10
            }}
          >
            <Image source={require("../Images/robot.png")} />
            <Text
              style={{
                textAlign: "center",
                color: "#639BFF",
                fontFamily: "Avenir-Medium",
                fontSize: 20,
                margin: 50,
                marginTop: 140
              }}
            >
              Get recommendations for books we think you would like
            </Text>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 15
            }}
          >
            <Icon name="map-marker" size={100} color="#639BFF" />
            <Text
              style={{
                textAlign: "center",
                color: "#639BFF",
                fontFamily: "Avenir-Medium",
                fontSize: 20,
                margin: 50,
                marginTop: 140
              }}
            >
              Find where books are in the library
            </Text>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 30
            }}
          >
            <Image source={require("../Images/notification.png")} />
            <Text
              style={{
                textAlign: "center",
                color: "#639BFF",
                fontFamily: "Avenir-Medium",
                fontSize: 20,
                margin: 50,
                marginTop: 140
              }}
            >
              Get notified when your books are overdue
            </Text>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "#639BFF",
                fontFamily: "Avenir-Medium",
                fontSize: 20,
                marginTop: 40
              }}
            >
              You Ready?
            </Text>
            <View style={{ marginTop: 170 }}>
              <Button title="Let's Go!" onPress={() => this.props.finish()} />
            </View>
          </View>
        </Swiper>
      </View>
    );
  }
}

OnboardingScreens.propTypes = {
  finish: PropTypes.func.isRequired, // Function to sign up user when finished with onboarding
  back: PropTypes.func.isRequired // Function to go back to sign up form
};
