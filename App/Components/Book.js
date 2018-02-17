/*

A button to display a cover and enlarge books on press.

*/

import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  Dimensions,
  TouchableOpacity,
  Alert
} from "react-native";
import styled from "styled-components/native";
import PropTypes from "prop-types";
import ReactNativeHaptic from "react-native-haptic";
import moment from "moment";
import Icon from "react-native-vector-icons/FontAwesome";

export default class Book extends Component {
  constructor(props) {
    super(props);

    this.state = {
      history: this.props.book.status.sort(function(a, b) {
        return (
          moment(b.at, "MMMM Do, h:mm:ss a") -
          moment(a.at, "MMMM Do, h:mm:ss a") // Use momentJS library to compare dates
        );
      })
    };

    this.tapBook = this.tapBook.bind(this);
  }

  tapBook() {
    // Method to respond to touch event
    ReactNativeHaptic.generate("selection"); // Haptic feedback
    this.props.bigBook(this.props.book); // Enlarge books using function from parent
  }

  render() {
    return (
      <TouchableOpacity onPress={() => this.tapBook()}>
        <View style={{ margin: 10, marginBottom: 20 }}>
          <Image
            style={{
              width: Dimensions.get("window").width * 0.25,
              height: Dimensions.get("window").width * 0.4
            }}
            source={{ uri: this.props.book.cover }}
          />
        </View>
      </TouchableOpacity>
    );
  }
}

Book.propTypes = {
  book: PropTypes.object.isRequired, // Book object carrying book information data
  bigBook: PropTypes.func.isRequired // Function to enlarge book
};
