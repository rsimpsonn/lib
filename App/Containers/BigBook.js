import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Animated
} from "react-native";
import styled from "styled-components/native";
import PropTypes from "prop-types";
import StarRating from "react-native-star-rating";
import firebase from "react-native-firebase";
import moment from "moment";
import ReactNativeHaptic from "react-native-haptic";

import LibraryMap from "../Components/LibraryMap";
import BookInfo from "../Components/BookInfo";
import ReviewPopup from "../Components/ReviewPopup";

export default class BigBook extends Component {
  constructor(props) {
    super(props);

    this.state = {
      seeMore: false,
      seeMoreText: "See more",
      offset: new Animated.Value(Dimensions.get("window").height * 0.3),
      review: false
    };

    this.reserveBook = this.reserveBook.bind(this);
    this.checkOutBook = this.checkOutBook.bind(this);
    this.returnBook = this.returnBook.bind(this);
    this.checkStatus = this.checkStatus.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    this.props.book.status.sort(function(a, b) {
      return (
        moment(b.at, "MMMM Do, h:mm:ss a") - moment(a.at, "MMMM Do, h:mm:ss a")
      );
    });
    this.checkStatus();
  }

  checkStatus() {
    const lastStatus = this.props.book.status[0];
    if (lastStatus === undefined || lastStatus.status === "Returned") {
      this.setState({
        available: true,
        status: "Reserve"
      });
    } else if (lastStatus.status === "Reserved") {
      if (moment() > moment(lastStatus.dueAt, "MMMM Do, h:mm a")) {
        this.setState({
          available: true,
          status: "Reserve"
        });
      } else {
        if (lastStatus.by === this.props.user.uid) {
          this.setState({
            available: false,
            status: "Your reservation expires on",
            ownedByThisUser: true
          });
        } else {
          this.setState({
            available: false,
            status: `Reserved by ${lastStatus.name}`,
            ownedByThisUser: false
          });
        }
      }
    } else if (lastStatus.status === "Checked Out") {
      if (moment() > moment(lastStatus.dueAt, "MMMM Do, h:mm a")) {
        this.setState({
          available: true,
          status: "Reserve"
        });
      } else {
        if (lastStatus.by === this.props.user.uid) {
          this.setState({
            available: false,
            status: "Your book is due on",
            ownedByThisUser: true
          });
        } else {
          this.setState({
            available: false,
            status: `Owned by ${lastStatus.name}`,
            ownedByThisUser: false
          });
        }
      }
    }
  }

  reserveBook() {
    ReactNativeHaptic.generate("impact");
    firebase.firestore().collection(`books/${this.props.book.key}/status`).add({
      status: "Reserved",
      by: this.props.user.uid,
      name: this.props.userInfo.firstName + " " + this.props.userInfo.lastName,
      dueAt: moment().add(7, "days").format("MMMM Do, h:mm a"),
      at: moment().format("MMMM Do, h:mm:ss a")
    });

    firebase
      .firestore()
      .collection(`users/${this.props.user.uid}/history`)
      .doc(this.props.book.key)
      .set({
        status: 1,
        dueAt: moment().add(7, "days").format("MMMM Do, h:mm a"),
        book: this.props.book
      });

    this.props.userHistory.push({
      status: 1,
      dueAt: moment().add(7, "days").format("MMMM Do, h:mm a"),
      book: this.props.book
    });

    this.props.book.status.splice(0, 0, {
      status: "Reserved",
      by: this.props.user.uid,
      name: this.props.userInfo.firstName + " " + this.props.userInfo.lastName,
      dueAt: moment().add(7, "days").format("MMMM Do, h:mm a"),
      at: moment().format("MMMM Do, h:mm:ss a")
    });

    this.checkStatus();
  }

  checkOutBook() {
    ReactNativeHaptic.generate("impact");
    firebase.firestore().collection(`books/${this.props.book.key}/status`).add({
      status: "Checked Out",
      by: this.props.user.uid,
      name: this.props.userInfo.firstName + " " + this.props.userInfo.lastName,
      dueAt: moment().add(1, "months").format("MMMM Do, h:mm a"),
      at: moment().format("MMMM Do, h:mm:ss a")
    });

    firebase
      .firestore()
      .doc(`users/${this.props.user.uid}/history/${this.props.book.key}`)
      .update({
        status: 2,
        dueAt: moment().add(1, "months").format("MMMM Do, h:mm a")
      });

    this.props.book.status.splice(0, 0, {
      status: "Checked Out",
      by: this.props.user.uid,
      name: this.props.userInfo.firstName + " " + this.props.userInfo.lastName,
      dueAt: moment().add(1, "months").format("MMMM Do, h:mm a"),
      at: moment().format("MMMM Do, h:mm:ss a")
    });

    this.checkStatus();
  }

  returnBook() {
    ReactNativeHaptic.generate("selection");
    firebase.firestore().collection(`books/${this.props.book.key}/status`).add({
      status: "Returned",
      by: this.props.user.uid,
      name: this.props.userInfo.firstName + " " + this.props.userInfo.lastName,
      at: moment().format("MMMM Do, h:mm:ss a")
    });

    firebase
      .firestore()
      .doc(`users/${this.props.user.uid}/history/${this.props.book.key}`)
      .update({
        status: 3,
        dueAt: moment().add(1, "months").format("MMMM Do, h:mm a")
      });

    this.props.book.status.splice(0, 0, {
      status: "Returned",
      by: this.props.user.uid,
      name: this.props.userInfo.firstName + " " + this.props.userInfo.lastName,
      at: moment().format("MMMM Do, h:mm:ss a")
    });
    this.setState({
      review: true
    });
    this.checkStatus();
  }

  handleScroll = function(event) {
    this.setState({
      offset: event.nativeEvent.contentOffset.y
    });
  };

  render() {
    return (
      <ScrollView disabled={this.state.review}>
        {this.props.book.header !== null &&
          <Image
            style={{
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").height * 0.3
            }}
            blurRadius={this.state.review ? 4 : 0}
            source={{ uri: this.props.book.header }}
          />}
        <TouchableOpacity
          style={{ position: "absolute", top: 30, left: 10 }}
          onPress={() => this.props.close(null)}
          underlayColor="transparent"
        >
          <Image
            source={
              this.props.book.header !== null
                ? require("../Images/back_white.png")
                : require("../Images/back_black.png")
            }
          />
        </TouchableOpacity>
        <View
          style={{ padding: 15, width: Dimensions.get("window").width }}
          blurRadius={this.state.review ? 4 : 0}
        >
          <TitleText>{this.props.book.title}</TitleText>
          <AuthorText>{this.props.book.author}</AuthorText>
          <View
            style={{
              width: Dimensions.get("window").width * 0.3,
              marginTop: 10
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  fontFamily: "Avenir-Black",
                  fontSize: 20,
                  color: "#CFCFCF",
                  marginRight: 5
                }}
              >
                {this.props.book.rating}
              </Text>
              <StarRating
                maxStars={5}
                rating={this.props.book.rating}
                iconSet={"FontAwesome"}
                starColor="#CFCFCF"
                starSize={20}
                emptyStar={"ios-star-outline"}
                fullStar={"ios-star"}
                halfStar={"ios-star-half"}
                iconSet={"Ionicons"}
                starStyle={{ borderColor: "transparent", margin: 2 }}
                buttonStyle={{ borderColor: "transparent", color: "#DCDCDC" }}
                halfStarEnabled={true}
                emptyStarColor="#DCDCDC"
              />
            </View>
          </View>
          {this.state.available &&
            <TouchableOpacity
              onPress={() => this.reserveBook()}
              underlayColor="transparent"
              style={{ marginTop: 15, marginBottom: 10 }}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#157DFB",
                  borderRadius: 20,
                  overflow: "hidden",
                  padding: 5,
                  width: 100
                }}
              >
                <AuthorText
                  style={{
                    color: "white",
                    fontFamily: "Avenir-Black",
                    fontSize: 15
                  }}
                >
                  {this.state.status}
                </AuthorText>
              </View>
            </TouchableOpacity>}
          {!this.state.available &&
            <AuthorText style={{ fontSize: 14, marginTop: 10 }}>
              {this.state.status}
            </AuthorText>}
          {this.state.ownedByThisUser &&
            this.state.status === "Your reservation expires on" &&
            <View>
              <AuthorText style={{ fontSize: 14, color: "#CFCFCF" }}>
                {this.props.book.status[0].dueAt}
              </AuthorText>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center"
                }}
              >
                <TouchableOpacity
                  onPress={() => this.checkOutBook()}
                  underlayColor="transparent"
                  style={{ marginTop: 15, marginBottom: 10 }}
                >
                  <View
                    style={{
                      padding: 5,
                      backgroundColor: "#FF3372",
                      overflow: "hidden",
                      borderRadius: 20,
                      width: 100,
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <AuthorText
                      style={{
                        color: "white",
                        fontFamily: "Avenir-Black",
                        fontSize: 15
                      }}
                    >
                      Check Out
                    </AuthorText>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  underlayColor="white"
                  onPress={() => this.returnBook()}
                >
                  <Text
                    style={{
                      fontFamily: "Avenir",
                      fontSize: 15,
                      color: "#CFCFCF",
                      marginTop: 10,
                      marginLeft: 10
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>}
          {this.state.ownedByThisUser &&
            this.state.status === "Your book is due on" &&
            <View>
              <AuthorText style={{ fontSize: 14, color: "#CFCFCF" }}>
                {this.props.book.status[0].dueAt}
              </AuthorText>
              <TouchableOpacity
                onPress={() => this.returnBook()}
                style={{ marginTop: 15, marginBottom: 10 }}
              >
                <View
                  style={{
                    padding: 5,
                    backgroundColor: "#595AD3",
                    overflow: "hidden",
                    borderRadius: 20,
                    width: 100,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <AuthorText
                    style={{
                      color: "white",
                      fontFamily: "Avenir-Black",
                      fontSize: 15
                    }}
                  >
                    Return
                  </AuthorText>
                </View>
              </TouchableOpacity>
            </View>}
          <AuthorText
            style={{
              marginTop: 10,
              color: "#CFCFCF",
              fontSize: 14,
              fontFamily: "Avenir-Black"
            }}
          >
            Description
          </AuthorText>
          <AuthorText
            style={{ marginTop: 5, fontSize: 16, color: "#DCDCDC" }}
            numberOfLines={this.state.seeMore ? 0 : 4}
          >
            {this.props.book.description}
          </AuthorText>
          <TouchableOpacity
            underlayColor="white"
            style={{ marginTop: 5 }}
            onPress={() =>
              this.setState({
                seeMore: !this.state.seeMore,
                seeMoreText: this.state.seeMore ? "See more" : "See less"
              })}
          >
            <Text
              style={{
                fontFamily: "Avenir",
                fontSize: 14,
                color: "#157DFB"
              }}
            >
              {this.state.seeMoreText}
            </Text>
          </TouchableOpacity>
          <AuthorText
            style={{
              marginTop: 15,
              color: "#CFCFCF",
              fontSize: 14,
              fontFamily: "Avenir-Black"
            }}
          >
            On the Map
          </AuthorText>
        </View>
        <LibraryMap book={this.props.book} />
        {this.state.review &&
          <View
            style={{
              position: "absolute",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <View
              style={{
                height: Dimensions.get("window").height,
                width: Dimensions.get("window").width,
                backgroundColor: "black",
                opacity: 0.4
              }}
            />
            <View
              style={{
                position: "absolute"
              }}
            >
              <ReviewPopup
                close={() => this.setState({ review: false })}
                book={this.props.book}
                userInfo={this.props.userInfo}
              />
            </View>
          </View>}
      </ScrollView>
    );
  }
}

/*<Image
  style={{
    width: Dimensions.get("window").width * 0.4,
    height: Dimensions.get("window").width * 0.6,
    borderRadius: 8,
    overflow: "hidden"
  }}
  source={{ uri: this.props.book.cover }}
/>*/

/* {this.state.seeMore &&
  <View>
    <AuthorText
      style={{
        marginTop: 10,
        color: "#CFCFCF",
        fontSize: 14,
        fontFamily: "Avenir-Black"
      }}
    >
      {this.props.book.pages} pages
    </AuthorText>
    <AuthorText
      style={{
        marginTop: 10,
        color: "#CFCFCF",
        fontSize: 14,
        fontFamily: "Avenir-Black"
      }}
    >
      Released in {this.props.book.year}
    </AuthorText>
  </View>} */

//<BookInfo book={this.props.book} />

const TitleText = styled.Text`
  fontFamily: Avenir-Black;
  fontSize: 28;
`;

const AuthorText = styled.Text`
  fontFamily: Avenir-Medium;
  fontSize: 20;
  color: #DCDCDC;
`;

BigBook.propTypes = {
  book: PropTypes.object.isRequired,
  close: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  userInfo: PropTypes.object.isRequired,
  userHistory: PropTypes.array.isRequired
};
