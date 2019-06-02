import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { routeColor } from '../../bus_color.json';

var color = 'rgb(142, 142, 147)';

class ActiveItem extends Component {
  RoutePress(d) {
    Actions.route({ data: d });
  }

  resetColor() {
    color = 'rgb(142, 142, 147)';
  }

  isColor() {
    color = routeColor.find(obj => obj.rname == this.props.route.rname).rcolor;
  }

  render() {
    this.resetColor();
    this.isColor();
    return (
      <View style={styles.containerStyle}>
        <TouchableOpacity onPress={() => this.RoutePress(this.props.route.rid)}>
          <View style={styles.itemStyle}>
            <View style={{ flexDirection: 'row' }}>
              <View style={[styles.dotStyle, { backgroundColor: color }]} />
              <Text style={styles.textStyle}>{this.props.route.rname}</Text>
            </View>
            <EvilIcons name="chevron-right" size={30} color="rgb(138,138,143)" />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    marginLeft: 18,
    paddingRight: 8,
    paddingVertical: 12,
    borderTopColor: 'rgb(235,235,235)',
    borderTopWidth: 0.5,
  },
  itemStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dotStyle: {
    height: 16,
    width: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'white',
    shadowOffset: { width: 0, height: 2 },
    shadowColor: 'rgb(143, 143, 143)',
    shadowOpacity: 0.5,
    marginRight: 15,
    marginTop: 2,
    marginLeft: 3,
  },
  textStyle: {
    fontFamily: 'system font',
    fontSize: 17,
    fontWeight: '100',
    maxWidth: 300,
  },
};

const mapStateToProps = state => {
  return {
    ad: state.bus.active_data,
    check: state.bus.data_here,
  };
};

export default connect(
  mapStateToProps,
  {},
)(ActiveItem);
