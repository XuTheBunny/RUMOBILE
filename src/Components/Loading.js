import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

const Loading = props => (
  <View style={styles.view}>
    {props.loadingText && <Text style={styles.text}>{props.loadingText}</Text>}
    <ActivityIndicator color="#b8b8b8" size="large" />
  </View>
);

const styles = {
  view: {
    height: 120,
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    fontSize: 20,
    fontWeight: "500",
    fontFamily: "system font",
    color: "#b8b8b8",
    paddingBottom: 20
  }
};

export default Loading;
