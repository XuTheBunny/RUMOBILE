import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { getBusStops } from '../actions';
import { routeColor } from '../../route_color.json';

var color = 'rgb(142, 142, 147)';
var tag = '?';
var boxes = new Array();
var k = 0;
var routes = false;

class NearbyItem extends Component {
  StopPress(d) {
    Actions.stop({ data: d });
  }

  resetRoutes() {
    routes = false;
  }

  checkRoutes() {
    if (this.props.stop.routes.find(obj => obj.isActive == true)) {
      routes = true;
    }
  }

  getColor(rname) {
    return routeColor.find(obj => obj.rname == rname).rcolor;
  }

  getTag(rname) {
    return routeColor.find(obj => obj.rname == rname).rtag;
  }

  renderBus(routes) {
    activeRoutes = routes.filter(route => route.isActive);
    if (activeRoutes.length > 0) {
      return activeRoutes.map(route => (
        <View
          key={route.rid}
          style={[styles.busIconBox, { backgroundColor: this.getColor(route.rname) }]}
        >
          <Text style={styles.busIconText}>{this.getTag(route.rname)}</Text>
        </View>
      ));
    } else {
      return <Text style={styles.boxTextStyle}>No active routes</Text>;
    }
  }

  render() {
    return (
      <View style={styles.viewStyle}>
        <TouchableOpacity onPress={() => this.StopPress(this.props.stop)}>
          <View style={styles.viewStyle2}>
            <Text style={styles.textStyle}>{this.props.stop.sname}</Text>
            <Text style={styles.textStyle2}>{this.props.stop.distance} mi</Text>
          </View>
          <View style={styles.viewStyle3}>{this.renderBus(this.props.stop.routes)}</View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = {
  textStyle: {
    fontFamily: 'system font',
    fontSize: 17,
    fontWeight: '100',
    maxWidth: 270,
  },
  textStyle2: {
    fontFamily: 'system font',
    fontSize: 12,
    color: 'rgb(100, 100, 100)',
  },
  viewStyle: {
    marginLeft: 16,
    paddingRight: 14,
    borderTopColor: 'rgb(235,235,235)',
    borderTopWidth: 0.5,
    paddingVertical: 12,
  },
  viewStyle2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  viewStyle3: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 5,
  },
  busIconText: {
    fontSize: 15,
    color: 'rgb(255, 255, 255)',
  },
  busIconBox: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 6,
  },
  boxTextStyle: {
    fontSize: 16,
    color: 'rgb(155, 155, 155)',
    fontStyle: 'italic',
    marginTop: 5,
  },
};

const mapStateToProps = state => {
  return {
    nearby: state.bus.nb_data,
    check: state.bus.data_here,
  };
};

export default connect(
  mapStateToProps,
  { getBusStops },
)(NearbyItem);
