import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import BackButton from '../Components/BackButton';
import { foodTab } from '../actions';
import FoodSection from '../Components/FoodSection';

class FoodList extends Component {
  componentDidMount() {
    this.props.foodTab(0);
  }

  backToFood() {
    Actions.pop();
  }

  handleIndexChange = index => {
    this.props.foodTab(index);
  };

  renderFoodLists() {
    return this.props.data.meals[this.props.tab_index].genres.map(genre => (
      <FoodSection key={genre.genre_name} food={genre} />
    ));
  }

  render() {
    return (
      <SafeAreaView style={styles.home}>
        <BackButton text={'Food'} />
        <View style={styles.titleBar}>
          <Text style={styles.titleText}>{this.props.data.location_name}</Text>
          <SegmentedControlTab
            values={['BREAKFAST', 'LUNCH', 'DINNER', 'TAKEOUT']}
            selectedIndex={this.props.tab_index}
            onTabPress={this.handleIndexChange}
            activeTabStyle={styles.activeTabStyle}
            tabStyle={styles.tabStyle}
            tabTextStyle={styles.tabTextStyle}
          />
        </View>
        {this.props.data.meals[this.props.tab_index].meal_avail ? (
          <ScrollView>{this.renderFoodLists()}</ScrollView>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 55,
            }}
          >
            <Image
              style={{ height: 300 }}
              source={require('../images/Food/blankstate_nofood.png')}
              resizeMode="contain"
            />
            <Text style={styles.emptyText}>There is currently no food at this time.</Text>
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const styles = {
  home: {
    flex: 1,
    backgroundColor: 'rgb(255, 255, 255)',
    paddingTop: 15,
  },
  statusBar: {
    flexDirection: 'row',
  },
  statusBarButton: {
    fontSize: 25,
    fontWeight: '500',
    paddingTop: 30,
    paddingLeft: 30,
  },
  titleBar: {
    paddingLeft: 13,
    paddingRight: 13,
    paddingTop: 11,
    paddingBottom: 10,
  },
  titleText: {
    fontSize: 25,
    color: 'rgb(0, 0, 0)',
    fontWeight: '600',
    paddingBottom: 10,
  },
  activeTabStyle: {
    backgroundColor: '#ed4545',
  },
  tabStyle: {
    borderColor: '#ed4545',
    height: 30,
    paddingBottom: 10,
  },
  tabTextStyle: {
    color: '#ed4545',
  },
  section: {
    flex: 1,
  },
  sectionImgBox: {
    height: 80,
    flexDirection: 'row',
  },
  sectionImage: {
    flex: 1,
    justifyContent: 'center',
  },
  sectionTextBox: {
    borderColor: 'rgb(237, 237, 237)',
    borderBottomWidth: 1,
  },
  sectionTitle: {
    textAlign: 'center',
    color: 'white',
    fontSize: 34,
    fontWeight: '300',
  },
  sectionText: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 30,
    paddingRight: 30,
    fontSize: 18,
  },
  emptyText: {
    fontSize: 15,
    color: 'rgb(142, 142, 147)',
    width: '100%',
    textAlign: 'center',
    marginTop: 20,
  },
};

const mapStateToProps = state => {
  return {
    tab_index: state.food.tab_index,
  };
};

export default connect(
  mapStateToProps,
  { foodTab },
)(FoodList);
