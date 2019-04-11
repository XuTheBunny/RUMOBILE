import React, { Component } from "react";
import { Actions } from "react-native-router-flux";
import { View, Text, TouchableWithoutFeedback, Image } from "react-native";
import Header from "../Components/Header";
import BottomBar from "../Components/BottomBar";

export default class HomeScreen extends Component {
  render() {
    return (
      <View style={styles.home}>
        <Header text={"HOME"} />
        <BottomBar hs={false} bus={true} fs={true} ls={true} mr={true} />
      </View>
    );
  }
}

const styles = {
  home: {
    flex: 1,
    backgroundColor: "rgb(255, 255, 255)"
  }
};
