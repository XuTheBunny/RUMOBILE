import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  AppState,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';
import Header from '../Components/Header';
import NotificationBar from '../Components/NotificationBar';
import { getBusStops } from '../actions';
import NearbyList from '../Components/NearbyList';
import AllList from '../Components/AllList';
import ActiveList from '../Components/ActiveList';
import InactiveList from '../Components/InactiveList';

class BusScreen extends Component {
  state = {
    showStop1: true,
    showStop2: true,
    showRoute1: true,
    showRoute2: true,
    selectedIndex: 0,
    appState: AppState.currentState,
  };

  onRefresh() {
    this.props.getBusStops('clean');
    this.props.getBusStops(this.props.campus);
  }

  render() {
    currentCampus = { newBrunswick: 'NEW BRUNSWICK', newark: 'NEWARK' };
    return (
      <SafeAreaView style={styles.home}>
        {!this.props.internet && (
          <NotificationBar text="There is no Internet connection" color="rgb(237,69,69)" />
        )}
        <Header text={'Buses'} dateText={currentCampus[this.props.campus]} />
        <View style={{ paddingHorizontal: 13, marginTop: 10 }}>
          <SegmentedControlTab
            values={['Routes', 'Stops']}
            selectedIndex={this.state.selectedIndex}
            onTabPress={index => {
              this.setState({
                selectedIndex: index,
              });
              LayoutAnimation.easeInEaseOut();
            }}
            activeTabStyle={styles.activeTabStyle}
            tabStyle={styles.tabStyle}
            tabTextStyle={styles.tabTextStyle}
          />
        </View>
        <ScrollView
          style={{ marginTop: 12 }}
          refreshControl={
            <RefreshControl
              refreshing={this.props.data_here == 'no'}
              onRefresh={this.onRefresh.bind(this)}
            />
          }
        >
          {this.state.selectedIndex == 1 ? (
            <>
              <View style={styles.viewStyle}>
                <Text style={styles.fontStyle}>Nearby</Text>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      showStop1: !this.state.showStop1,
                    });
                  }}
                >
                  <Icon
                    name={this.state.showStop1 ? 'chevron-up' : 'chevron-down'}
                    size={35}
                    color="rgb(138,138,143)"
                  />
                </TouchableOpacity>
              </View>
              {this.state.showStop1 && <NearbyList />}
              <View style={styles.viewStyle}>
                <Text style={styles.fontStyle}>All</Text>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      showStop2: !this.state.showStop2,
                    });
                  }}
                >
                  <Icon
                    name={this.state.showStop2 ? 'chevron-up' : 'chevron-down'}
                    size={35}
                    color="rgb(138,138,143)"
                  />
                </TouchableOpacity>
              </View>
              {this.state.showStop2 && <AllList />}
            </>
          ) : (
            <>
              <View style={styles.viewStyle}>
                <Text style={styles.fontStyle}>Active Routes</Text>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      showRoute1: !this.state.showRoute1,
                    });
                  }}
                >
                  <Icon
                    name={this.state.showRoute1 ? 'chevron-up' : 'chevron-down'}
                    size={35}
                    color="rgb(138,138,143)"
                  />
                </TouchableOpacity>
              </View>
              {this.state.showRoute1 && <ActiveList />}
              <View style={styles.viewStyle}>
                <Text style={styles.fontStyle}>Inactive Routes</Text>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      showRoute2: !this.state.showRoute2,
                    });
                  }}
                >
                  <Icon
                    name={this.state.showRoute2 ? 'chevron-up' : 'chevron-down'}
                    size={35}
                    color="rgb(138,138,143)"
                  />
                </TouchableOpacity>
              </View>
              {this.state.showRoute2 && <InactiveList />}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = {
  home: {
    flex: 1,
    backgroundColor: 'rgb(255, 255, 255)',
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
  fontStyle: {
    fontFamily: 'System',
    fontWeight: 'bold',
    fontSize: 22,
  },
  viewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 16,
    paddingRight: 5,
    paddingVertical: 12,
  },
};

const mapStateToProps = state => {
  return {
    campus: state.bus.campus,
    data_here: state.bus.data_here,
    internet: state.home.internet,
  };
};

export default connect(
  mapStateToProps,
  { getBusStops },
)(BusScreen);
