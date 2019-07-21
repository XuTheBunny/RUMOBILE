import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { ImageBackground, View, Text } from 'react-native';
import { setCounts } from '../actions';

const tabImage = {
  Today: {
    Selected: require('../images/TabBar/TodaySelected.jpg'),
    Unselected: require('../images/TabBar/TodayUnselected.jpg'),
  },
  Bus: {
    Selected: require('../images/TabBar/BusSelected.jpg'),
    Unselected: require('../images/TabBar/BusUnselected.jpg'),
  },
  Food: {
    Selected: require('../images/TabBar/FoodSelected.jpg'),
    Unselected: require('../images/TabBar/FoodUnselected.jpg'),
  },
  Links: {
    Selected: require('../images/TabBar/LinksSelected.png'),
    Unselected: require('../images/TabBar/LinksUnselected.jpg'),
  },
  More: {
    Selected: require('../images/TabBar/MoreSelected.png'),
    Unselected: require('../images/TabBar/MoreUnselected.jpg'),
  },
};

class TabIcon extends Component {
  componentWillUpdate() {
    console.log(this.props);
  }

  renderFavCounts() {
    if (this.props.title == 'Today' && !this.props.focused && this.props.counts > 0) {
      return (
        <View
          style={{
            width: 17,
            height: 17,
            backgroundColor: 'rgb(237,69,69)',
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 22,
          }}
        >
          <Text
            style={{
              fontSize: 11,
              color: 'white',
            }}
          >
            {this.props.counts}
          </Text>
        </View>
      );
    } else {
      return null;
    }
  }
  render() {
    return (
      <View>
        <ImageBackground
          style={{
            width: 41,
            height: 35,
            marginTop: 17,
            marginBottom: 10,
          }}
          imageStyle={{
            marginLeft: 6,
            marginTop: 3,
            width: 27,
            height: 27,
          }}
          resizeMode="contain"
          source={tabImage[this.props.title][this.props.focused ? 'Selected' : 'Unselected']}
        >
          {this.renderFavCounts()}
        </ImageBackground>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    counts: state.home.counts,
  };
};

export default connect(
  mapStateToProps,
  { setCounts },
)(TabIcon);
