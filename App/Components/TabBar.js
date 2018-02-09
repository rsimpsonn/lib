/*

A tab bar component to direct navigation to Search, Home, and Profile

*/

import React, { Component } from "react";
import { View, Text, Image, Dimensions, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import PropTypes from "prop-types";
import Icon from "react-native-vector-icons/FontAwesome";

export default class TabBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selection: this.home
    };

    this.search = 1;
    this.home = 2;
    this.profile = 3;

    this.changeSelection = this.changeSelection.bind(this);
  }

  changeSelection(selection) {
    // Responds to touch event and directs navigation to user selection
    const previousIndex = this.state.selection;
    this.setState({
      selection
    });
    this.props.navigation(selection); // Call props function to change screens on MainView
  }

  render() {
    return (
      <View
        style={{
          height: 60,
          width: Dimensions.get("window").width,
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center"
        }}
      >
        <TouchableOpacity
          style={{ margin: 20 }}
          onPress={() => this.changeSelection(this.search)}
        >
          <Icon
            name="search"
            size={30}
            color={this.state.selection === 1 ? "#157DFB" : "#DCDCDC"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ margin: 20 }}
          onPress={() => this.changeSelection(this.home)}
        >
          <Icon
            name="home"
            size={30}
            color={this.state.selection === 2 ? "#157DFB" : "#DCDCDC"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ margin: 20 }}
          onPress={() => this.changeSelection(this.profile)}
        >
          <Icon
            name="user-circle"
            size={30}
            color={this.state.selection === 3 ? "#157DFB" : "#DCDCDC"}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

TabBar.propTypes = {
  navigation: PropTypes.func.isRequired // Function to change current screen on parent class MainView
};
