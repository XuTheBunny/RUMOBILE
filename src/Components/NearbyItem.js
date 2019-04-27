import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { getBusStops } from '../actions';
var boxes = new Array();
var k = 0;
var routes = true;

class NearbyItem extends Component {
  StopPress(d) {
    Actions.stop({ data: d });
  }

  resetRoutes() {
    routes = true;
  }

  checkRoutes() {
    if (this.props.stop.route.length == 0) {
      //console.log('no routes');
      routes = false;
    }
  }

  createbox() {
    var x = 0;
    for (var i = 0; i < this.props.stop.route.length; i++) {
      x++;
      if (this.props.stop.route[i] == 'Route A') {
        var obj = { h: 23, src: require('../images/BI/biA.png'), key: x };
        boxes.push(obj);
      } else if (this.props.stop.route[i] == 'Route B') {
        var obj = { h: 23, src: require('../images/BI/biB.png'), key: x };
        boxes.push(obj);
      } else if (this.props.stop.route[i] == 'Route C') {
        var obj = { h: 23, src: require('../images/BI/biC.png'), key: x };
        boxes.push(obj);
      } else if (this.props.stop.route[i] == 'Route EE') {
        var obj = { h: 29, src: require('../images/BI/biEE.png'), key: x };
        boxes.push(obj);
      } else if (this.props.stop.route[i] == 'Route F') {
        var obj = { h: 23, src: require('../images/BI/biF.png'), key: x };
        boxes.push(obj);
      } else if (this.props.stop.route[i] == 'Route H') {
        var obj = { h: 23, src: require('../images/BI/biH.png'), key: x };
        boxes.push(obj);
      } else if (this.props.stop.route[i] == 'Route LX') {
        var obj = { h: 29, src: require('../images/BI/biLX.png'), key: x };
        boxes.push(obj);
      } else if (this.props.stop.route[i] == 'Route All Campuses') {
        var obj = { h: 37, src: require('../images/BI/biALL.png'), key: x };
        boxes.push(obj);
      } else if (this.props.stop.route[i] == 'Route New BrunsQuick 1 Shuttle') {
        var obj = { h: 33, src: require('../images/BI/biS1.png'), key: x };
        boxes.push(obj);
      } else if (this.props.stop.route[i] == 'Route New BrunsQuick 2 Shuttle') {
        var obj = { h: 33, src: require('../images/BI/biS2.png'), key: x };
        boxes.push(obj);
      } else if (this.props.stop.route[i] == 'Route RBHS') {
        var obj = { h: 48, src: require('../images/BI/biRBHS.png'), key: x };
        boxes.push(obj);
      } else if (this.props.stop.route[i] == 'Route REXB') {
        var obj = { h: 48, src: require('../images/BI/biREXB.png'), key: x };
        boxes.push(obj);
      } else if (this.props.stop.route[i] == 'Route REXL') {
        var obj = { h: 48, src: require('../images/BI/biREXL.png'), key: x };
        boxes.push(obj);
      } else if (this.props.stop.route[i] == 'Route Weekend 1') {
        var obj = { h: 35, src: require('../images/BI/biW1.png'), key: x };
        boxes.push(obj);
      } else if (this.props.stop.route[i] == 'Route Weekend 2') {
        var obj = { h: 35, src: require('../images/BI/biW2.png'), key: x };
        boxes.push(obj);
      } else {
        var obj = { h: 23, src: require('../images/BI/biN.png'), key: x };
        boxes.push(obj);
      }
    }
    // console.log(this.props.stop);
    k = boxes.length;
  }
  boxReset() {
    k--;
    if (k == 0) {
      boxes = new Array();
    }
    //console.log(k);
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
      return <Text style={styles.boxTextStyle}>No Active Routes</Text>;
    }
  }

  render() {
    this.resetRoutes();
    this.checkRoutes();
    this.createbox();
    // console.log(this.props.stop);
    return (
      <View style={styles.viewStyle}>
        <TouchableOpacity onPress={() => this.StopPress(this.props.stop)}>
          <View
            style={{
              borderBottomColor: 'rgb(200, 199, 204)',
              borderBottomWidth: 1,
              marginBottom: 10.5,
            }}
          />
          <View style={styles.viewStyle2}>
            <Text style={styles.textStyle}>{this.props.stop.name}</Text>
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
  },
  textStyle2: {
    fontFamily: 'system font',
    fontSize: 12,
    color: 'rgb(155, 155, 155)',
  },
  viewStyle: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8.5,
  },
  viewStyle2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewStyle3: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  boxTextStyle: {
    //fontFamily: 'system font',
    fontSize: 16,
    color: 'rgb(155, 155, 155)',
    fontStyle: 'italic',
    marginTop: 10,
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
