import React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Entypo';
import CardItem from './CardItem';
import { getOneClass } from '../actions';

class BackHeader extends React.Component {
  backUp() {
    this.props.getOneClass('clean', null);
    Actions.pop();
  }

  render() {
    return (
      <TouchableOpacity onPress={() => this.backUp()}>
        <View style={styles.viewStyle}>
          <Icon name="chevron-left" size={30} color="#ed4545" />
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
    color: '#ed4545',
  },
  viewStyle: {
    flexDirection: 'row',
    paddingTop: 32,
    alignItems: 'center',
  },
};

const mapStateToProps = state => {
  return {};
};

export default connect(
  mapStateToProps,
  { getOneClass },
)(BackHeader);
