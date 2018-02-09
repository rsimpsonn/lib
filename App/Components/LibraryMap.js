/*

A map with a pin to display where a book is located in the library

*/

import React, { Component } from "react";
import { View, Image, Text, Dimensions, Animated, Easing } from "react-native";
import PropTypes from "prop-types";
import Icon from "react-native-vector-icons/FontAwesome"; // Icon class

export default class LibraryMap extends Component {
  constructor(props) {
    super(props);

    this.circleSize = new Animated.Value(0); // Value to change size of animating circle on pin
    this.circleOpacity = new Animated.Value(0.4); // Value to change opacity of animating circle on pin
    this.returnHeight = this.returnHeight.bind(this);
    this.returnXPosition = this.returnXPosition.bind(this);
    this.animateCircle = this.animateCircle.bind(this);
  }

  componentDidMount() {
    this.animateCircle(); // Start animating circle on pin upon mounting
  }

  animateCircle() {
    // Animate the circle on pin using the Animated API
    this.circleSize.setValue(20); // Reset size of circle to 20x20
    this.circleOpacity.setValue(0.4); // Reset opacity of circle to 0.4
    Animated.parallel([
      Animated.timing(this.circleSize, {
        toValue: 40,
        duration: 2000
      }),
      Animated.timing(this.circleOpacity, {
        toValue: 0,
        duration: 2000,
        easing: Easing.easeOut
      }) // Simultaneously grow circle to 40x40 while lowering opacity of circle to 0
    ]).start(() => this.animateCircle()); // Repeat circle animation
  }

  returnHeight(value) {
    // Return vertical location of pin on Image
    // Current library accepts either A, B, or C (each corresponds to a different bookcases in library)

    if (value.substring(0, 1) === "A") {
      // If on first shelf
      if (value.substring(1, 2) === "1") {
        // Depending on second value (1, 2, or 3, depending on shelf of bookcase), return horizontal position
        return 0 - Number(value.substring(2)) * 1.1;
      } else if (value.substring(1, 2) === "2") {
        return 40 - Number(value.substring(2));
      } else if (value.substring(1, 2) === "3") {
        return 80 - Number(value.substring(2));
      }
    } else if (value.substring(0, 1) === "B") {
      if (value.substring(1, 2) === "1") {
        return 0 + Number(value.substring(2)) / 4;
      } else if (value.substring(1, 2) === "2") {
        return 30 + Number(value.substring(2)) * 1.1;
      }
    } else if (value.substring(0, 1) === "C") {
      if (value.substring(1, 2) === "1") {
        return 130 - Number(value.substring(2)) * 2;
      }
    } else {
      // If the value is on A, B, or C, do not put the pin visible on the map
      return -50;
    }
  }

  returnXPosition(value) {
    // Return horizontal position of pin on Image
    if (value.substring(0, 1) === "A") {
      return 100 + Number(value.substring(2)) * 3;
    } else {
      return 200 + Number(value.substring(2)) * 3;
    }
  }

  render() {
    return (
      <View
        style={{
          marginTop: 20,
          marginBottom: 20,
          marginLeft: 15
        }}
      >
        <Image
          style={{
            width: 350,
            height: 260
          }}
          source={require("../Images/map.png")}
        />
        <View
          style={{
            position: "absolute",
            top: this.returnHeight(this.props.book.location),
            left: this.returnXPosition(this.props.book.location),
            backgroundColor: "transparent",
            justifyContent: "center",
            alignItems: "center",
            width: 40,
            height: 40
          }}
        >
          <Animated.View
            style={{
              opacity: this.circleOpacity,
              backgroundColor: "#157DFB",
              height: this.circleSize,
              width: this.circleSize,
              borderRadius: this.circleSize,
              overflow: "hidden"
            }}
          />
          <Icon
            style={{ position: "absolute" }}
            name="map-marker"
            size={30}
            color="#157DFB"
          />
        </View>
      </View>
    );
  }
}

LibraryMap.propTypes = {
  book: PropTypes.object.isRequired // Book object containing book information
};
