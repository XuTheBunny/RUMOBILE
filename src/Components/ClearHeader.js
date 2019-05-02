import React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Entypo';
import CardItem from './CardItem';
import { getPrediction } from '../actions';

class ClearHeader extends React.Component {
  backUp() {
    this.props.getPrediction('clean', []);
    Actions.pop();
  }

  render() {
    return (
      <TouchableOpacity onPress={() => this.backUp()}>
        <View style={styles.viewStyle}>
          <Icon name="chevron-left" size={30} color="white" />
          <Text style={styles.textStyle}>{this.props.text}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}
const styles = {
  textStyle: {
    fontSize: 17,
    fontWeight: '500',
    paddingRight: 200,
    fontFamily: 'system font',
    color: 'white',
  },
  viewStyle: {
    flexDirection: 'row',
    paddingTop: 35,
    alignItems: 'center',
  },
};

const mapStateToProps = state => {
  return {};
};

export default connect(
  mapStateToProps,
  { getPrediction },
)(ClearHeader);
