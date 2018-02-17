/*

A Search screen to search for and enlarge books

*/

import React, { Component } from "react";
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions
} from "react-native";
import PropTypes from "prop-types";
import styled from "styled-components/native";

import BigBook from "./BigBook";

import Book from "../Components/Book";

export default class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: "",
      bigBook: false // Records whether book is selected
    };

    this.optimizeResults = this.optimizeResults.bind(this);
    this.pickBook = this.pickBook.bind(this);
  }

  optimizeResults() {
    // Filter books by search query
    if (this.state.text === "") {
      return;
    }
    return this.props.books
      .filter(
        book =>
          book.title.toLowerCase().indexOf(this.state.text.toLowerCase()) !== -1 // Filter books using indexOf with titles
      )
      .map(book =>
        <Book
          book={book}
          bigBook={this.pickBook}
          user={this.props.user}
          key={book.key}
        />
      );
  }

  pickBook(book) {
    // Select and enlarge BigBook
    this.setState({
      bigBook: !this.state.bigBook,
      pickedBook: book
    });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {!this.state.bigBook &&
          <View style={{ padding: 15 }}>
            <MainText>Search</MainText>
            <TextInput
              onChangeText={text => this.setState({ text })}
              value={this.state.text}
              placeholder="Search books"
              style={{
                fontFamily: "Avenir-Heavy",
                backgroundColor: "#DCDCDC",
                padding: 10,
                overflow: "hidden",
                borderRadius: 8,
                fontSize: 16,
                marginTop: 15,
                marginBottom: 15
              }}
            />
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              {this.optimizeResults()}
            </View>
          </View>}
        {this.state.bigBook &&
          <BigBook
            book={this.state.pickedBook}
            close={this.pickBook}
            user={this.props.user}
            userInfo={this.props.userInfo}
            userHistory={this.props.userHistory}
          />}
      </View>
    );
  }
}

const MainText = styled.Text`
  marginTop: 15;
  fontFamily: Avenir-Black;
  fontSize: 28;
`;

Search.propTypes = {
  books: PropTypes.array.isRequired, // Array of objects containing book information
  user: PropTypes.object.isRequired, // Object containing user's Firestore information
  userInfo: PropTypes.object.isRequired, // Object containing user's first name, last name, and tastes
  userHistory: PropTypes.array.isRequired
};
