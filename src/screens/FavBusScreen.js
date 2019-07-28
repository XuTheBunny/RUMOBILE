import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { SwipeRow } from 'react-native-swipe-list-view';
import AsyncStorage from '@react-native-community/async-storage';
import { deleteFavoriteBus, getBusStops, getPrediction } from '../actions';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  LayoutAnimation,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import RouteInStop from '../Components/RouteInStop';
import NotificationBar from '../Components/NotificationBar';

var timer = 0;

class FavBusScreen extends Component {
  state = {
    editing: 'done',
    swiped: [],
  };

  storeFavBusData = async busId => {
    var favBusArray = [];
    favBusArray = this.props.bus_favorites.filter(item => busId !== item);
    try {
      await AsyncStorage.setItem('bus_favorites', JSON.stringify({ busFav: favBusArray }));
    } catch (e) {
      console.log(e);
    }
  };

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
                    <SwipeRow
                      key={s.sid + r.rid}
                      disableRightSwipe
                      disableLeftSwipe={this.state.editing == 'edit'}
                      rightOpenValue={-75}
                      onRowDidOpen={() => {
                        const id = s.sid + '-' + r.rid;
                        var openedList = [...this.state.swiped, id];
                        this.setState({
                          swiped: openedList,
                        });
                      }}
                      onRowDidClose={() => {
                        const id = s.sid + '-' + r.rid;
                        var openedList = this.state.swiped.filter(i => id !== i);
                        this.setState({
                          swiped: openedList,
                        });
                      }}
                    >
                      <View style={styles.rowBack}>
                        <TouchableOpacity
                          onPress={() => {
                            const id = s.sid + '-' + r.rid;
                            this.props.deleteFavoriteBus(id);
                            this.storeFavBusData(id);
                            var openedList = this.state.swiped.filter(i => id !== i);
                            this.setState({
                              swiped: openedList,
                            });
                          }}
                        >
                          <Text style={{ color: 'white', padding: 15 }}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.rowFront}>
                        {this.state.editing == 'edit' && (
                          <TouchableOpacity
                            onPress={() => {
                              this.props.deleteFavoriteBus(s.sid + '-' + r.rid);
                              this.storeFavBusData(s.sid + '-' + r.rid);
                            }}
                          >
                            <View
                              style={{
                                backgroundColor: 'white',
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingLeft: 20,
                              }}
                            >
                              <Icon name="ios-remove-circle" size={22} color="rgb(237, 69, 69)" />
                            </View>
                          </TouchableOpacity>
                        )}
                        <RouteInStop
                          today={true}
                          rid={r.rid}
                          rname={r.rname}
                          prediction={r.prediction.slice(0, 4)}
                        />
                      </View>
                    </SwipeRow>
                  ))}
              </View>
            ))}
        </>
      );
    } else {
      return (
        <View style={styles.emptyContainer}>
          <Image style={styles.emptyImage} source={require('../images/Today/noBus.png')} />
          <Text style={styles.emptyText}>Quickly access your favorites buses here.</Text>
        </View>
      );
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.home}>
        {!this.props.internet && (
          <NotificationBar text="There is no Internet connection." color="rgb(237,69,69)" />
        )}
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
              <View style={styles.closeButton}>
                <Image
                  style={styles.iconStyle}
                  source={require('../images/Today/actionClose.png')}
                />
              </View>
            </TouchableOpacity>
            {this.state.swiped.length == 0 && (
              <TouchableOpacity
                onPress={() => {
                  LayoutAnimation.easeInEaseOut();
                  if (this.state.editing == 'done') {
                    this.setState({ editing: 'edit' });
                  } else {
                    this.setState({ editing: 'done' });
                  }
                }}
              >
                <Text style={styles.editButton}>
                  {this.state.editing == 'done' ? 'Edit' : 'Done'}
                </Text>
              </TouchableOpacity>
            )}
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
    width: 36,
    fontSize: 14,
    color: 'rgb(237, 69, 69)',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    marginTop: 70,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyImage: {
    height: 230,
    width: 230,
  },
  emptyText: {
    marginTop: 20,
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
  iconStyle: {
    height: 13,
    width: 13,
  },
  closeButton: {
    height: 28,
    width: 28,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderRadius: 14,
    shadowColor: 'rgb(220, 220, 220)',
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    backgroundColor: 'white',
  },
  rowFront: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  rowBack: {
    flex: 1,
    backgroundColor: 'rgb(237, 69, 69)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
};

const mapStateToProps = state => {
  return {
    bus_info: state.bus.bus_info,
    bus_favorites: state.favorite.bus_favorites,
    today_prediction: state.bus.today_prediction,
    today_has_prediction: state.bus.today_has_prediction,
    internet: state.home.internet,
  };
};

export default connect(
  mapStateToProps,
  { deleteFavoriteBus, getBusStops, getPrediction },
)(FavBusScreen);
