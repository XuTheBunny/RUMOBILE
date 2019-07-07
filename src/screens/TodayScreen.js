import React, { Component } from 'react';
import { FIREBASE_USER, FIREBASE_PASSWORD } from '../../env.json';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import Header from '../Components/Header';
import HomeBanner from '../Components/HomeBanner';
import RouteInStop from '../Components/RouteInStop';
import { routeColor } from '../../bus_color.json';

import {
  loginUser,
  pullBanner,
  timeAction,
  pullDate,
  getBusStops,
  getAllClass,
  deleteFavoriteBus,
  getPrediction,
} from '../actions';

class TodayScreen extends Component {
  state = {
    busRefreshing: false,
    classEmpty: true,
  };

  componentWillMount() {
    //Handles the Date Text at the top of the Header
    this.props.pullDate(new Date());

    //Logins In firebase Admin which has read-only access to the RTD
    this.props.loginUser(FIREBASE_USER, FIREBASE_PASSWORD);
    this.props.getPrediction('clean', [], true);
    if (this.props.bus_favorites.length > 0) {
      rid = [];
      sid = [];
      this.props.bus_favorites.forEach(function(bid) {
        if (!rid.includes(bid.split('-')[1])) {
          rid.push(bid.split('-')[1]);
        }
        if (!sid.includes(bid.split('-')[0])) {
          sid.push(bid.split('-')[0]);
        }
        // if (Object.keys(this.state.busName).includes(bid.split('-')[1])) {
        //   this.setState({ busRefreshing: false });
        // }
      });

      this.props.getPrediction(rid, sid, true);
    }
  }

  componentDidMount() {
    //At Every Second, the method below Time() is run. Use this to monitor refreshes
    //this.timer = setInterval(()=> this.Time(), 1000);
    //This pulls the FireBase Header Data
    this.props.pullBanner();
    this.props.getBusStops('clean');
    this.props.getBusStops(this.props.campus);
  }

  Time() {
    var x = new Date();
    this.props.timeAction(x);
  }

  onRefresh() {
    this.setState({ busRefreshing: true });
    this.props.getPrediction('clean', [], true);
    rid = [];
    sid = [];
    if (this.props.bus_favorites.length > 0) {
      this.props.bus_favorites.forEach(function(bid) {
        if (!rid.includes(bid.split('-')[1])) {
          rid.push(bid.split('-')[1]);
        }
        if (!sid.includes(bid.split('-')[0])) {
          sid.push(bid.split('-')[0]);
        }
      });
      this.props.getPrediction(rid, sid, true);
    }
    this.setState({ busRefreshing: false });
  }

  onBusPress() {
    this.props.getBusStops('clean');
    Actions.bus_screen();
    this.props.getBusStops(this.props.campus);
  }

  onClassPress() {
    Actions.jump('subjects_screen');
  }

  formBusId() {
    idList = [];
    this.props.bus_favorites.forEach(function(bid) {
      s = bid.split('-')[0];
      r = bid.split('-')[1];
      sn = info['s' + s].sname;
      rn = info['r' + r].rname;
      d = info['s' + s].distance;
      if (idList.find(obj => obj.sid == s)) {
        idList.find(obj => obj.sid == s).rid.push({ rid: r, rname: rn, prediction: [] });
      } else {
        idList.push({
          sid: s,
          rid: [{ rid: r, rname: rn, prediction: [] }],
          distance: d,
          sname: sn,
        });
      }
    });
    return idList;
  }

  renderFavBus() {
    info = this.props.bus_info;
    prediction = [];
    prediction = this.props.today_prediction;
    if (this.props.bus_favorites.length > 0) {
      idList = this.formBusId();
      prediction.forEach(function(s, index) {
        if (idList.find(obj => obj.sid == s.stop_id)) {
          s.arrivals.forEach(function(element) {
            now = new Date();
            arrival = new Date(element.arrival_at);
            diffMs = arrival - now;
            diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
            if (
              idList.find(obj => obj.sid == s.stop_id).rid.find(obj => obj.rid == element.route_id)
            ) {
              idList
                .find(obj => obj.sid == s.stop_id)
                .rid.find(obj => obj.rid == element.route_id)
                .prediction.push(diffMins);
            }
          });
        }
      });
      return (
        <View style={{ paddingVertical: 9 }}>
          {idList
            .sort((a, b) => (a.distance > b.distance ? 1 : b.distance > a.distance ? -1 : 0))
            .map(s => (
              <View key={s.sid}>
                <View style={styles.flexContainer}>
                  <Text style={{ fontSize: 17, fontWeight: '600', maxWidth: 270 }}>{s.sname}</Text>
                  <Text style={{ fontSize: 11, color: 'rgb(200, 199, 204)' }}>{s.distance} mi</Text>
                </View>
                {s.rid
                  .sort((a, b) => (a.rname > b.rname ? 1 : b.rname > a.rname ? -1 : 0))
                  .map(r => (
                    <RouteInStop
                      today={true}
                      rid={r.rid}
                      key={s.sid + r.rid}
                      rname={r.rname}
                      prediction={r.prediction}
                    />
                  ))}
              </View>
            ))}
        </View>
      );
    } else {
      return (
        <View style={[styles.cardBodyContainer, { marginBottom: 20 }]}>
          <Image style={styles.emptyImage} source={require('../images/Today/noBus.png')} />
          <Text style={styles.emptyText}>Quickly access your favorites buses here.</Text>
          <TouchableOpacity onPress={this.onBusPress.bind(this)}>
            <Text style={styles.emptyButton}>Add Buses</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  render() {
    return (
      <View style={styles.home}>
        <StatusBar barStyle="dark-content" />
        <Header text={'Today'} dateText={this.props.dateText} showProfilePic={true} />
        <HomeBanner message={this.props.banner} />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.busRefreshing}
              onRefresh={this.onRefresh.bind(this)}
            />
          }
        >
          {this.state.classEmpty && (
            <View style={styles.cardContainer}>
              <View style={styles.cardTitleContainer}>
                <View style={{ flexDirection: 'row' }}>
                  <Image style={styles.cardIcon} source={require('../images/Today/Class.png')} />
                  <Text style={styles.cardTitle}>Classes</Text>
                </View>
                <TouchableOpacity>
                  <Text style={styles.cardTitle}>Edit</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.cardBodyContainer, { marginVertical: 20 }]}>
                <Text style={styles.emptyText}>Quickly access your schedule of classes here.</Text>
                <TouchableOpacity onPress={this.onClassPress.bind(this)}>
                  <Text style={styles.emptyButton}>Add Classes</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.cardContainer}>
            <View style={styles.cardTitleContainer}>
              <View style={{ flexDirection: 'row' }}>
                <Image style={styles.cardIcon} source={require('../images/Today/Bus.jpg')} />
                <Text style={styles.cardTitle}>Buses</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.cardTitle}>Edit</Text>
              </TouchableOpacity>
            </View>
            {this.renderFavBus()}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = {
  home: {
    flex: 1,
    backgroundColor: 'rgb(255, 255, 255)',
  },
  cardContainer: {
    marginHorizontal: 15,
    marginVertical: 10,
    borderColor: 'rgb(233, 233, 233)',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: 'white',
    shadowOffset: { width: 3, height: 5 },
    shadowColor: 'rgb(233, 233, 233)',
    shadowOpacity: 0.8,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderBottomColor: 'rgb(233, 233, 233)',
    borderBottomWidth: 1,
  },
  cardBodyContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  cardIcon: {
    height: 15,
    width: 15,
  },
  cardTitle: {
    fontSize: 14,
    color: 'rgb(237, 69, 69)',
    paddingLeft: 6,
  },
  emptyText: {
    fontSize: 15,
    color: 'rgb(142, 142, 147)',
    width: '100%',
    textAlign: 'center',
  },
  emptyImage: {
    height: 230,
    width: 230,
  },
  emptyButton: {
    fontSize: 15,
    borderColor: 'rgb(142, 142, 147)',
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 3,
    paddingHorizontal: 12,
    marginTop: 10,
    color: 'rgb(142, 142, 147)',
  },
  flexContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 13,
  },
};

const mapStateToProps = state => {
  return {
    login: state.home.login,
    banner: state.home.banner,
    dateText: state.home.dateText,
    classSetting: state.class.class_setting,
    bus_favorites: state.favorite.bus_favorites,
    today_prediction: state.bus.today_prediction,
    today_has_prediction: state.bus.today_has_prediction,
    bus_info: state.bus.bus_info,
  };
};

export default connect(
  mapStateToProps,
  {
    loginUser,
    pullBanner,
    timeAction,
    pullDate,
    getBusStops,
    getAllClass,
    deleteFavoriteBus,
    getPrediction,
  },
)(TodayScreen);
