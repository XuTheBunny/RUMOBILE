import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
  StatusBar,
  ImageBackground,
  Image,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import NotificationBar from '../Components/NotificationBar';
import BackButton from '../Components/BackButton';
import RouteInStop from '../Components/RouteInStop';
import { getPrediction } from '../actions';
var cleanPrediction = {};
var active_route = [];
var inactive_route = [];
var thisStop = {};

class Stop extends Component {
  state = { refreshing: false, currentCampus: '', showWarning: false };

  componentWillMount() {
    cleanPrediction = {};
    active_route = [];
    inactive_route = [];
    sid = [this.props.data];
    rid = [];
    thisStop = this.props.allStops.find(obj => obj.sid == this.props.data);
    thisStop.routes.forEach(function(element) {
      if (element.isActive) {
        rid.push(element.rid);
        active_route.push(element);
        cleanPrediction[element.rid] = [];
      } else {
        inactive_route.push(element);
      }
    });
    this.props.getPrediction(rid, sid);
    this.setState({ currentCampus: this.props.campus });
  }

  renderInactive() {
    return inactive_route.map(route => (
      <RouteInStop
        rid={route.rid}
        sid={this.props.data}
        key={route.rid}
        rname={route.rname}
        prediction={[]}
      />
    ));
  }

  onRefresh() {
    this.setState({ refreshing: true });
    if (this.props.campus == this.state.currentCampus) {
      this.props.getPrediction('clean', []);
      cleanPrediction = {};
      active_route = [];
      inactive_route = [];
      sid = [this.props.data];
      rid = [];
      thisStop = this.props.allStops.find(obj => obj.sid == this.props.data);
      thisStop.routes.forEach(function(element) {
        if (element.isActive) {
          rid.push(element.rid);
          active_route.push(element);
          cleanPrediction[element.rid] = [];
        } else {
          inactive_route.push(element);
        }
      });
      this.props.getPrediction(rid, sid);
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

  renderActive() {
    if (this.props.hasPrediction == 'here') {
      if (this.props.prediction.length > 0) {
        this.props.prediction[0].arrivals
          .sort((a, b) => (a.arrival_at > b.arrival_at ? 1 : b.arrival_at > a.arrival_at ? -1 : 0))
          .forEach(function(element) {
            now = new Date();
            arrival = new Date(element.arrival_at);
            diffMs = arrival - now;
            diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
            if (cleanPrediction[element.route_id]) {
              cleanPrediction[element.route_id].push(diffMins);
            }
          });
        return active_route.map(route => (
          <RouteInStop
            rid={route.rid}
            sid={this.props.data}
            key={route.rid}
            rname={route.rname}
            prediction={cleanPrediction[route.rid].slice(0, 3)}
          />
        ));
      }
    }
  }

  render() {
    return (
      <View style={styles.screen}>
        <StatusBar barStyle="light-content" />
        {this.state.showWarning && (
          <NotificationBar text="Yoo, u have changed to the other campus." color="rgb(237,69,69)" />
        )}
        <ImageBackground
          imageStyle={{ opacity: 0.7 }}
          style={styles.stopHeaderContainer}
          source={require('../images/Bus/BusBackground.jpeg')}
        >
          <SafeAreaView>
            <BackButton text={'Bus'} clear={true} />
            <Text style={styles.stopHeaderTitle}>{thisStop.sname}</Text>
            <View style={styles.stopDistanceBox}>
              <Text style={styles.stopDistance}>{thisStop.distance}</Text>
              <Text style={styles.stopDistanceText}> miles away</Text>
            </View>
          </SafeAreaView>
        </ImageBackground>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)}
            />
          }
        >
          <Text style={styles.routeSectionTitle}>Active Routes</Text>
          {this.renderActive()}
          <Text style={styles.routeSectionTitle}>Inactive Routes</Text>
          {this.renderInactive()}
        </ScrollView>
      </View>
    );
  }
}

const styles = {
  screen: {
    flex: 1,
    backgroundColor: 'rgb(255, 255, 255)',
  },
  stopHeaderContainer: {
    flexDirection: 'column',
    backgroundColor: 'black',
    paddingTop: 15,
  },
  stopHeaderTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 27,
    marginHorizontal: 20,
    marginTop: 12,
  },
  stopDistanceBox: {
    padding: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.46)',
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
  },
  stopDistance: {
    color: 'white',
    fontSize: 22,
    fontWeight: '500',
    display: 'flex',
  },
  stopDistanceText: {
    color: 'white',
    fontSize: 16,
    display: 'flex',
  },
  routeSectionTitle: {
    fontWeight: 'bold',
    fontSize: 22,
    marginTop: 18,
    marginLeft: 20,
    marginBottom: 15,
  },
};

const mapStateToProps = state => {
  return {
    allStops: state.bus.all_data,
    prediction: state.bus.prediction,
    hasPrediction: state.bus.has_prediction,
    campus: state.bus.campus,
  };
};

export default connect(
  mapStateToProps,
  { getPrediction },
)(Stop);
