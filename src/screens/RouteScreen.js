import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import { View, Text, TouchableOpacity, ScrollView, LayoutAnimation } from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';
import BottomBar from '../Components/BottomBar';
import Header from '../Components/Header';
import ActiveList from '../Components/ActiveList';
import InactiveList from '../Components/InactiveList';

export default class StopScreen extends Component {
  state = {
    show1: true,
    show2: true,
  };

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  onChange() {
    Actions.stop_screen();
  }

  render() {
    return (
      <View style={styles.home}>
        <Header text={'Bus'} />
        <View style={{ paddingLeft: 12, paddingRight: 12 }}>
          <SegmentedControlTab
            values={['Stops', 'Routes']}
            selectedIndex={1}
            onTabPress={this.onChange.bind(this)}
            activeTabStyle={styles.activeTabStyle}
            tabStyle={styles.tabStyle}
            tabTextStyle={styles.tabTextStyle}
          />
        </View>
        <ScrollView style={{ marginBottom: 75 }}>
          <View style={styles.viewStyle}>
            <Text style={styles.fontStyle}>Active Routes</Text>
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
          {this.state.show1 && <ActiveList />}
          <View style={styles.viewStyle}>
            <Text style={styles.fontStyle}>Inactive Routes</Text>
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
          {this.state.show2 && <InactiveList />}
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
    paddingLeft: 16,
  },
  viewStyle: {
    width: '100%',
    height: 26,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingRight: 10,
    marginBottom: 10,
  },
};
