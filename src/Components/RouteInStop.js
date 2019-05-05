import React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { getPrediction } from '../actions';
import { routeColor } from '../../route_color.json';

var color = 'rgb(142, 142, 147)';
var tag = '?';

class RouteInStop extends React.Component {
  state = { like: false };

  formPrediction() {
    if (this.props.prediction.length > 0) {
      return this.props.prediction.map((n, index) => (
        <View key={index}>
          {n < 1 ? (
            <View style={styles.predictionContainer}>
              <Text style={{ fontSize: 22, color: 'rgb(237, 69, 69)' }}>Now</Text>
            </View>
          ) : (
            <View style={styles.predictionContainer}>
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
        <TouchableOpacity
          onPress={() => {
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
  predictionContainer: {
    width: 74,
    paddingRight: 10,
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
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

export default RouteInStop;
