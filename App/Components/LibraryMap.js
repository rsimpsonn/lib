import React, { Component } from "react";
import { View, Image, Text, Dimensions, Animated, Easing } from "react-native";
import PropTypes from "prop-types";
import Icon from "react-native-vector-icons/FontAwesome";

export default class LibraryMap extends Component {
  constructor(props) {
    super(props);

    this.circleSize = new Animated.Value(0);
    this.circleOpacity = new Animated.Value(0.4);
    this.returnHeight = this.returnHeight.bind(this);
    this.returnXPosition = this.returnXPosition.bind(this);
    this.animateCircle = this.animateCircle.bind(this);
  }

  componentDidMount() {
    this.circleSize.addListener(({ value }) => (this.number = value));
    this.animateCircle();
  }

  animateCircle() {
    this.circleSize.setValue(20);
    this.circleOpacity.setValue(0.4);
    Animated.parallel([
      Animated.timing(this.circleSize, {
        toValue: 40,
        duration: 2000
      }),
      Animated.timing(this.circleOpacity, {
        toValue: 0,
        duration: 2000,
        easing: Easing.easeOut
      })
    ]).start(() => this.animateCircle());
  }

  returnHeight(value) {
    if (value.substring(0, 1) === "A") {
      if (value.substring(1, 2) === "1") {
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
    } else {
      if (value.substring(1, 2) === "1") {
        return 130 - Number(value.substring(2)) * 2;
      }
    }
  }

  returnXPosition(value) {
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
          marginBottom: 20
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

/* style={{
  position: "absolute",
  top: this.returnHeight(this.props.book.location.substring(0, 1)),
  left: this.returnXPosition(this.props.book.location),
  backgroundColor: "transparent"
}} */

LibraryMap.propTypes = {
  book: PropTypes.object.isRequired
};
