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
import firebase from "react-native-firebase";

export default class ForYou extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: new Animated.Value(Dimensions.get("window").width * 0.92),
      height: new Animated.Value(Dimensions.get("window").width * 1)
    };

    this.press = this.press.bind(this);
  }

  press() {
    ReactNativeHaptic.generate("selection");
    const width = [
      Animated.spring(this.state.width, {
        toValue: Dimensions.get("window").width * 1,
        duration: 0.02
      }),
      Animated.spring(this.state.width, {
        toValue: Dimensions.get("window").width * 0.92,
        duration: 0.02
      })
    ];

    const height = [
      Animated.spring(this.state.height, {
        toValue: Dimensions.get("window").width * 1.02,
        duration: 0.02
      }),
      Animated.spring(this.state.height, {
        toValue: Dimensions.get("window").width * 1,
        duration: 0.02
      })
    ];

    Animated.parallel([Animated.sequence(height), Animated.sequence(width)], {
      duration: 200
    }).start();

    this.props.biggerBook(this.props.book);
  }

  render() {
    return (
      <Animated.View
        style={{
          margin: 15,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <TouchableOpacity onPress={() => this.press()}>
          <Animated.Image
            style={{
              width: this.state.width,
              height: this.state.height,
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
      </Animated.View>
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
  book: PropTypes.object.isRequired,
  biggerBook: PropTypes.func.isRequired,
  userInfo: PropTypes.object.isRequired,
  score: PropTypes.number.isRequired
};
