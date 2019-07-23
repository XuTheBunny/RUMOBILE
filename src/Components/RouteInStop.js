import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { addFavoriteBus, deleteFavoriteBus, setCounts } from '../actions';
import { routeColor } from '../../bus_color.json';

var color = 'rgb(142, 142, 147)';
var tag = '?';

class RouteInStop extends React.Component {
  state = { like: this.props.bus_favorites.includes(this.props.sid + '-' + this.props.rid) };

  storeFavBusData = async (busId, add) => {
    var favBusArray = [];
    if (add) {
      favBusArray = [...this.props.bus_favorites, busId];
    } else {
      favBusArray = this.props.bus_favorites.filter(item => busId !== item);
    }
    try {
      await AsyncStorage.setItem('bus_favorites', JSON.stringify({ busFav: favBusArray }));
    } catch (e) {
      console.log(e);
    }
  };

  formPrediction() {
    if (this.props.prediction.length > 0) {
      return this.props.prediction.map((n, index) => (
        <View key={index}>
          {n < 1 ? (
            <View style={styles.predictionHorizontal}>
              <Text style={{ fontSize: 22, color: 'rgb(237, 69, 69)' }}>Now</Text>
            </View>
          ) : (
            <View
              style={this.props.today ? styles.predictionVertical : styles.predictionHorizontal}
            >
              <Text style={{ fontSize: 22 }}>{n}</Text>
              <Text style={{ fontSize: 11, marginLeft: 2, color: 'rgb(200, 199, 204)' }}>min</Text>
            </View>
          )}
        </View>
      ));
    } else {
      return <Text style={styles.greyText}>No predictions</Text>;
    }
  }

  getColor(rname) {
    return routeColor.find(obj => obj.rname == rname).rcolor;
  }

  getTag(rname) {
    return routeColor.find(obj => obj.rname == rname).rtag;
  }

  render() {
    return (
      <View style={styles.flexContainer}>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.imgContainer}>
            <View style={[styles.busIconBox, { backgroundColor: this.getColor(this.props.rname) }]}>
              <Text style={styles.busIconText}>{this.getTag(this.props.rname)}</Text>
            </View>
          </View>
          {this.formPrediction()}
        </View>
        {this.props.sid && (
          <TouchableOpacity
            onPress={() => {
              if (this.state.like) {
                this.props.deleteFavoriteBus(this.props.sid + '-' + this.props.rid);
                this.storeFavBusData(this.props.sid + '-' + this.props.rid, false);
              } else {
                this.props.setCounts(1);
                this.props.addFavoriteBus(this.props.sid + '-' + this.props.rid);
                this.storeFavBusData(this.props.sid + '-' + this.props.rid, true);
              }
              this.setState({
                like: !this.state.like,
              });
            }}
          >
            {this.state.like ? (
              <Image style={styles.heartImage} source={require('../images/Like/LikeFilled.png')} />
            ) : (
              <Image style={styles.heartImage} source={require('../images/Like/Like.png')} />
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  }
}
const styles = {
  flexContainer: {
    flexDirection: 'row',
    marginVertical: 8,
    marginLeft: 6,
    marginRight: 19,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imgContainer: {
    height: 40,
    width: 90,
    borderRightColor: 'rgb(235,235,235)',
    borderRightWidth: 0.5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartImage: {
    width: 22,
    height: 19,
  },
  greyText: {
    fontSize: 16,
    color: 'rgb(155, 155, 155)',
    fontStyle: 'italic',
    marginLeft: 20,
    marginTop: 10,
  },
  predictionHorizontal: {
    width: 74,
    paddingRight: 10,
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  predictionVertical: {
    width: 60,
    paddingRight: 10,
    marginTop: 5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  busIconText: {
    fontSize: 15,
    color: 'rgb(255, 255, 255)',
  },
  busIconBox: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
};

const mapStateToProps = state => {
  return {
    bus_favorites: state.favorite.bus_favorites,
  };
};

export default connect(
  mapStateToProps,
  { addFavoriteBus, deleteFavoriteBus, setCounts },
)(RouteInStop);
