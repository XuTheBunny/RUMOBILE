import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import NotificationBar from '../Components/NotificationBar';
import BackButton from '../Components/BackButton';
import StopInRoute from '../Components/StopInRoute';
import { getPrediction } from '../actions';
import { routeColor } from '../../bus_color.json';
var nearestId = '';
var thisRoute = {};

class Route extends Component {
  state = { refreshing: false, currentCampus: '', showWarning: false };

  componentDidMount() {
    allRoutes = this.props.activeRoutes.concat(this.props.inactiveRoutes);
    rid = [this.props.data];
    sid = [];
    thisRoute = allRoutes.find(obj => obj.rid == this.props.data);
    thisRoute.stops.forEach(function(element) {
      sid.push(element.sid);
    });
    this.props.getPrediction(rid, sid);
    duplicate = JSON.parse(JSON.stringify(thisRoute.stops));
    nearestId = duplicate.sort((a, b) =>
      a.distance > b.distance ? 1 : b.distance > a.distance ? -1 : 0,
    )[0].sid;
    this.setState({ currentCampus: this.props.campus });
  }

  onRefresh() {
    this.setState({ refreshing: true });
    if (this.props.campus == this.state.currentCampus) {
      this.props.getPrediction('clean', []);
      allRoutes = this.props.activeRoutes.concat(this.props.inactiveRoutes);
      rid = [this.props.data];
      sid = [];
      thisRoute = allRoutes.find(obj => obj.rid == this.props.data);
      thisRoute.stops.forEach(function(element) {
        sid.push(element.sid);
      });
      this.props.getPrediction(rid, sid);
      duplicate = JSON.parse(JSON.stringify(thisRoute.stops));
      nearestId = duplicate.sort((a, b) =>
        a.distance > b.distance ? 1 : b.distance > a.distance ? -1 : 0,
      )[0].sid;
      if (this.props.hasPrediction == 'here') {
        this.setState({ refreshing: false });
      }
    } else {
      this.setState({ refreshing: false, showWarning: true });
      setTimeout(
        function() {
          this.setState({ showWarning: false });
        }.bind(this),
        2000,
      );
    }
  }

  foldNofitication() {
    this.setState({ showWarning: false });
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
      return thisRoute.stops.map(stop => (
        <StopInRoute
          rid={this.props.data}
          sid={stop.sid}
          sname={stop.sname}
          distance={stop.distance}
          prediction={this.singlePrediction(stop.sid)}
          key={stop.sid}
          nearest={nearestId == stop.sid}
        />
      ));
    }
  }

  render() {
    color = routeColor.find(obj => obj.rname == thisRoute.rname)
      ? routeColor.find(obj => obj.rname == thisRoute.rname).rcolor
      : 'rgb(142, 142, 147)';
    return (
      <SafeAreaView style={[styles.screen, { backgroundColor: color }]}>
        {this.state.showWarning && (
          <NotificationBar text="Yoo, u have changed to the other campus." color="rgb(237,69,69)" />
        )}
        {!this.props.internet && (
          <NotificationBar text="There is no Internet connection." color="rgb(237,69,69)" />
        )}
        <View style={{ backgroundColor: color }}>
          <BackButton text={'Bus'} clear={true} />
          <View style={styles.routeHeaderContainer}>
            <Text style={styles.routeHeaderTitle}>{thisRoute.rname}</Text>
          </View>
        </View>
        <ScrollView
          style={{ backgroundColor: 'rgb(255, 255, 255)' }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)}
            />
          }
        >
          {this.renderPrediction()}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = {
  screen: {
    flex: 1,
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
    flex: 2,
    fontSize: 22,
    fontWeight: '600',
    color: 'rgb(255, 255, 255)',
    paddingHorizontal: 14,
    paddingTop: 8,
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
    activeRoutes: state.bus.active_data,
    inactiveRoutes: state.bus.inactive_data,
    prediction: state.bus.prediction,
    hasPrediction: state.bus.has_prediction,
    campus: state.bus.campus,
    internet: state.home.internet,
  };
};

export default connect(
  mapStateToProps,
  { getPrediction },
)(Route);
