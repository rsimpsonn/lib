/*

A Profile Screen to show and enlarge books the user has reserved, checked out, or returned

*/

import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity
} from "react-native";
import styled from "styled-components/native";
import firebase from "react-native-firebase";
import PropTypes from "prop-types";

import BigBook from "./BigBook";

import Book from "../Components/Book";

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      reservedBooks: this.getBooks(1), // Array of book information for books user has reserved
      checkedOutBooks: this.getBooks(2), // Array of book information for books user has checked out
      returnedBooks: this.getBooks(3), // Array of book information for books user has returned
      bigBook: false, // Records whether BigBook is enlarged
      noBooks: true
    };

    this.logOut = this.logOut.bind(this);
    this.biggerBook = this.biggerBook.bind(this);
    this.getBooks = this.getBooks.bind(this);
  }

  getBooks(status) {
    // Get books depending on book's status
    const history = this.props.userHistory.filter(
      // Filter books by status parameter of function
      book => book.status === status
    );
    const books = history.map(
      // Return book information from books props array, userHistory only records the keys of books
      book =>
        this.props.books[this.props.books.findIndex(bk => bk.key === book.book)] // Match by books' keys
    );
    if (books.length > 0) {
      this.setState({
        noBooks: false
      });
    }
    return books;
  }

  logOut() {
    // Log user out and unsubscribe from notifications
    firebase.messaging().unsubscribeFromTopic(this.props.user.uid);
    firebase.auth().signOut();
  }

  biggerBook(pickedBook) {
    // Enlarge BigBook
    this.setState({
      bigBook: !this.state.bigBook,
      pickedBook
    });
  }

  render() {
    return (
      <ScrollView
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
          width: Dimensions.get("window").width
        }}
      >
        {!this.state.bigBook &&
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <MainText>
              {this.props.userInfo.firstName} {this.props.userInfo.lastName}
            </MainText>
            <TouchableOpacity
              style={{ position: "absolute", top: 20, right: 15 }}
              onPress={() => this.logOut()}
            >
              <Text
                style={{
                  fontFamily: "Avenir",
                  fontSize: 14,
                  color: "#157DFB",
                  marginBottom: 20
                }}
              >
                Log Out
              </Text>
            </TouchableOpacity>
            {this.state.noBooks &&
              <StatusText>You haven&#39;t reserved any books!</StatusText>}
            {this.state.reservedBooks.length > 0 &&
              <StatusText>Your Reservations</StatusText>}
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {this.state.reservedBooks.map(book =>
                <Book book={book} bigBook={this.biggerBook} />
              )}
            </View>
            {this.state.checkedOutBooks.length > 0 &&
              <StatusText>Your Checked Out Books</StatusText>}
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {this.state.checkedOutBooks.map(book =>
                <Book book={book} bigBook={this.biggerBook} />
              )}
            </View>
            {this.state.returnedBooks.length > 0 &&
              <StatusText>Your Returned Books</StatusText>}
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {this.state.returnedBooks.map(book =>
                <Book book={book} bigBook={this.biggerBook} />
              )}
            </View>
          </View>}
        {this.state.bigBook &&
          <BigBook
            book={this.state.pickedBook}
            close={this.biggerBook}
            user={this.props.user}
            userInfo={this.props.userInfo}
            userHistory={this.props.userHistory}
          />}
      </ScrollView>
    );
  }
}

const MainText = styled.Text`
  fontFamily: Avenir-Black;
  fontSize: 28;
  marginTop: ${Dimensions.get("window").height * 0.15};;
`;

const StatusText = styled.Text`
  color: #DCDCDC;
  fontSize: 14;
  fontFamily: Avenir-Black;
  marginTop: 20;
`;

Profile.propTypes = {
  userInfo: PropTypes.object.isRequired, // Object containing user's first name, last name, and tastes
  userHistory: PropTypes.array.isRequired, // Array containing user's book history
  user: PropTypes.object.isRequired, // Object containing user's Firestore information
  books: PropTypes.array.isRequired // Array of objects containing book information
};
