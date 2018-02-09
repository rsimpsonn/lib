/*

A "Book of the Day" slide to feature books on the Home Screen.

*/

import React, { Component } from "react";
import { View, Text, Image, Dimensions, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";

export default class Feature extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableOpacity
        onPress={() => this.props.biggerBook(this.props.books[0])}
      >
        <View style={{ margin: 15 }}>
          <View
            style={{
              backgroundColor: "black",
              borderRadius: 12,
              overflow: "hidden"
            }}
          >
            <Image
              style={{
                width: Dimensions.get("window").width * 0.92,
                height: Dimensions.get("window").width * 1,
                opacity: 0.9
              }}
              source={{ uri: this.props.books[0].feature }}
            />
          </View>
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
                opacity: 1
              }}
            >
              BOOK OF THE DAY
            </Text>
            <Text
              style={{
                fontFamily: "Avenir-Black",
                fontSize: 32,
                color: "white"
              }}
            >
              {this.props.books[0].title}
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
            {this.props.books[0].author}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

Feature.propTypes = {
  books: PropTypes.array.isRequired, // Filtered array for books with feature image
  biggerBook: PropTypes.func.isRequired // Function to enlarge book
};
