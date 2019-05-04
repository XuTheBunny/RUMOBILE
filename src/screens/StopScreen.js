import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import { View, Text, ScrollView, TouchableOpacity, LayoutAnimation } from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';
import BottomBar from '../Components/BottomBar';
import Header from '../Components/Header';
import { getBusStops } from '../actions';
import NearbyList from '../Components/NearbyList';
import AllList from '../Components/AllList';

class StopScreen extends Component {
  state = {
    show1: true,
    show2: true,
  };

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  componentWillMount() {
    if (this.props.check == 'here') {
    } else {
      this.props.getBusStops(this.props.campus);
    }
  }

  onChange() {
    Actions.route_screen();
  }

  render() {
    return (
      <View style={styles.home}>
        <Header text={'Bus'} />
        <View style={{ paddingHorizontal: 13 }}>
          <SegmentedControlTab
            values={['Stops', 'Routes']}
            selectedIndex={0}
            onTabPress={this.onChange.bind(this)}
            activeTabStyle={styles.activeTabStyle}
            tabStyle={styles.tabStyle}
            tabTextStyle={styles.tabTextStyle}
          />
        </View>
        <ScrollView style={{ marginBottom: 75, marginTop: 12 }}>
          <View style={styles.viewStyle}>
            <Text style={styles.fontStyle}>Nearby</Text>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  show1: !this.state.show1,
                });
              }}
            >
              <Icon
                name={this.state.show1 ? 'chevron-down' : 'chevron-up'}
                size={35}
                color="rgb(138,138,143)"
              />
            </TouchableOpacity>
          </View>
          {this.state.show1 && <NearbyList />}
          <View style={styles.viewStyle}>
            <Text style={styles.fontStyle}>All</Text>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  show2: !this.state.show2,
                });
              }}
            >
              <Icon
                name={this.state.show2 ? 'chevron-down' : 'chevron-up'}
                size={35}
                color="rgb(138,138,143)"
              />
            </TouchableOpacity>
          </View>
          {this.state.show2 && <AllList />}
        </ScrollView>
        <BottomBar hs={true} bus={false} fs={true} ls={true} mr={true} />
      </View>
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
    nearby: state.bus.nb_data,
    all: state.bus.all_data,
    check: state.bus.data_here,
    campus: state.bus.campus,
  };
};

export default connect(
  mapStateToProps,
  { getBusStops },
)(StopScreen);
