import React, { Component } from 'react';
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
import SegmentedControlTab from 'react-native-segmented-control-tab';
import BackButton from '../Components/BackButton';

class SettingScreen extends Component {
  state = {
    selectedIndex: 0,
  };

  componentDidMount() {
    if (this.props.campus == 'newBrunswick') {
      this.setState({
        selectedIndex: 0,
      });
    } else {
      this.setState({
        selectedIndex: 1,
      });
    }
  }

  constructor() {
    super();
    this.state = {
      selectedIndex: 0,
    };
  }

  handleIndexChange = index => {
    campusIndex = ['newBrunswick', 'newark'];
    this.props.setCampus(campusIndex[index]);
    this.props.getBusStops('clean');
    this.props.getBusStops(campusIndex[index]);
    this.setState({
      selectedIndex: index,
    });
  };

  render() {
    console.log(this.props);
    return (
      <SafeAreaView style={styles.home}>
        <BackButton text={'More'} />
        <Text style={styles.headerText}>Settings</Text>
        <View style={styles.cardContainer}>
          <View style={styles.cardTitleContainer}>
            <View style={{ flexDirection: 'row' }}>
              <Image style={styles.cardIcon} source={require('../images/More/bus-grey.png')} />
              <Text style={styles.cardTitle}>Buses Campus</Text>
            </View>
          </View>
          <View style={[styles.cardBodyContainer, { marginBottom: 20 }]}>
            <SegmentedControlTab
              values={['New Brunswick', 'Newark']}
              selectedIndex={this.state.selectedIndex}
              onTabPress={this.handleIndexChange}
              activeTabStyle={styles.activeTabStyle}
              tabStyle={styles.tabStyle}
              tabTextStyle={styles.tabTextStyle}
            />
          </View>
        </View>
        <View style={styles.cardContainer}>
          <View style={styles.cardTitleContainer}>
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
    borderBottomColor: 'rgb(233, 233, 233)',
    borderBottomWidth: 1,
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
};

const mapStateToProps = state => {
  return {
    campus: state.bus.campus,
    location_sharing: state.bus.location_sharing,
  };
};

export default connect(
  mapStateToProps,
  { setCampus, getBusStops },
)(SettingScreen);
