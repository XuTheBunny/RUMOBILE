import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { View, Text, TouchableWithoutFeedback, Image } from 'react-native';
import BackHeader from '../Components/BackHeader';
import BottomBar from '../Components/BottomBar';

export default class Stop extends Component {
  componentWillMount() {
    console.log(this.props.data);
  }

  render() {
    return (
      <View style={styles.home}>
        <BackHeader text={'Bus'} />
        <Text>STOP SCREEN</Text>
        <Text>YOU PRESSED: {this.props.data.sname}</Text>
        <Text>STOP ID IS: {this.props.data.sid}</Text>
        <Text>THIS STOP IS:{this.props.data.distance} miles away </Text>
        <BottomBar hs={true} bus={false} fs={true} ls={true} mr={true} />
      </View>
    );
  }
}

const styles = {
  home: {
    flex: 1,
    backgroundColor: 'rgb(255, 255, 255)',
  },
};
