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
      reservedBooks: this.props.userHistory.filter(book => book.status === 1),
      checkedOutBooks: this.props.userHistory.filter(book => book.status === 2),
      returnedBooks: this.props.userHistory.filter(book => book.status === 3),
      bigBook: false
    };

    this.logOut = this.logOut.bind(this);
    this.biggerBook = this.biggerBook.bind(this);
  }

  componentDidMount() {}

  logOut() {
    firebase.auth().signOut();
  }

  biggerBook(pickedBook) {
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
            {this.state.reservedBooks.length > 0 &&
              <StatusText>Your Reservations</StatusText>}
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {this.state.reservedBooks.map(book =>
                <Book book={book.book} bigBook={this.biggerBook} />
              )}
            </View>
            {this.state.checkedOutBooks.length > 0 &&
              <StatusText>Your Checked Out Books</StatusText>}
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {this.state.checkedOutBooks.map(book =>
                <Book book={book.book} bigBook={this.biggerBook} />
              )}
            </View>
            {this.state.returnedBooks.length > 0 &&
              <StatusText>Your Returned Books</StatusText>}
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {this.state.returnedBooks.map(book =>
                <Book book={book.book} bigBook={this.biggerBook} />
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
  userInfo: PropTypes.object.isRequired,
  userHistory: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  books: PropTypes.array.isRequired
};
