/*

A scroll component to find and list books to recommend to users

*/

import React, { Component } from "react";
import {
  ScrollView,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image
} from "react-native";
import styled from "styled-components/native";
import PropTypes from "prop-types";
import ReactNativeHaptic from "react-native-haptic";
import firebase from "react-native-firebase";

import ForYou from "./ForYou";

export default class ForYouList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tastes: this.props.userInfo.tastes,
      rankedBooks: []
    };

    this.score = this.score.bind(this);
    this.letterCounter = this.letterCounter.bind(this);
  }

  componentDidMount() {
    // Get the reviews of each book from Firebase
    const rankedBooks = [];
    this.props.books.forEach(book => {
      firebase
        .firestore()
        .collection(`books/${book.key}/goodReviews`)
        .get()
        .then(snapShot => {
          const goods = [];
          snapShot.forEach(doc => {
            const data = doc.data();
            goods.push({ tastes: data.tastes, key: doc.id });
          });
          rankedBooks.push({
            book,
            score: this.score(goods),
            key: book.key
          }); // Push each book into RankedBooks library with book information and recommendation score
          if (rankedBooks.length === this.props.books.length) {
            // Once all reviews are fetched
            this.setState({
              rankedBooks: rankedBooks.sort(function(a, b) {
                // Sort by highest score
                return b.score - a.score;
              })
            });
          }
        });
    });
  }

  score(goods) {
    // Goods paramater = array of taste strings from users who have reviewed book
    /*
    Each user has a tastes variable in his/her userInfo object.
    The variable's made up of 1's and 0's depending on his/her answers from the RecommendationsTest

    This method compares the user's tastes to those of users who have reviewed a book.
    It returns an integer from 1-100 to quantify how highly we recommend the book to the user
    */
    var score = 0; // Record score
    const complete = 1 / this.letterCounter(this.props.userInfo.tastes);
    // Each score is divided into n pieces of size 1/n (n = number of user's answers to recommendations test)

    for (i = 0; i < this.letterCounter(this.props.userInfo.tastes); i++) {
      // Loop through user's tastes variable
      const isOne = this.props.userInfo.tastes.substring(i, i + 1) === "1"; // Find if current character in tastes is a 1 or 0
      var oneCount = 0; // Count to record number of 1's in reviews at current spot i
      var noCount = 0; // Count to record number of reviews that don't have a value at current spot i
      goods.forEach(data => {
        const good = data.tastes;
        // Loop through reviews of book
        if (
          good.substring(i, i + 1) !== undefined &&
          good.substring(i, i + 1) === "1"
        ) {
          oneCount++; // If both characters are 1's in the same spot i, add one to the oneCount
        } else if (good.substring(i, i + 1) === undefined) {
          noCount++;
        }
      });
      if (isOne) {
        score += complete * (oneCount / (goods.length - noCount)); // If user's value at spot i is 1, add portion of complete value depending on the count of 1's in spot i
      } else {
        score += complete * (1 - oneCount / (goods.length - noCount)); // If user's value at spot i is 0, add (1 - portion) of complete value depending on the count of 1's in spot i
      }
    }

    return Math.round(score * 100);
  }

  letterCounter(str) {
    // Function to count number of characters in a user tastes string
    var letters = 0; // Letters count
    var alphabet = "10"; // Letters to count for
    var ar = alphabet.split(""); // Get array of all characters in word
    for (var i = 0; i < str.length; i++) {
      // Loop through ar array
      if (ar.indexOf(str[i]) > -1) {
        // If each character is in alphabet string
        letters = letters + 1; // Add to letter count
      }
    }
    return letters;
  }

  render() {
    var forYou = []; // Array of For You card objects
    if (
      this.state.rankedBooks.length > 0 &&
      this.letterCounter(this.props.userInfo.tastes) > 0
    ) {
      // if user tastes string has at least one character
      var forYouCount = 0;
      this.state.rankedBooks.forEach(book => {
        if (book.score > 60) {
          // Only recommend if book's score is greater than 60
          forYouCount++;
        }
      });
      forYouCount = forYouCount > 3 ? 3 : forYouCount; // Don't show more than three
      forYouCount = forYouCount === 0 ? 1 : forYouCount; // Show at least 1
      for (i = 0; i < forYouCount; i++) {
        // Loop through For You Books and make array of ForYou components
        forYou.push(
          <ForYou
            biggerBook={this.props.biggerBook}
            book={this.state.rankedBooks[i].book}
            score={this.state.rankedBooks[i].score}
            key={this.state.rankedBooks[i].key}
          />
        );
      }
    }
    return (
      <View>
        {this.state.rankedBooks.length > 0 && forYou}
        <View
          style={{
            width: Dimensions.get("window").width * 0.92,
            height: Dimensions.get("window").width * 0.6,
            borderRadius: 12,
            overflow: "hidden",
            padding: 20,
            backgroundColor: "#7A84FF",
            marginLeft: 15,
            marginTop: 15
          }}
        >
          <Text
            style={{
              fontFamily: "Avenir-Heavy",
              color: "white",
              fontSize: 16,
              opacity: 0.95
            }}
          >
            FOR YOU
          </Text>
          <Text
            style={{
              fontFamily: "Avenir-Black",
              fontSize: 32,
              marginRight: 20,
              color: "white"
            }}
          >
            Tell us about what you like to read
          </Text>
          <TouchableOpacity
            onPress={() => {
              this.props.enlargeRecs();
              ReactNativeHaptic.generate("selection");
            }}
          >
            <View
              style={{
                padding: 5,
                backgroundColor: "white",
                overflow: "hidden",
                borderRadius: 20,
                width: 100,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20
              }}
            >
              <AuthorText
                style={{
                  color: "#7A84FF",
                  fontFamily: "Avenir-Black",
                  fontSize: 15
                }}
              >
                Let&#39;s Go!
              </AuthorText>
            </View>
            <Text
              style={{
                fontFamily: "Avenir-Heavy",
                color: "white",
                fontSize: 16,
                marginTop: 15,
                backgroundColor: "transparent"
              }}
            >
              We&#39;ll tell you books we think you&#39;d like
            </Text>
          </TouchableOpacity>
        </View>
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

const Recommendation = styled.View`
  width: ${Dimensions.get("window").width * 0.8};
  height: ${Dimensions.get("window").height * 0.4};
  backgroundColor: #877DF3;
  borderRadius: 8;
  overflow: hidden;
`;

const AuthorText = styled.Text`
  fontFamily: Avenir-Medium;
  fontSize: 20;
  color: #DCDCDC;
`;

ForYouList.propTypes = {
  books: PropTypes.array.isRequired, // Array of book information
  userInfo: PropTypes.object.isRequired, // Object storing first name, last name, and tastes
  biggerBook: PropTypes.func.isRequired, // Function to enlarge books on Home Screen
  enlargeRecs: PropTypes.func.isRequired // Function to enlarge RecommendationsTest
};
