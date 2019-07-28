import React, { Component } from 'react';
import { FIREBASE_USER, FIREBASE_PASSWORD } from '../../env.json';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { SwipeRow } from 'react-native-swipe-list-view';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  AppState,
  SafeAreaView,
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import Header from '../Components/Header';
import HomeBanner from '../Components/HomeBanner';
import RouteInStop from '../Components/RouteInStop';
import MeetingItem from '../Components/MeetingItem';
import NotificationBar from '../Components/NotificationBar';
import { routeColor, busInfo } from '../../bus_color.json';
import { noClass } from '../../message.json';
import Loading from '../Components/Loading';
import {
  loginUser,
  pullBanner,
  pullDate,
  getBusStops,
  getAllClass,
  deleteFavoriteClass,
  deleteFavoriteBus,
  getPrediction,
  setCampus,
  setClass,
  setFavoriteClass,
  setFavoriteBus,
  getBusInfo,
  hasInternet,
} from '../actions';

var timer = 0;
class TodayScreen extends Component {
  state = {
    busRefreshing: false,
    appState: AppState.currentState,
  };

  storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.log(e);
    }
  };

  getCampusData = async () => {
    try {
      const w = await AsyncStorage.getItem('campus');
      if (w == null) {
        this.storeData('campus', this.props.campus);
      } else {
        this.props.setCampus(w);
      }
      this.props.getBusStops('clean');
      this.props.getBusStops(this.props.campus);
    } catch (e) {
      console.log(e);
    }
  };

  getClassSettingData = async () => {
    try {
      const w = await AsyncStorage.getItem('class_setting');
      if (w == null) {
        this.storeData('class_setting', JSON.stringify(this.props.class_setting));
      } else {
        this.props.setClass(JSON.parse(w));
      }
    } catch (e) {
      console.log(e);
    }
  };

  getFavClassData = async () => {
    try {
      const w = await AsyncStorage.getItem('class_favorites');
      if (w == null) {
        this.storeData('class_favorites', JSON.stringify({ classFav: this.props.class_favorites }));
      } else {
        this.props.setFavoriteClass(JSON.parse(w).classFav);
      }
    } catch (e) {
      console.log(e);
    }
  };

  getFavBusData = async () => {
    try {
      const w = await AsyncStorage.getItem('bus_favorites');
      if (w == null) {
        this.storeData(
          'bus_favorites',
          JSON.stringify({ busFav: this.props.this.props.bus_favorites }),
        );
      } else {
        this.props.setFavoriteBus(JSON.parse(w).busFav);
      }
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
    } catch (e) {
      console.log(e);
    }
  };

  componentDidMount() {
    this.props.getBusInfo();
    this.getCampusData();
    this.getClassSettingData();
    this.getFavClassData();
    this.getFavBusData();
    //Handles the Date Text at the top of the Header
    this.props.pullDate(new Date());

    //Logins In firebase Admin which has read-only access to the RTD
    this.props.loginUser(FIREBASE_USER, FIREBASE_PASSWORD);
    this.props.getPrediction('clean', [], true);

    //At Every Second, the method below Time() is run. Use this to monitor refreshes
    //this.timer = setInterval(()=> this.Time(), 1000);
    //This pulls the FireBase Header Data
    this.props.pullBanner();
    timer = setInterval(() => this.Time(), 30000);
    AppState.addEventListener('change', this._handleAppStateChange);
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      this.props.hasInternet(state.isConnected);
    });
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    unsubscribe();
  }

  _handleAppStateChange = nextAppState => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this.Time();
      this.props.getBusInfo();
      this.props.getBusStops(this.props.campus);
    }
    this.setState({ appState: nextAppState });
  };

  Time() {
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
  }

  onRefresh() {
    this.setState({ busRefreshing: true });
    this.Time();
    this.setState({ busRefreshing: false });
  }

  onBusPress() {
    this.props.getBusStops('clean');
    Actions.bus_screen();
    this.props.getBusStops(this.props.campus);
  }

  onClassPress() {
    if (this.props.class.length > 0) {
      Actions.more();
    } else {
      Actions.jump('subjects_screen');
    }
  }

  onFavClassPress(classList, today) {
    Actions.favClass_screen({ classList, today });
  }

  onFavBusPress() {
    Actions.favBus_screen();
  }

  onBusDelete(busId) {
    var favBusArray = [];
    favBusArray = this.props.bus_favorites.filter(item => busId !== item);
    this.storeData('bus_favorites', JSON.stringify({ busFav: favBusArray }));
  }

  onClassDelete(classObj) {
    var favClassArray = [];
    favClassArray = this.props.class_favorites.filter(item => classObj.classId !== item.classId);
    this.storeData('class_favorites', JSON.stringify({ classFav: favClassArray }));
  }

  formBusId() {
    info = Object.keys(this.props.bus_info).length > 0 ? this.props.bus_info : busInfo;
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
          predictionCount: 0,
        });
      }
    });
    return idList;
  }

  formClass() {
    classList = [
      { title: 'Independent Study', data: [] },
      { title: 'Monday', data: [] },
      { title: 'Tuesday', data: [] },
      { title: 'Wednesday', data: [] },
      { title: 'Thursday', data: [] },
      { title: 'Friday', data: [] },
      { title: 'Saturday', data: [] },
      { title: 'Sunday', data: [] },
    ];
    this.props.class_favorites.forEach(function(c) {
      c.data.forEach(function(d) {
        d.className = c.className;
        if (d.w == 'A') {
          d.classId = c.classId;
          classList.find(obj => obj.title == 'Independent Study').data.push(d);
        } else {
          d.classId = c.classId;
          classList.find(obj => obj.title == d.day).data.push(d);
        }
      });
    });
    classList.forEach(function(c) {
      if (c.data.length > 0) {
        c.data.forEach(function(item) {
          if (
            item.pmCode == ' PM' &&
            parseInt(item.startTime.split(':')[0]) < parseInt(item.endTime.split(':')[0])
          ) {
            item.hour =
              (parseInt(item.startTime.split(':')[0]) + 12).toString() +
              ':' +
              item.startTime.split(':')[1];
          } else {
            if (item.startTime.length < 5) {
              item.hour = '0' + item.startTime;
            } else {
              item.hour = item.startTime;
            }
          }
        });
        c.data.sort((a, b) => (a.hour > b.hour ? 1 : b.hour > a.hour ? -1 : 0));
      }
    });
    return classList;
  }

  renderFavClass() {
    if (this.props.class_favorites.length > 0) {
      classList = this.formClass();
      d = new Date();
      n = d.getDay() == 0 ? d.getDay() + 7 : d.getDay();
      todayClass = classList[n].data;
      i = Math.floor(Math.random() * noClass.length);
      if (todayClass.length > 0) {
        return (
          <View style={styles.cardContainer}>
            <View style={styles.cardTitleContainer}>
              <View style={{ flexDirection: 'row' }}>
                <Image style={styles.cardIcon} source={require('../images/Today/Bus.jpg')} />
                <Text style={styles.cardTitle}>Classes</Text>
              </View>
              <TouchableOpacity onPress={() => this.onFavClassPress(classList, classList[n].title)}>
                <Image
                  style={styles.moreIcon}
                  source={require('../images/TabBar/MoreSelected.png')}
                />
              </TouchableOpacity>
            </View>
            <View style={{ paddingVertical: 9 }}>
              {todayClass.map((item, index) => (
                <SwipeRow
                  key={item.day + item.startTime + index.toString()}
                  disableRightSwipe
                  disableLeftSwipe={this.state.editing == 'edit'}
                  rightOpenValue={-75}
                  onRowDidOpen={() => {
                    this.setState({ editing: 'swipe' });
                  }}
                >
                  <View style={styles.rowBack}>
                    <TouchableOpacity
                      onPress={() => {
                        sectionObj = this.props.class_favorites.find(
                          obj => obj.classId == item.classId,
                        );
                        this.props.deleteFavoriteClass(sectionObj);
                        this.onClassDelete(sectionObj);
                      }}
                    >
                      <Text style={{ color: 'white', padding: 15 }}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.rowFront}>
                    <MeetingItem item={item} className={item.className} />
                  </View>
                </SwipeRow>
              ))}
            </View>
          </View>
        );
      } else {
        return (
          <View style={styles.cardContainer}>
            <View style={styles.cardTitleContainer}>
              <View style={{ flexDirection: 'row' }}>
                <Image style={styles.cardIcon} source={require('../images/Today/Class.png')} />
                <Text style={styles.cardTitle}>Classes</Text>
              </View>
              <TouchableOpacity onPress={() => this.onFavClassPress(classList, classList[n].title)}>
                <Image
                  style={styles.moreIcon}
                  source={require('../images/TabBar/MoreSelected.png')}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => this.onFavClassPress(classList, classList[n].title)}>
              <View style={[styles.cardBodyContainer, { marginVertical: 20 }]}>
                <Text style={styles.emptyEmoji}>{noClass[i].split('-')[1]}</Text>
                <Text style={styles.emptyText}>{noClass[i].split('-')[0]}</Text>
              </View>
            </TouchableOpacity>
          </View>
        );
      }
    } else {
      return (
        <View style={styles.cardContainer}>
          <View style={styles.cardTitleContainer}>
            <View style={{ flexDirection: 'row' }}>
              <Image style={styles.cardIcon} source={require('../images/Today/Class.png')} />
              <Text style={styles.cardTitle}>Classes</Text>
            </View>
          </View>
          <View style={[styles.cardBodyContainer, { marginVertical: 20 }]}>
            <Text style={styles.emptyText}>Quickly access your schedule of classes here.</Text>
            <TouchableOpacity onPress={this.onClassPress.bind(this)}>
              <Text style={styles.emptyButton}>Add Classes</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }

  renderFavBus() {
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
              idList.find(obj => obj.sid == s.stop_id).predictionCount += 1;
            }
          });
        }
      });
      if (idList.filter(s => s.predictionCount > 0).length > 0) {
        return (
          <View style={styles.cardContainer}>
            <View style={styles.cardTitleContainer}>
              <View style={{ flexDirection: 'row' }}>
                <Image style={styles.cardIcon} source={require('../images/Today/Bus.jpg')} />
                <Text style={styles.cardTitle}>Buses</Text>
              </View>
              <TouchableOpacity onPress={() => this.onFavBusPress()}>
                <Image
                  style={styles.moreIcon}
                  source={require('../images/TabBar/MoreSelected.png')}
                />
              </TouchableOpacity>
            </View>
            <View style={{ paddingVertical: 9 }}>
              {idList
                .sort((a, b) => (a.distance > b.distance ? 1 : b.distance > a.distance ? -1 : 0))
                .filter(s => s.predictionCount > 0)
                .map(s => (
                  <View key={s.sid}>
                    <View style={styles.flexContainer}>
                      <Text style={{ fontSize: 17, fontWeight: '600', maxWidth: 270 }}>
                        {s.sname}
                      </Text>
                      <Text style={{ fontSize: 11, color: 'rgb(200, 199, 204)' }}>
                        {s.distance} mi
                      </Text>
                    </View>
                    {s.rid
                      .sort((a, b) => (a.rname > b.rname ? 1 : b.rname > a.rname ? -1 : 0))
                      .filter(r => r.prediction.length > 0)
                      .map(r => (
                        <SwipeRow
                          preview={false}
                          previewOpenValue={-75}
                          key={s.sid + r.rid}
                          disableRightSwipe
                          rightOpenValue={-75}
                        >
                          <View style={styles.rowBack}>
                            <TouchableOpacity
                              onPress={() => {
                                this.props.deleteFavoriteBus(s.sid + '-' + r.rid);
                                this.onBusDelete(s.sid + '-' + r.rid);
                              }}
                            >
                              <Text style={{ color: 'white', padding: 15 }}>Delete</Text>
                            </TouchableOpacity>
                          </View>
                          <View style={styles.rowFront}>
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
            </View>
          </View>
        );
      } else {
        return (
          <View style={styles.cardContainer}>
            <View style={styles.cardTitleContainer}>
              <View style={{ flexDirection: 'row' }}>
                <Image style={styles.cardIcon} source={require('../images/Today/Bus.jpg')} />
                <Text style={styles.cardTitle}>Buses</Text>
              </View>
              <TouchableOpacity onPress={() => this.onFavBusPress()}>
                <Image
                  style={styles.moreIcon}
                  source={require('../images/TabBar/MoreSelected.png')}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => this.onFavBusPress()}>
              <View style={[styles.cardBodyContainer, { marginBottom: 30 }]}>
                <Image style={styles.emptyImage} source={require('../images/Today/noBus.png')} />
                <Text style={[styles.emptyText, { marginTop: 10 }]}>
                  None of your favorite buses are active now.
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        );
      }
    } else {
      return (
        <View style={styles.cardContainer}>
          <View style={styles.cardTitleContainer}>
            <View style={{ flexDirection: 'row' }}>
              <Image style={styles.cardIcon} source={require('../images/Today/Bus.jpg')} />
              <Text style={styles.cardTitle}>Buses</Text>
            </View>
          </View>
          <View style={[styles.cardBodyContainer, { marginBottom: 20 }]}>
            <Image style={styles.emptyImage} source={require('../images/Today/noBus.png')} />
            <Text style={styles.emptyText}>Quickly access your favorites buses here.</Text>
            <TouchableOpacity onPress={this.onBusPress.bind(this)}>
              <Text style={styles.emptyButton}>Add Buses</Text>
            </TouchableOpacity>
          </View>
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
        <View style={{ flex: 1, backgroundColor: 'white' }}>
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
            {this.renderFavClass()}
            {this.renderFavBus()}
          </ScrollView>
        </View>
      </SafeAreaView>
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
    alignItems: 'center',
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
  moreIcon: {
    resizeMode: 'contain',
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
  emptyEmoji: {
    fontSize: 30,
    width: '100%',
    textAlign: 'center',
    paddingBottom: 5,
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
    alignItems: 'flex-end',
    marginHorizontal: 13,
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
    login: state.home.login,
    banner: state.home.banner,
    dateText: state.home.dateText,
    internet: state.home.internet,
    class_setting: state.class.class_setting,
    class: state.class.class,
    campus: state.bus.campus,
    class_favorites: state.favorite.class_favorites,
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
    pullDate,
    getBusStops,
    getAllClass,
    deleteFavoriteClass,
    deleteFavoriteBus,
    getPrediction,
    setCampus,
    setClass,
    setFavoriteClass,
    setFavoriteBus,
    getBusInfo,
    hasInternet,
  },
)(TodayScreen);
