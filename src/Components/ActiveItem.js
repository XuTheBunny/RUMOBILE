import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
var color = 'rgb(142, 142, 147)';

class ActiveItem extends Component {
  RoutePress(d) {
    Actions.route({ data: d });
  }

  resetColor() {
    color = 'rgb(142, 142, 147)';
  }

  isColor() {
    if (this.props.route.rname == 'Route A') {
      color = 'rgb(124, 31, 206)';
    } else if (this.props.route.rname == 'Route B') {
      color = 'rgb(32, 116, 214)';
    } else if (this.props.route.rname == 'Route C') {
      color = 'rgb(244, 74, 74)';
    } else if (this.props.route.rname == 'Route EE') {
      color = 'rgb(62, 210, 177)';
    } else if (this.props.route.rname == 'Route F') {
      color = 'rgb(243, 37, 168)';
    } else if (this.props.route.rname == 'Route H') {
      color = 'rgb(119, 204, 27)';
    } else if (this.props.route.rname == 'Route LX') {
      color = 'rgb(255, 204, 0)';
    } else if (this.props.route.rname == 'Route All Campuses') {
      color = 'rgb(0, 156, 80)';
    } else if (this.props.route.rname == 'Route New BrunsQuick 1 Shuttle') {
      color = 'rgb(236, 76, 127)';
    } else if (this.props.route.rname == 'Route New BrunsQuick 2 Shuttle') {
      color = 'rgb(90, 200, 250)';
    } else if (this.props.route.rname == 'Route RBHS') {
      color = 'rgb(88, 86, 214)';
    } else if (this.props.route.rname == 'Route REXB') {
      color = 'rgb(255, 149, 0)';
    } else if (this.props.route.rname == 'Route REXL') {
      color = 'rgb(187, 120, 246)';
    } else if (['Route Weekend 1', 'Weekend 1', 'Summer 1'].includes(this.props.route.rname)) {
      color = 'rgb(244, 74, 74)';
    } else if (['Route Weekend 2', 'Weekend 2', 'Summer 2'].includes(this.props.route.rname)) {
      color = 'rgb(32, 116, 214)';
    }
  }

  render() {
    this.resetColor();
    this.isColor();
    return (
      <View style={styles.containerStyle}>
        <TouchableOpacity onPress={() => this.RoutePress(this.props.route)}>
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
