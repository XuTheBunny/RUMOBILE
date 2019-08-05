import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { setCampus, getBusStops } from '../actions';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import BackButton from '../Components/BackButton';
import NotificationBar from '../Components/NotificationBar';

class SettingScreen extends Component {
  constructor() {
    super();
    this.state = {
      campus: '',
      campusIndex: [
        { key: 'newBrunswick', value: 'New Brunswick' },
        { key: 'newark', value: 'Newark' },
        { key: 'camden', value: 'Camden' },
      ],
    };
  }

  componentDidMount() {
    this.setState({
      campus: this.props.campus,
    });
  }

  storeCampusData = async key => {
    try {
      await AsyncStorage.setItem('campus', key);
    } catch (e) {
      console.log(e);
    }
  };

  handleIndexChange = key => {
    this.props.setCampus(key);
    this.props.getBusStops('clean');
    this.props.getBusStops(key);
    this.setState({
      campus: key,
    });
    this.storeCampusData(key);
  };

  render() {
    console.log(this.state);
    return (
      <SafeAreaView style={styles.home}>
        {!this.props.internet && (
          <NotificationBar text="There is no Internet connection" color="rgb(237,69,69)" />
        )}
        <BackButton text={'More'} />
        <Text style={styles.headerText}>Settings</Text>
        <View style={styles.cardContainer}>
          <View style={styles.cardTitleContainer}>
            <View style={{ flexDirection: 'row' }}>
              <Image style={styles.cardIcon} source={require('../images/More/bus-grey.png')} />
              <Text style={styles.cardTitle}>Buses Campus</Text>
            </View>
          </View>
          {this.state.campusIndex.map(obj => (
            <TouchableOpacity
              key={obj.key}
              onPress={() => {
                this.handleIndexChange(obj.key);
              }}
            >
              <View style={styles.listItem}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 24, color: 'rgb(74, 74, 74)' }}>{`\u2022`}</Text>
                  <Text style={{ fontSize: 17, marginLeft: 11 }}>{obj.value}</Text>
                </View>
                {this.state.campus == obj.key && (
                  <Icon name="check" size={13} color="rgb(237, 69, 69)" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.cardContainer}>
          <View
            style={[
              styles.cardTitleContainer,
              { borderBottomColor: 'rgb(233, 233, 233)', borderBottomWidth: 1 },
            ]}
          >
            <View style={{ flexDirection: 'row' }}>
              <Image style={styles.cardIcon} source={require('../images/More/settings-grey.png')} />
              <Text style={styles.cardTitle}>App Settings</Text>
            </View>
          </View>
          <View style={styles.cardBodyContainer}>
            <TouchableOpacity onPress={() => Linking.openURL('app-settings:')}>
              <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                <Image style={styles.bodyIcon} source={require('../images/More/location.png')} />
                <View style={styles.listContainer}>
                  <Text style={{ fontSize: 17, color: 'rgb(237, 69, 69)' }}>Location</Text>
                  <Text style={{ fontSize: 17, color: 'rgb(142, 142, 147)' }}>
                    {this.props.location_sharing ? 'Enabled' : 'Disabled'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
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
  headerText: {
    paddingLeft: 16,
    fontSize: 34,
    fontWeight: '700',
    fontFamily: 'System',
    paddingVertical: 8,
  },
  activeTabStyle: {
    backgroundColor: '#ed4545',
  },
  tabStyle: {
    borderColor: '#ed4545',
    height: 30,
  },
  tabTextStyle: {
    color: '#ed4545',
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
  },
  cardBodyContainer: {
    paddingHorizontal: 23,
    paddingTop: 20,
  },
  cardIcon: {
    height: 15,
    width: 15,
  },
  cardTitle: {
    fontSize: 14,
    color: 'rgb(74, 74, 74)',
    paddingLeft: 6,
  },
  bodyIcon: {
    height: 30,
    width: 30,
  },
  listContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 14,
  },
  listItem: {
    paddingLeft: 23,
    paddingRight: 16,
    paddingVertical: 11,
    borderTopColor: 'rgb(233, 233, 233)',
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
};

const mapStateToProps = state => {
  return {
    campus: state.bus.campus,
    location_sharing: state.bus.location_sharing,
    internet: state.home.internet,
  };
};

export default connect(
  mapStateToProps,
  { setCampus, getBusStops },
)(SettingScreen);
