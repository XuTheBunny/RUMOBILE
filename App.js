import React, { Component } from "react";
import { Text, View } from "react-native";
import { Provider } from "react-redux";
import firebase from "firebase";
import { createStore, applyMiddleware } from "redux";
import ReduxThunk from "redux-thunk";
import Router from "./Router";
import reducers from "./src/reducers";

export default class App extends Component {
  render() {
    return (
      <Provider store={createStore(reducers, {}, applyMiddleware(ReduxThunk))}>
        <Router />
      </Provider>
    );
  }
}
