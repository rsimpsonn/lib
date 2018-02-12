#  Walt Grace Library
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)

* Standard compliant React Native Library App Utilizing [Ignite](https://github.com/infinitered/ignite) Template

## :arrow_up: How to Setup

**Step 1:** git clone this repo:

**Step 2:** cd to the cloned repo:

**Step 3:** Install the Application with `yarn` or `npm i`


## :arrow_forward: How to Run App

1. cd to the repo
2. Run Build for either OS
  * for iOS
    * run `react-native run-ios`

## :arrow_forward: Libraries Used

* [react](https://github.com/facebook/react) - A declarative, efficient, and flexible JavaScript library for building user interfaces.
* [react-native](https://github.com/facebook/react-native) - A framework for building native apps with React.
* [moment](https://github.com/moment/moment) - Parse, validate, manipulate, and display dates in javascript.
* [react-native-firebase](https://github.com/invertase/react-native-firebase) - A well tested feature rich Firebase implementation for React Native
* [prop-types](https://github.com/facebook/prop-types) - Runtime type checking for React props and similar objects
* [styled-components](https://github.com/styled-components/styled-components) - Visual primitives for the component age. Use the best bits of ES6 and CSS to style your apps without stress
* [react-native-tinder-swipe-cards](https://github.com/meteor-factory/react-native-tinder-swipe-cards) - Tinder-like swipe cards for your React Native app
* [react-native-haptic](https://github.com/charlesvinette/react-native-haptic) - iOS 10 + haptic feedback for React Native applications
* [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons) - Customizable Icons for React Native with support for NavBar/TabBar/ToolbarAndroid, image source and full styling.

## :no_entry_sign: Standard Compliant

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)
This project adheres to Standard.  Our CI enforces this, so we suggest you enable linting to keep your project compliant during development.

**To Lint on Commit**

This is implemented using [husky](https://github.com/typicode/husky). There is no additional setup needed.

**Bypass Lint**

If you have to bypass lint for a special commit that you will come back and clean (pushing something to a branch etc.) then you can bypass git hooks with adding `--no-verify` to your commit command.

**Understanding Linting Errors**

The linting rules are from JS Standard and React-Standard.  [Regular JS errors can be found with descriptions here](http://eslint.org/docs/rules/), while [React errors and descriptions can be found here](https://github.com/yannickcr/eslint-plugin-react).

## :closed_lock_with_key: Secrets

This project uses [react-native-config](https://github.com/luggit/react-native-config) to expose config variables to your javascript code in React Native. You can store API keys
and other sensitive information in a `.env` file:

```
API_URL=https://myapi.com
GOOGLE_MAPS_API_KEY=abcdefgh
```

and access them from React Native like so:

```
import Secrets from 'react-native-config'

Secrets.API_URL  // 'https://myapi.com'
Secrets.GOOGLE_MAPS_API_KEY  // 'abcdefgh'
```

The `.env` file is ignored by git keeping those secrets out of your repo.

### Get started:
1. Copy .env.example to .env
2. Add your config variables
3. Follow instructions at [https://github.com/luggit/react-native-config#setup](https://github.com/luggit/react-native-config#setup)
4. Done!
