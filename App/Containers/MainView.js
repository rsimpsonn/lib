import React, { Component } from "react";
import {
  ScrollView,
  Text,
  Image,
  Dimensions,
  View,
  TouchableOpacity
} from "react-native";
import styled from "styled-components/native";
import firebase from "react-native-firebase";
import PropTypes from "prop-types";
import moment from "moment";
import ReactNativeHaptic from "react-native-haptic";

import BigGenre from "./BigGenre";
import BigBook from "./BigBook";
import Search from "./Search";
import Profile from "./Profile";

import GenresList from "../Components/GenresList";
import ForYouList from "../Components/ForYouList";
import Feature from "../Components/Feature";
import RecommendationsTest from "../Components/RecommendationsTest";

import TabBar from "../Components/TabBar";

export default class MainView extends Component {
  constructor(props) {
    super(props);

    this.booksRef = firebase.firestore().collection("books");
    this.state = {
      bigGenre: false,
      search: false,
      bigBook: false,
      profile: false,
      recommendations: false
    };

    this.unsubscribe = null;

    this.biggerGenre = this.biggerGenre.bind(this);
    this.biggerBook = this.biggerBook.bind(this);
    this.onCollectionUpdate = this.onCollectionUpdate.bind(this);
    this.search = this.search.bind(this);
    this.enlargeRecs = this.enlargeRecs.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = this.booksRef.onSnapshot(this.onCollectionUpdate);
  }

  onCollectionUpdate = querySnapshot => {
    const array = [];

    querySnapshot.forEach(book => {
      const data = book.data();
      const statusArray = [];
      firebase
        .firestore()
        .collection(`books/${book.id}/status`)
        .get()
        .then(snapShot =>
          snapShot.forEach(doc => {
            const statusData = doc.data();
            statusArray.push({
              by: statusData.by,
              dueAt: statusData.dueAt,
              name: statusData.name,
              status: statusData.status,
              at: statusData.at
            });
          })
        );
      array.push({
        key: book.id,
        author: data.author,
        title: data.title,
        year: data.year,
        rating: data.rating,
        checkedOut: data.checkedOut,
        cover: data.image,
        pages: data.pages,
        header: data.header !== undefined ? data.header : null,
        feature: data.feature !== undefined ? data.feature : null,
        description: data.description,
        genres: data.genres,
        status: statusArray,
        location: data.location
      });
    });
    this.setState({
      books: array
    });
  };

  biggerGenre(genre) {
    this.setState({
      bigGenre: !this.state.bigGenre,
      pickedGenre: genre
    });
  }

  biggerBook(book) {
    ReactNativeHaptic.generate("selection");
    this.setState({
      bigBook: !this.state.bigBook,
      pickedBook: book
    });
  }

  enlargeRecs() {
    this.setState({
      recommendations: !this.state.recommendations
    });
  }

  search(number) {
    if (number === 1) {
      this.setState({
        bigGenre: false,
        search: true,
        profile: false,
        bigBook: false
      });
    } else if (number === 2) {
      this.setState({
        search: false,
        profile: false
      });
    } else {
      this.setState({
        profile: true,
        search: false,
        bigGenre: false,
        bigBook: false
      });
    }
  }

  render() {
    return (
      <View
        style={{
          backgroundColor: "white",
          height: Dimensions.get("window").height,
          flexGrow: 1
        }}
      >
        {!this.state.bigGenre &&
          !this.state.bigBook &&
          !this.state.search &&
          !this.state.profile &&
          !this.state.recommendations &&
          <ScrollView
            contentContainerStyle={{
              justifyContent: "center",
              alignItems: "flex-start"
            }}
          >
            {this.props.userInfo &&
              <BigText>Hey, {this.props.userInfo.firstName}!</BigText>}
            <MainText>Welcome to the library!</MainText>
            {this.state.books &&
              <ScrollView>
                <GenresList
                  books={this.state.books}
                  biggerGenre={this.biggerGenre}
                  biggerBook={this.biggerBook}
                />
                <Feature
                  books={this.state.books.filter(book => book.feature !== null)}
                  biggerBook={this.biggerBook}
                />
                <ForYouList
                  books={this.state.books.filter(book => book.feature !== null)}
                  userInfo={this.props.userInfo}
                  biggerBook={this.biggerBook}
                  enlargeRecs={this.enlargeRecs}
                />
              </ScrollView>}
          </ScrollView>}
        {this.state.bigGenre &&
          <View>
            <BigGenre
              books={this.state.books.filter(
                book => book.genres.indexOf(this.state.pickedGenre) !== -1
              )}
              genre={this.state.pickedGenre}
              bigBook={this.biggerBook}
              user={this.props.user}
              userInfo={this.props.userInfo}
              close={this.biggerGenre}
              userHistory={this.props.userHistory}
            />
          </View>}
        {this.state.search &&
          <Search
            books={this.state.books}
            user={this.props.user}
            userInfo={this.props.userInfo}
          />}
        {this.state.profile &&
          <Profile
            user={this.props.user}
            userInfo={this.props.userInfo}
            userHistory={this.props.userHistory}
            books={this.state.books}
          />}
        {this.state.bigBook &&
          <ScrollView>
            <BigBook
              book={this.state.pickedBook}
              close={this.biggerBook}
              user={this.props.user}
              userInfo={this.props.userInfo}
              userHistory={this.props.userHistory}
            />
          </ScrollView>}
        {this.state.recommendations &&
          <RecommendationsTest
            userInfo={this.props.userInfo}
            close={this.enlargeRecs}
            user={this.props.user}
          />}
        <TabBar
          style={{ position: "absolute", bottom: 0 }}
          navigation={{ search: this.search }}
        />
      </View>
    );
  }
}

const MainText = styled.Text`
  fontFamily: Avenir-Black;
  color: #DCDCDC;
  fontSize: 14;
  marginLeft: 15;
`;

const BigText = styled.Text`
  marginTop: 30;
  fontFamily: Avenir-Black;
  fontSize: 28;
  marginLeft: 15
`;

MainView.propTypes = {
  user: PropTypes.object.isRequired,
  userInfo: PropTypes.object.isRequired,
  userHistory: PropTypes.array.isRequired,
  navigation: PropTypes.object.isRequired
};
