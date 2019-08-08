import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Image,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import NotificationBar from '../Components/NotificationBar';
import BackButton from '../Components/BackButton';
import RouteInStop from '../Components/RouteInStop';
import { getPrediction, busOpenedId } from '../actions';

var active_route = [];
var inactive_route = [];
var thisStop = {};

class Stop extends Component {
  state = { refreshing: false, currentCampus: '', width: 0 };

  componentDidMount() {
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
    this.props.busOpenedId({ rid: rid, sid: sid });
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
      Actions.pop();
      this.setState({ refreshing: false });
    }
  }

  getCleanPrediction() {
    cleanPrediction = {};
    active_route = [];
    inactive_route = [];
    if (this.props.allStops.find(obj => obj.sid == this.props.data)) {
      newStop = this.props.allStops.find(obj => obj.sid == this.props.data);
      newStop.routes.forEach(function(element) {
        if (element.isActive) {
          active_route.push(element);
          cleanPrediction[element.rid] = [];
        } else {
          inactive_route.push(element);
        }
      });
    }
    return cleanPrediction;
  }

  renderActive() {
    if (this.props.hasPrediction == 'here') {
      if (this.props.prediction.length > 0 && Object.keys(cleanPrediction).length > 0) {
        cleanPrediction = this.getCleanPrediction();
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
        {!this.props.internet && (
          <NotificationBar text="There is no Internet connection" color="rgb(237,69,69)" />
        )}
        <View
          style={{
            height: 220,
            width: this.state.width,
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'black',
          }}
        >
          <Image
            opacity={0.5}
            style={{ resizeMode: 'cover', width: this.state.width }}
            source={require('../images/Bus/bus_stop.jpg')}
          />
        </View>
        <SafeAreaView>
          <View
            onLayout={event => {
              const layout = event.nativeEvent.layout;
              this.setState({ width: layout.width });
            }}
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <BackButton text={'Bus'} clear={true} />
            <Text style={styles.stopDistance}>{thisStop.distance} miles</Text>
          </View>
          <Text style={styles.stopHeaderTitle}>{thisStop.sname}</Text>
        </SafeAreaView>
        <View style={styles.bodyContainer}>
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
      </View>
    );
  }
}

const styles = {
  screen: {
    flex: 1,
    backgroundColor: 'rgb(255, 255, 255)',
  },
  stopHeaderImage: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 600,
  },
  stopHeaderTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 22,
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 25,
  },
  stopDistance: {
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
    paddingRight: 25,
  },
  bodyContainer: {
    paddingTop: 20,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    backgroundColor: 'white',
    flex: 1,
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
    internet: state.home.internet,
  };
};

export default connect(
  mapStateToProps,
  { getPrediction, busOpenedId },
)(Stop);
