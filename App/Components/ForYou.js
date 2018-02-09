/*

A "For You" slide to recommend books on the Home Screen.

*/

import React, { Component } from "react";
import {
  View,
  Text,
  Dimensions,
  Image,
  Animated,
  TouchableOpacity
} from "react-native";
import PropTypes from "prop-types";
import styled from "styled-components/native";
import ReactNativeHaptic from "react-native-haptic";

export default class ForYou extends Component {
  constructor(props) {
    super(props);

    this.press = this.press.bind(this);
  }

  press() {
    // Method to accept touch event
    ReactNativeHaptic.generate("selection"); // Haptic feedback
    this.props.biggerBook(this.props.book); // Enlarge book on Home Screen
  }

  render() {
    return (
      <View
        style={{
          margin: 15,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <TouchableOpacity onPress={() => this.press()}>
          <Image
            style={{
              width: Dimensions.get("window").width * 0.92,
              height: Dimensions.get("window").width * 1,
              opacity: 1,
              overflow: "hidden",
              borderRadius: 12
            }}
            source={{ uri: this.props.book.feature }}
          />
        </TouchableOpacity>
        <View
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            backgroundColor: "transparent"
          }}
        >
          <Text
            style={{
              fontFamily: "Avenir-Heavy",
              color: "white",
              fontSize: 16,
              opacity: 0.95
            }}
          >
            FOR YOU
          </Text>
          <Text
            style={{
              fontFamily: "Avenir-Black",
              fontSize: 32,
              color: "white"
            }}
          >
            {this.props.book.title}
          </Text>
        </View>
        <Text
          style={{
            fontFamily: "Avenir-Heavy",
            color: "white",
            fontSize: 16,
            position: "absolute",
            bottom: 10,
            left: 20,
            backgroundColor: "transparent"
          }}
        >
          {this.props.book.author}
        </Text>
        <View
          style={{
            padding: 5,
            backgroundColor: "white",
            overflow: "hidden",
            borderRadius: 20,
            width: 60,
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: 20,
            right: 20
          }}
        >
          <AuthorText
            style={{
              color: "#157DFB",
              fontFamily: "Avenir-Black",
              fontSize: 15
            }}
          >
            {Math.round(this.props.score)}%
          </AuthorText>
        </View>
      </View>
    );
  }
}

const ForYouButton = styled.View`
  backgroundColor: #C6D3FF;
  width: ${Dimensions.get("window").width * 0.64};
  height: 200;
  padding: 15px;
  overflow: hidden;
  borderRadius: 8;
  marginLeft: 15;
`;

const MainText = styled.Text`
  color: white;
  fontSize: 28;
  fontFamily: Avenir-Black;
`;

const SubText = styled.Text`
  color: white;
  fontSize: 14;
  fontFamily: Avenir-Roman;
`;

const AuthorText = styled.Text`
  fontFamily: Avenir-Medium;
  fontSize: 20;
  color: #DCDCDC;
`;

ForYou.propTypes = {
  book: PropTypes.object.isRequired, // Book object for book information
  biggerBook: PropTypes.func.isRequired, // Function to enlarge book on Home Screen
  score: PropTypes.number.isRequired // Recommendation score for user
};
