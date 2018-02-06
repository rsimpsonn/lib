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
      bigBook: false
    };

    this.biggerBook = this.biggerBook.bind(this);
  }

  biggerBook(book) {
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
  books: PropTypes.array.isRequired,
  genre: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  userInfo: PropTypes.object.isRequired,
  close: PropTypes.func.isRequired,
  userHistory: PropTypes.array.isRequired
};

const MainText = styled.Text`
  fontFamily: Avenir-Black;
  color: #DCDCDC;
  fontSize: 14;
  marginTop: 30;
`;
