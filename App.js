import React, { Component } from "react";
import {
  API_KEY,
  AUTH_DOMAIN,
  DATABASE_URL,
  PROJECT_ID,
  MESSAGE_SENDER_ID
} from "./env.json";
import { Text, View } from "react-native";
import { Provider } from "react-redux";
import firebase from "firebase";
import { createStore, applyMiddleware } from "redux";
import ReduxThunk from "redux-thunk";
import Router from "./Router";
import reducers from "./src/reducers";

const config = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: DATABASE_URL,
  projectId: PROJECT_ID,
  storageBucket: "",
  messagingSenderId: MESSAGE_SENDER_ID
};
firebase.initializeApp(config);

export default class App extends Component {
  render() {
    return (
      <Provider store={createStore(reducers, {}, applyMiddleware(ReduxThunk))}>
        <Router />
      </Provider>
    );
  }
}
