import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { View, Text, TouchableWithoutFeedback, Image } from 'react-native';
import ClearHeader from '../Components/ClearHeader';
import BackHeader from '../Components/BackHeader';
import BottomBar from '../Components/BottomBar';

export default class Route extends Component {
  componentWillMount() {
    console.log(this.props.data);
  }

  render() {
    return (
      <View style={styles.home}>
        <BackHeader text={'Bus'} />
        <Text>ROUTE SCREEN</Text>
        <Text>YOU PRESSED ROUTE: {this.props.data.rname}</Text>
        <Text>ROUTE ID IS: {this.props.data.rid}</Text>
        <Text>THIS ROUTE IS: {this.props.data.isActive ? 'Active' : 'Inactive'}</Text>
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
