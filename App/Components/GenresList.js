import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity
} from "react-native";
import styled from "styled-components/native";
import PropTypes from "prop-types";

import Genre from "./Genre";

export default class GenresList extends Component {
  constructor(props) {
    super(props);

    this.getCount = this.getCount.bind(this);
  }

  getCount(genre) {
    var count = 0;
    this.props.books.forEach(book => {
      if (book.genres.indexOf(genre) !== -1) {
        count++;
      }
    });
    return count;
  }

  render() {
    return (
      <View>
        <ScrollView
          horizontal={true}
          contentContainerStyle={{
            marginTop: 15,
            marginBottom: 10
          }}
        >
          <Genre
            genre={{ name: "Fiction", number: this.getCount("Fiction") }}
            big={this.props.biggerGenre}
            color="#FF5A8D"
          />
          <Genre
            genre={{
              name: "Coming of Age",
              number: this.getCount("Coming of Age")
            }}
            big={this.props.biggerGenre}
            color="#B3C1FF"
          />
          <Genre
            genre={{
              name: "Science Fiction",
              number: this.getCount("Science Fiction")
            }}
            big={this.props.biggerGenre}
            color="#B5F79E"
          />
        </ScrollView>
      </View>
    );
  }
}

const MainText = styled.Text`
  fontFamily: Avenir-Black;
  color: #DCDCDC;
  fontSize: 14;
  marginLeft: 15;
  marginTop: 10;
`;

GenresList.propTypes = {
  books: PropTypes.array.isRequired,
  biggerGenre: PropTypes.func.isRequired
};
