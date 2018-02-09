/*

A popup to get a user's review on a returned book

*/

import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text, Image, Dimensions, TouchableOpacity } from "react-native";
import firebase from "react-native-firebase";
import Icon from "react-native-vector-icons/FontAwesome";

export default class ReviewPopup extends Component {
  constructor(props) {
    super(props);

    this.submit = this.submit.bind(this);
  }

  submit() {
    // Method to save a user's review
    firebase
      .firestore()
      .collection(`books/${this.props.book.key}/goodReviews`)
      .add({
        tastes: this.props.userInfo.tastes // Saves user's tastes to compare to others' tastes to recommend book
      });

    this.props.close(); // Close popup
  }

  render() {
    return (
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 12,
          overflow: "hidden",
          padding: 40,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Text
          style={{
            fontFamily: "Avenir-Heavy",
            color: "#DCDCDC",
            fontSize: 16
          }}
        >
          HOW WAS
        </Text>
        <Text
          style={{
            fontFamily: "Avenir-Black",
            fontSize: 20,
            color: "black",
            textAlign: "center"
          }}
        >
          {this.props.book.title}
        </Text>
        <Image
          style={{
            borderRadius: 8,
            overflow: "hidden",
            width: 120,
            height: 180,
            marginTop: 15,
            marginBottom: 50
          }}
          source={{ uri: this.props.book.cover }}
        />
        <TouchableOpacity
          onPress={() => this.props.close()}
          style={{ margin: 10, position: "absolute", bottom: 15, left: 15 }}
        >
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: "#157DFB",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Icon name="thumbs-down" size={30} color="#fff" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.submit()}
          style={{ margin: 10, position: "absolute", bottom: 15, right: 15 }}
        >
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: "#157DFB",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Icon name="thumbs-up" size={30} color="#fff" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ position: "absolute", top: 15, right: 15 }}
          onPress={() => this.props.close()}
        >
          <Icon name="times" color="#157DFB" size={20} />
        </TouchableOpacity>
      </View>
    );
  }
}

ReviewPopup.propTypes = {
  book: PropTypes.object.isRequired, // Object storing book information
  close: PropTypes.func.isRequired, // Function to close popup
  userInfo: PropTypes.object.isRequired // Object storing first name, last name, and book tastes
};
