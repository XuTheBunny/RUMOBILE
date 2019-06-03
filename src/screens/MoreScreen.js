import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { setCampus, getBusStops, getAllClass } from '../actions';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Header from '../Components/Header';

class MoreScreen extends Component {
  state = {
    selectedIndex: 0,
  };

  componentWillMount() {
    if (this.props.campus == 'newBrunswick') {
      this.setState({
        selectedIndex: 0,
      });
    } else {
      this.setState({
        selectedIndex: 1,
      });
    }
    this.props.getAllClass(null, this.props.classSetting);
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
    return (
      <View style={styles.home}>
        <Header text={'More'} />
        <Text style={styles.titleText}>Rutgers Buses Campus</Text>
        <View style={styles.titleContainer}>
          <SegmentedControlTab
            values={['New Brunswick', 'Newark']}
            selectedIndex={this.state.selectedIndex}
            onTabPress={this.handleIndexChange}
            activeTabStyle={styles.activeTabStyle}
            tabStyle={styles.tabStyle}
            tabTextStyle={styles.tabTextStyle}
          />
        </View>
        <ScrollView>
          <TouchableOpacity
            onPress={() => {
              Actions.subjects_screen();
            }}
          >
            <View style={styles.listContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image style={styles.iconStyle} source={require('../images/More/Classes.png')} />
                <Text style={styles.listText}>Classes</Text>
              </View>
              <EvilIcons name="chevron-right" size={30} color="rgb(138,138,143)" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.listContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image style={styles.iconStyle} source={require('../images/More/Red.png')} />
                <Text style={styles.listText}>About</Text>
              </View>
              <EvilIcons name="chevron-right" size={30} color="rgb(138,138,143)" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.listContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image style={styles.iconStyle} source={require('../images/More/Settings.png')} />
                <Text style={styles.listText}>Settings</Text>
              </View>
              <EvilIcons name="chevron-right" size={30} color="rgb(138,138,143)" />
            </View>
          </TouchableOpacity>
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
  titleContainer: {
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 25,
  },
  titleText: {
    fontSize: 19,
    marginLeft: 16,
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
  listContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderBottomColor: 'rgb(235,235,235)',
    borderBottomWidth: 0.5,
  },
  iconStyle: {
    height: 29,
    width: 29,
  },
  listText: {
    paddingLeft: 15,
    fontSize: 17,
  },
};

const mapStateToProps = state => {
  return {
    campus: state.bus.campus,
    classSetting: state.class.class_setting,
  };
};

export default connect(
  mapStateToProps,
  { setCampus, getBusStops, getAllClass },
)(MoreScreen);
