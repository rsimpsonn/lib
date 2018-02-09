/*

A view listing all books in a genre

*/

import React, { Component } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  Dimensions
} from "react-native";
import styled from "styled-components/native";
import PropTypes from "prop-types";

import Book from "../Components/Book";
import BigBook from "./BigBook";

export default class BigGenre extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bigBook: false // Record whether book is enlarged
    };

    this.biggerBook = this.biggerBook.bind(this);
  }

  biggerBook(book) {
    // Function to enlarge book on tap
    this.setState({
      bigBook: !this.state.bigBook,
      pickedBook: book
    });
  }

  render() {
    return (
      <View>
        <ScrollView
          contentContainerStyle={{
            justifyContent: "center",
            backgroundColor: "white",
            alignItems: "center"
          }}
        >
          {!this.state.bigBook &&
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: Dimensions.get("window").width
              }}
            >
              <MainText>{this.props.genre}</MainText>
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  padding: 10
                }}
              >
                {this.props.books.map(book =>
                  <Book book={book} bigBook={this.biggerBook} />
                )}
              </View>
              <TouchableOpacity
                style={{ position: "absolute", top: 30, left: 10 }}
                onPress={() => this.props.close(null)}
              >
                <Image source={require("../Images/back_black.png")} />
              </TouchableOpacity>
            </View>}
        </ScrollView>
        {this.state.bigBook &&
          <BigBook
            book={this.state.pickedBook}
            close={this.biggerBook}
            user={this.props.user}
            userInfo={this.props.userInfo}
            userHistory={this.props.userHistory}
          />}
      </View>
    );
  }
}

BigGenre.propTypes = {
  books: PropTypes.array.isRequired, // Array of books pre-filtered by specified genre
  genre: PropTypes.string.isRequired, // Specified genre
  user: PropTypes.object.isRequired, // Object containing user's Firestore information
  userInfo: PropTypes.object.isRequired, // Object containing user's first name, last name, and tastes
  close: PropTypes.func.isRequired, // Function to close BigGenre on MainView
  userHistory: PropTypes.array.isRequired // Array containing user's book history
};

const MainText = styled.Text`
  fontFamily: Avenir-Black;
  color: #DCDCDC;
  fontSize: 14;
  marginTop: 30;
`;
