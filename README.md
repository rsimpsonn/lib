#  Walt Grace Library
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)

* Standard compliant React Native Library App Utilizing [Ignite](https://github.com/infinitered/ignite) Template

## :arrow_up: How to Setup

**Step 1:** git clone this repo: `git clone https://github.com/rsimpsonn/lib.git`

**Step 2:** cd to the cloned repo: `cd wg`

**Step 3:** Install the Application with `yarn` or `npm i`

**Step 4:** cd to ios directory: `cd ios`

**Step 5:** Install pods (Requires CocoaPods): `pod install`


## :arrow_forward: How to Run App

1. cd to the repo `cd wg`
2. Run Build for iOS
    * run `react-native run-ios`

## :arrow_forward: Libraries Used

* [react](https://github.com/facebook/react) - A declarative, efficient, and flexible JavaScript library for building user interfaces.
* [react-native](https://github.com/facebook/react-native) - A framework for building native apps with React.
* [moment](https://github.com/moment/moment) - Parse, validate, manipulate, and display dates in javascript.
* [react-native-firebase](https://github.com/invertase/react-native-firebase) - A well tested feature rich Firebase implementation for React Native
* [prop-types](https://github.com/facebook/prop-types) - Runtime type checking for React props and similar objects
* [styled-components](https://github.com/styled-components/styled-components) - Visual primitives for the component age. Use the best bits of ES6 and CSS to style your apps without stress
* [react-native-fbsdk](https://github.com/facebook/react-native-fbsdk) - A React Native wrapper around the Facebook SDKs for Android and iOS. Provides access to Facebook login, sharing, graph requests, app events etc.
* [react-native-tinder-swipe-cards](https://github.com/meteor-factory/react-native-tinder-swipe-cards) - Tinder-like swipe cards for your React Native app
* [react-native-haptic](https://github.com/charlesvinette/react-native-haptic) - iOS 10 + haptic feedback for React Native applications
* [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons) - Customizable Icons for React Native with support for NavBar/TabBar/ToolbarAndroid, image source and full styling.
* [react-native-star-rating](https://github.com/djchie/react-native-star-rating) - A React Native component for generating and displaying interactive star ratings

## :arrow_forward: Main Features

* LaunchScreen - Manages app performance and keeps track of user's login status using a Firebase listener
* MainView - Manages home screen of app and lists ForYouList and Feature slides - Contains Profile and Search screens
* Search - Lets user search by book title, lists all books with keywords
* Profile - Shows user all books they have reserved, checked out, and returned
* BigBook - Enlarges book and gives user ability to reserve, check out, or return books
* RecommendationsTest - Shows users excerpts of books in a swipe view and records user's reading preferences
* ForYouList - Calculates recommendation percentages based on user's tastes and past users' reviews - Shows any books with above a 60% score to recommend to user
* Notifications - A cloud function on Firebase is fired once a day at around 3:30PM PST checking if any user's books are overdue (note: code for the function is not included on repo)

## :no_entry_sign: Standard Compliant

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)
This project adheres to Standard.  Our CI enforces this, so we suggest you enable linting to keep your project compliant during development.

**To Lint on Commit**

This is implemented using [husky](https://github.com/typicode/husky). There is no additional setup needed.

**Bypass Lint**

If you have to bypass lint for a special commit that you will come back and clean (pushing something to a branch etc.) then you can bypass git hooks with adding `--no-verify` to your commit command.

**Understanding Linting Errors**

The linting rules are from JS Standard and React-Standard.  [Regular JS errors can be found with descriptions here](http://eslint.org/docs/rules/), while [React errors and descriptions can be found here](https://github.com/yannickcr/eslint-plugin-react).
