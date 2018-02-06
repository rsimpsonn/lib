import React, { Component } from "react";
import { View, Text, Image, Dimensions } from "react-native";
import PropTypes from "prop-types";

export default class BookInfo extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 20,
          marginBottom: 20,
          backgroundColor: "#F2F2F2",
          padding: 40,
          width: Dimensions.get("window").width
        }}
      >
        <Image
          source={{ uri: this.props.book.cover }}
          style={{
            width: 80,
            height: 120,
            borderRadius: 8,
            overflow: "hidden"
          }}
        />
        <Text
          style={{
            fontFamily: "Avenir-Black",
            color: "#A1A1A1",
            fontSize: 16
          }}
        >
          {this.props.book.pages} pages
        </Text>
      </View>
    );
  }
}

BookInfo.propTypes = {
  book: PropTypes.object.isRequired
};
