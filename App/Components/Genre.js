import React, { Component } from "react";
import { View, Text, Dimensions, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import PropTypes from "prop-types";
import ReactNativeHaptic from "react-native-haptic";

export default class Genre extends Component {
  constructor(props) {
    super(props);

    this.genreTap = this.genreTap.bind(this);
  }

  genreTap() {
    ReactNativeHaptic.generate("selection");
    this.props.big(this.props.genre.name);
  }

  render() {
    return (
      <TouchableOpacity onPress={() => this.genreTap()}>
        <GenreButton bgColor={this.props.color}>
          <MainText>{this.props.genre.name}</MainText>
          <MainText style={{ fontFamily: "Avenir-Roman" }}>
            {this.props.genre.number} book{this.props.genre.number === 1 ? "" : "s"}
          </MainText>
        </GenreButton>
      </TouchableOpacity>
    );
  }
}

const GenreButton = styled.View`
  width: ${Dimensions.get("window").width * 0.36};
  height: 100;
  padding: 15px;
  overflow: hidden;
  borderRadius: 8;
  marginLeft: 15;

  ${props => `
    backgroundColor: ${props.bgColor}`}
`;

const MainText = styled.Text`
  color: white;
  fontSize: 17;
  fontFamily: Avenir-Heavy;
`;

Genre.propTypes = {
  genre: PropTypes.object.isRequired,
  big: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired
};
