import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { getBusStops } from '../actions';
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

  createbox() {
    var x = 0;
    for (var i = 0; i < this.props.stop.routes.length; i++) {
      x++;
      if (this.props.stop.routes[i].isActive) {
        if (this.props.stop.routes[i].rname == 'Route A') {
          var obj = { h: 23, src: require('../images/BI/biA.png'), key: x };
          boxes.push(obj);
        } else if (this.props.stop.routes[i].rname == 'Route B') {
          var obj = { h: 23, src: require('../images/BI/biB.png'), key: x };
          boxes.push(obj);
        } else if (this.props.stop.routes[i].rname == 'Route C') {
          var obj = { h: 23, src: require('../images/BI/biC.png'), key: x };
          boxes.push(obj);
        } else if (this.props.stop.routes[i].rname == 'Route EE') {
          var obj = { h: 29, src: require('../images/BI/biEE.png'), key: x };
          boxes.push(obj);
        } else if (this.props.stop.routes[i].rname == 'Route F') {
          var obj = { h: 23, src: require('../images/BI/biF.png'), key: x };
          boxes.push(obj);
        } else if (this.props.stop.routes[i].rname == 'Route H') {
          var obj = { h: 23, src: require('../images/BI/biH.png'), key: x };
          boxes.push(obj);
        } else if (this.props.stop.routes[i].rname == 'Route LX') {
          var obj = { h: 29, src: require('../images/BI/biLX.png'), key: x };
          boxes.push(obj);
        } else if (this.props.stop.routes[i].rname == 'Route All Campuses') {
          var obj = { h: 37, src: require('../images/BI/biALL.png'), key: x };
          boxes.push(obj);
        } else if (this.props.stop.routes[i].rname == 'Route New BrunsQuick 1 Shuttle') {
          var obj = { h: 33, src: require('../images/BI/biS1.png'), key: x };
          boxes.push(obj);
        } else if (this.props.stop.routes[i].rname == 'Route New BrunsQuick 2 Shuttle') {
          var obj = { h: 33, src: require('../images/BI/biS2.png'), key: x };
          boxes.push(obj);
        } else if (this.props.stop.routes[i].rname == 'Route RBHS') {
          var obj = { h: 48, src: require('../images/BI/biRBHS.png'), key: x };
          boxes.push(obj);
        } else if (this.props.stop.routes[i].rname == 'Route REXB') {
          var obj = { h: 48, src: require('../images/BI/biREXB.png'), key: x };
          boxes.push(obj);
        } else if (this.props.stop.routes[i].rname == 'Route REXL') {
          var obj = { h: 48, src: require('../images/BI/biREXL.png'), key: x };
          boxes.push(obj);
        } else if (this.props.stop.routes[i].rname == 'Route Weekend 1') {
          var obj = { h: 35, src: require('../images/BI/biW1.png'), key: x };
          boxes.push(obj);
        } else if (this.props.stop.routes[i].rname == 'Route Weekend 2') {
          var obj = { h: 35, src: require('../images/BI/biW2.png'), key: x };
          boxes.push(obj);
        } else {
          var obj = { h: 23, src: require('../images/BI/biN.png'), key: x };
          boxes.push(obj);
        }
      }
    }
    k = boxes.length;
  }
  boxReset() {
    k--;
    if (k == 0) {
      boxes = new Array();
    }
  }
  renderBus() {
    if (routes == true) {
      return boxes.map(box => (
        <View key={box.key}>
          <Image
            style={{ width: box.h, height: 23, marginRight: 6, marginTop: 2 }}
            source={box.src}
          />
          {this.boxReset()}
        </View>
      ));
    } else {
      return <Text style={styles.boxTextStyle}>No active routes</Text>;
    }
  }

  render() {
    this.resetRoutes();
    this.checkRoutes();
    this.createbox();
    return (
      <View style={styles.viewStyle}>
        <TouchableOpacity onPress={() => this.StopPress(this.props.stop)}>
          <View style={styles.viewStyle2}>
            <Text style={styles.textStyle}>{this.props.stop.sname}</Text>
            <Text style={styles.textStyle2}>{this.props.stop.distance} mi</Text>
          </View>
          <View style={styles.viewStyle3}>{this.renderBus()}</View>
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
