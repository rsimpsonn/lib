import React, { Component } from "react";
import { View, Text, Image, Dimensions, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import PropTypes from "prop-types";
import Icon from "react-native-vector-icons/FontAwesome";

export default class TabBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selection: 2
    };

    this.changeSelection = this.changeSelection.bind(this);
  }

  changeSelection(selection) {
    const previousIndex = this.state.selection;
    this.setState({
      selection
    });
    this.props.navigation.search(selection);
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
          onPress={() => this.changeSelection(1)}
        >
          <Icon
            name="search"
            size={30}
            color={this.state.selection === 1 ? "#157DFB" : "#DCDCDC"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ margin: 20 }}
          onPress={() => this.changeSelection(2)}
        >
          <Icon
            name="home"
            size={30}
            color={this.state.selection === 2 ? "#157DFB" : "#DCDCDC"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ margin: 20 }}
          onPress={() => this.changeSelection(3)}
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
  navigation: PropTypes.object.isRequired
};
