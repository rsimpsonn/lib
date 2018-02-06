import React, { Component } from "react";
import { View, Image, Text, Dimensions, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import PropTypes from "prop-types";
import ReactNativeHaptic from "react-native-haptic";

export default class Book extends Component {
  constructor(props) {
    super(props);

    this.tapBook = this.tapBook.bind(this);
  }

  tapBook() {
    ReactNativeHaptic.generate("selection");
    this.props.bigBook(this.props.book);
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
  book: PropTypes.object.isRequired,
  bigBook: PropTypes.func.isRequired
};
