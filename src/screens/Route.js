import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity, ScrollView, LayoutAnimation, StatusBar } from 'react-native';
import ClearHeader from '../Components/ClearHeader';
import BottomBar from '../Components/BottomBar';
import StopInRoute from '../Components/StopInRoute';
import Loading from '../Components/Loading';
import { getPrediction } from '../actions';
var color = 'rgb(142, 142, 147)';
var nearestId = '';

class Route extends Component {
  componentWillMount() {
    rid = [this.props.data.rid];
    sid = [];
    this.props.data.stops.forEach(function(element) {
      sid.push(element.sid);
    });
    this.props.getPrediction(rid, sid);
    duplicate = JSON.parse(JSON.stringify(this.props.data.stops));
    nearestId = duplicate.sort((a, b) =>
      a.distance > b.distance ? 1 : b.distance > a.distance ? -1 : 0,
    )[0].sid;
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  resetColor() {
    color = 'rgb(142, 142, 147)';
  }

  isColor() {
    rname = this.props.data.rname;
    if (rname == 'Route A') {
      color = 'rgb(124, 31, 206)';
    } else if (rname == 'Route B') {
      color = 'rgb(32, 116, 214)';
    } else if (rname == 'Route C') {
      color = 'rgb(244, 74, 74)';
    } else if (rname == 'Route EE') {
      color = 'rgb(62, 210, 177)';
    } else if (rname == 'Route F') {
      color = 'rgb(243, 37, 168)';
    } else if (rname == 'Route H') {
      color = 'rgb(119, 204, 27)';
    } else if (rname == 'Route LX') {
      color = 'rgb(255, 204, 0)';
    } else if (rname == 'Route All Campuses') {
      color = 'rgb(0, 156, 80)';
    } else if (rname == 'Route New BrunsQuick 1 Shuttle') {
      color = 'rgb(236, 76, 127)';
    } else if (rname == 'Route New BrunsQuick 2 Shuttle') {
      color = 'rgb(90, 200, 250)';
    } else if (rname == 'Route RBHS') {
      color = 'rgb(88, 86, 214)';
    } else if (rname == 'Route REXB') {
      color = 'rgb(255, 149, 0)';
    } else if (rname == 'Route REXL') {
      color = 'rgb(187, 120, 246)';
    } else if (['Route Weekend 1', 'Weekend 1', 'Summer 1'].includes(rname)) {
      color = 'rgb(244, 74, 74)';
    } else if (['Route Weekend 2', 'Weekend 2', 'Summer 2'].includes(rname)) {
      color = 'rgb(32, 116, 214)';
    }
  }

  singlePrediction(sid) {
    if (this.props.prediction.find(obj => obj.stop_id == sid)) {
      prediction_raw = this.props.prediction.find(obj => obj.stop_id == sid).arrivals;
      now = new Date();
      arrivalList = [];
      prediction_raw
        .sort((a, b) => (a.arrival_at > b.arrival_at ? 1 : b.arrival_at > a.arrival_at ? -1 : 0))
        .forEach(function(element) {
          arrival = new Date(element.arrival_at);
          diffMs = arrival - now;
          diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
          arrivalList.push(diffMins);
        });
      return arrivalList;
    } else {
      return [];
    }
  }

  renderPrediction() {
    if (this.props.hasPrediction == 'here') {
      return this.props.data.stops.map(stop => (
        <StopInRoute
          sname={stop.sname}
          distance={stop.distance}
          prediction={this.singlePrediction(stop.sid)}
          key={stop.sid}
          nearest={nearestId == stop.sid}
        />
      ));
    } else {
      return <Loading />;
    }
  }

  render() {
    this.resetColor();
    this.isColor();
    return (
      <View style={styles.screen}>
        <StatusBar barStyle="light-content" />
        <View style={{ backgroundColor: color }}>
          <ClearHeader text={'Bus'} />
          <View style={styles.routeHeaderContainer}>
            <Text style={styles.routeHeaderTitle}>{this.props.data.rname}</Text>
            <TouchableOpacity>
              <View style={styles.routeMapButton}>
                <Text style={styles.routeMapText}>Map</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView style={{ marginBottom: 75 }}>{this.renderPrediction()}</ScrollView>
        <BottomBar hs={true} bus={false} fs={true} ls={true} mr={true} />
      </View>
    );
  }
}

const styles = {
  screen: {
    flex: 1,
    backgroundColor: 'rgb(255, 255, 255)',
  },
  routeHeaderContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingBottom: 18,
  },
  routeHeaderTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: 'rgb(255, 255, 255)',
    paddingLeft: 14,
    paddingTop: 8,
    maxWidth: 240,
  },
  routeMapButton: {
    borderWidth: 1,
    borderRadius: 3,
    borderColor: 'rgb(255, 255, 255)',
    paddingHorizontal: 22,
  },
  routeMapText: {
    fontSize: 17,
    color: 'rgb(255, 255, 255)',
  },
};

const mapStateToProps = state => {
  return {
    prediction: state.bus.prediction,
    hasPrediction: state.bus.has_prediction,
  };
};

export default connect(
  mapStateToProps,
  { getPrediction },
)(Route);
