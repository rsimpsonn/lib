/*

Main Screen of the app to manage navigation and display Home Screen, Search Screen, Profile Screen, or Enlarged Books/Genres
Enters on Home Screen


*/

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

    this.booksRef = firebase.firestore().collection("books"); // Collection reference to all book information
    this.state = {
      bigGenre: false, // Records whether BigGenre is enlarged
      search: false, // Records whether Search is enlarged
      bigBook: false, // Records whether BigBook is enlarged
      profile: false, // Records whether Profile is enlarged
      recommendations: false // Records whether RecommendationsTest is enlarged
    };

    this.unsubscribe = null;

    this.biggerGenre = this.biggerGenre.bind(this);
    this.biggerBook = this.biggerBook.bind(this);
    this.onCollectionUpdate = this.onCollectionUpdate.bind(this);
    this.navigation = this.navigation.bind(this);
    this.enlargeRecs = this.enlargeRecs.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = this.booksRef.onSnapshot(this.onCollectionUpdate); // Get realtime updates to changes in book data
  }

  onCollectionUpdate = querySnapshot => {
    // Store all book information
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
        key: book.id, // book UID for getting data from database
        author: data.author, // author
        title: data.title, // title
        year: data.year, // year published
        rating: data.rating, // rating (1-5)
        checkedOut: data.checkedOut,
        cover: data.image, // link to book cover image
        pages: data.pages, // page count
        header: data.header !== undefined ? data.header : null, // header for BigBook
        feature: data.feature !== undefined ? data.feature : null, // Feature for Feature or ForYou
        description: data.description, // book synopsis
        genres: data.genres, // array of book genres
        status: statusArray, // history of book statuses
        location: data.location // location of book in library
      });
    });
    this.setState({
      books: array
    });
  };

  biggerGenre(genre) {
    // Enlarge BigGenre
    this.setState({
      bigGenre: !this.state.bigGenre,
      pickedGenre: genre
    });
  }

  biggerBook(book) {
    // Enlarge BigBook
    ReactNativeHaptic.generate("selection"); // Haptic feedback
    this.setState({
      bigBook: !this.state.bigBook,
      pickedBook: book
    });
  }

  enlargeRecs() {
    // Enlarge RecommendationsTest
    this.setState({
      recommendations: !this.state.recommendations
    });
  }

  navigation(number) {
    // Navigate to different screens using data from TabBar
    if (number === 1) {
      // Go to Search screen
      this.setState({
        bigGenre: false,
        search: true,
        profile: false,
        bigBook: false
      });
    } else if (number === 2) {
      // Go to Home screen
      this.setState({
        search: false,
        profile: false
      });
    } else {
      // Go to Profile Screen
      this.setState({
        profile: true,
        search: false,
        bigGenre: false,
        bigBook: false
      });
    }
  }

  componentWillUnmount() {
    // Unsubscribe from book data updates
    this.unsubscribe();
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
          <View style={{ flex: 1 }}>
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
          navigation={this.navigation}
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
  user: PropTypes.object.isRequired, // Object containing user Firestore data
  userInfo: PropTypes.object.isRequired, // Object containing user's first name, last name, and tastes
  userHistory: PropTypes.array.isRequired // Object containing user's book history
};
