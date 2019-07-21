import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { deleteFavoriteBus, getBusStops, getPrediction } from '../actions';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import RouteInStop from '../Components/RouteInStop';

var timer = 0;

class FavBusScreen extends Component {
  componentDidMount() {
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
      });

      this.props.getPrediction(rid, sid, true);
    }
  }

  backUp() {
    Actions.pop();
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
        <>
          {idList
            .sort((a, b) => (a.distance > b.distance ? 1 : b.distance > a.distance ? -1 : 0))
            .map(s => (
              <View key={s.sid}>
                <Text style={styles.sectionHeader}>{s.sname}</Text>
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
        </>
      );
    } else {
      return (
        <View style={{ marginTop: 20 }}>
          <Image style={styles.emptyImage} source={require('../images/Today/noBus.png')} />
          <Text style={styles.emptyText}>Quickly access your favorites buses here.</Text>
        </View>
      );
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.home}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.headerContainer}>
          <View style={{ height: 64, flexDirection: 'column', justifyContent: 'space-between' }}>
            <Text style={styles.subHeader}>FAVORITE</Text>
            <Text style={styles.cardHeader}>My Buses</Text>
          </View>
          <View
            style={{
              height: 64,
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity onPress={() => this.backUp()}>
              <Icon name="closecircle" size={35} color="rgb(151, 151, 151)" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView>{this.renderFavBus()}</ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = {
  home: {
    flex: 1,
    backgroundColor: 'white',
  },
  cardContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    marginTop: 45,
    paddingBottom: 40,
    marginHorizontal: 5,
  },
  headerContainer: {
    marginTop: 18,
    marginBottom: 8,
    marginHorizontal: 23,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardHeader: {
    fontSize: 34,
    fontWeight: '700',
  },
  subHeader: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgb(142, 142, 147)',
  },
  editButton: {
    fontSize: 14,
    color: 'rgb(237, 69, 69)',
  },
  emptyImage: {
    height: 230,
    width: 230,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '500',
    color: 'rgb(142, 142, 147)',
  },
  sectionHeader: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    paddingTop: 14,
    paddingBottom: 8,
    paddingHorizontal: 23,
  },
};

const mapStateToProps = state => {
  return {
    bus_info: state.bus.bus_info,
    bus_favorites: state.favorite.bus_favorites,
    today_prediction: state.bus.today_prediction,
    today_has_prediction: state.bus.today_has_prediction,
  };
};

export default connect(
  mapStateToProps,
  { deleteFavoriteBus, getBusStops, getPrediction },
)(FavBusScreen);
