import React, { Component } from "react";
import { View, Text, Dimensions } from "react-native";
import styled from "styled-components/native";
import PropTypes from "prop-types";

export default class RecommendCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Text
          style={{ fontFamily: "TimesNewRomanPS-ItalicMT", color: "#43352F" }}
        >
          {this.props.rec.title}
        </Text>
        <View style={{ marginTop: 20, marginBottom: 20 }}>
          {this.props.rec.description.map(data =>
            <Text
              style={{
                fontFamily: "TimesNewRomanPSMT",
                color: "#43352F",
                fontSize: 16,
                margin: 5,
                marginLeft: 50,
                marginRight: 50
              }}
            >
              {data}
            </Text>
          )}
        </View>
        <Text
          style={{ fontFamily: "TimesNewRomanPS-ItalicMT", color: "#43352F" }}
        >
          {this.props.rec.page}
        </Text>
      </View>
    );
  }
}

RecommendCard.propTypes = {
  rec: PropTypes.object.isRequired
};
