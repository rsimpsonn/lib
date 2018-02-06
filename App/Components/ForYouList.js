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
            goods.push(data.tastes);
          });
          rankedBooks.push({ book, score: this.score(goods) });
          if (rankedBooks.length === this.props.books.length) {
            this.setState({
              rankedBooks: rankedBooks.sort(function(a, b) {
                return b.score - a.score;
              })
            });
          }
        });
    });
  }

  score(goods) {
    var score = 0;
    const complete = 1 / this.letterCounter(this.props.userInfo.tastes);

    for (i = 0; i < this.letterCounter(this.props.userInfo.tastes); i++) {
      const isOne = this.props.userInfo.tastes.substring(i, i + 1) === "1";
      var oneCount = 0;
      var noCount = 0;
      goods.forEach(good => {
        if (
          good.substring(i, i + 1) !== undefined &&
          good.substring(i, i + 1) === "1"
        ) {
          oneCount++;
        } else if (good.substring(i, i + 1) === undefined) {
          noCount++;
        }
      });
      if (isOne) {
        score += complete * (oneCount / (goods.length - noCount));
      } else {
        score += complete * (1 - oneCount / (goods.length - noCount));
      }
    }

    return Math.round(score * 100);
  }

  letterCounter(str) {
    var letters = 0;
    var alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ10";
    var ar = alphabet.split("");
    for (var i = 0; i < str.length; i++) {
      if (ar.indexOf(str[i]) > -1) {
        letters = letters + 1;
      }
    }
    return letters;
  }

  render() {
    if (this.state.rankedBooks.length > 0) {
      var forYouCount = 0;
      var forYou = [];
      this.state.rankedBooks.forEach(book => {
        if (book.score > 60) {
          forYouCount++;
        }
      });
      forYouCount = forYouCount > 3 ? 3 : forYouCount;
      forYouCount = forYouCount === 0 ? 1 : forYouCount;
      for (i = 0; i < forYouCount; i++) {
        forYou.push(
          <ForYou
            biggerBook={this.props.biggerBook}
            book={this.state.rankedBooks[i].book}
            score={this.state.rankedBooks[i].score}
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
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: "Avenir-Heavy",
              color: "white",
              fontSize: 16,
              position: "absolute",
              bottom: 10,
              left: 20,
              backgroundColor: "transparent"
            }}
          >
            And we&#39;ll tell you books we think you&#39;d like
          </Text>
        </View>
      </View>
    );
  }
}

// {this.props.userInfo.tastes && <ForYou book={this.props.books[0]} />}
/* <Image
  source={require("../Images/confetti.png")}
  style={{
    width: 220,
    height: 160,
    position: "absolute",
    marginTop: 110,
    marginLeft: 70
  }}
/>*/

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
  books: PropTypes.array.isRequired,
  userInfo: PropTypes.object.isRequired,
  biggerBook: PropTypes.func.isRequired,
  enlargeRecs: PropTypes.func.isRequired
};
