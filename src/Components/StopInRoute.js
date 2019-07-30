import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { addFavoriteBus, deleteFavoriteBus, setCounts, getPrediction } from '../actions';

class StopInRoute extends React.Component {
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

    if (favBusArray.length > 0) {
      rid = [];
      sid = [];
      favBusArray.forEach(function(bid) {
        if (!rid.includes(bid.split('-')[1])) {
          rid.push(bid.split('-')[1]);
        }
        if (!sid.includes(bid.split('-')[0])) {
          sid.push(bid.split('-')[0]);
        }
      });
      this.props.getPrediction(rid, sid, true);
    }
  };

  formPrediction() {
    if (this.props.prediction.length > 0) {
      if (this.props.prediction[0] < 1) {
        s = this.props.prediction.slice(1).join(', ');
        return (
          <Text style={styles.prediction}>
            <Text style={styles.predictionRed}>Arriving now, </Text>
            {s} min
          </Text>
        );
      } else {
        s = this.props.prediction.join(', ');
        return <Text style={styles.prediction}>In {s} min</Text>;
      }
    } else {
      return <Text style={styles.prediction}>No predictions</Text>;
    }
  }

  render() {
    return (
      <View
        style={[
          styles.flexContainer,
          this.props.nearest && { backgroundColor: 'rgb(231, 255, 205)' },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            if (this.props.bus_favorites.includes(this.props.sid + '-' + this.props.rid)) {
              this.props.deleteFavoriteBus(this.props.sid + '-' + this.props.rid);
              this.storeFavBusData(this.props.sid + '-' + this.props.rid, false);
            } else {
              this.props.setCounts(1);
              this.props.addFavoriteBus(this.props.sid + '-' + this.props.rid);
              this.storeFavBusData(this.props.sid + '-' + this.props.rid, true);
            }
          }}
        >
          {this.props.bus_favorites.includes(this.props.sid + '-' + this.props.rid) ? (
            <Image style={styles.heartImage} source={require('../images/Like/LikeFilled.png')} />
          ) : (
            <Image style={styles.heartImage} source={require('../images/Like/Like.png')} />
          )}
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <View style={styles.viewStyle}>
            <Text style={styles.stopName}>{this.props.sname}</Text>
            <Text style={styles.distance}>{this.props.distance} mi</Text>
          </View>
          <View style={{ marginVertical: 2 }}>
            {this.props.nearest && (
              <Text style={styles.nearestText}>Nearest Stop to Your Location</Text>
            )}
          </View>
          {this.formPrediction()}
        </View>
      </View>
    );
  }
}
const styles = {
  flexContainer: {
    flexDirection: 'row',
  },
  textContainer: {
    borderBottomColor: 'rgb(235,235,235)',
    borderBottomWidth: 0.5,
    paddingVertical: 12,
    flex: 2,
  },
  viewStyle: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heartImage: {
    width: 22,
    height: 19,
    marginRight: 20,
    marginLeft: 25,
    marginTop: 14,
  },
  stopName: {
    flex: 2,
    fontSize: 17,
    fontWeight: '500',
    marginRight: 10,
  },
  distance: {
    width: 50,
    fontSize: 11,
    color: 'rgb(100, 100, 100)',
  },
  prediction: {
    fontSize: 12,
    fontWeight: '300',
  },
  predictionRed: {
    fontSize: 12,
    fontWeight: '300',
    color: 'rgb(237, 69, 69)',
  },
  nearestText: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgb(78, 136, 14)',
    fontStyle: 'italic',
  },
};

const mapStateToProps = state => {
  return {
    bus_favorites: state.favorite.bus_favorites,
  };
};

export default connect(
  mapStateToProps,
  { addFavoriteBus, deleteFavoriteBus, setCounts, getPrediction },
)(StopInRoute);
