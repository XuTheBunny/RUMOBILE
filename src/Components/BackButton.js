import React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Entypo';
import CardItem from './CardItem';
import { getOneClass, getPrediction } from '../actions';

class BackButton extends React.Component {
  backUp() {
    if (this.props.text == 'Subjects') {
      this.props.getOneClass('clean', null);
    }
    if (this.props.text == 'Bus') {
      this.props.getPrediction('clean', []);
    }
    Actions.pop();
  }

  render() {
    color = this.props.clear ? 'white' : '#ed4545';
    return (
      <TouchableOpacity onPress={() => this.backUp()}>
        <View style={styles.viewStyle}>
          <Icon name="chevron-left" size={30} color={color} />
          <Text style={[styles.textStyle, { color: color }]}>{this.props.text}</Text>
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
  { getOneClass, getPrediction },
)(BackButton);
