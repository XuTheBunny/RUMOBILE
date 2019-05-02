import React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { getPrediction } from '../actions';

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

  renderRouteImg(rname) {
    var box = {};
    if (rname == 'Route A') {
      box = { h: 23, src: require('../images/BI/biA.png') };
    } else if (rname == 'Route B') {
      box = { h: 23, src: require('../images/BI/biB.png') };
    } else if (rname == 'Route C') {
      box = { h: 23, src: require('../images/BI/biC.png') };
    } else if (rname == 'Route EE') {
      box = { h: 29, src: require('../images/BI/biEE.png') };
    } else if (rname == 'Route F') {
      box = { h: 23, src: require('../images/BI/biF.png') };
    } else if (rname == 'Route H') {
      box = { h: 23, src: require('../images/BI/biH.png') };
    } else if (rname == 'Route LX') {
      box = { h: 29, src: require('../images/BI/biLX.png') };
    } else if (rname == 'Route All Campuses') {
      box = { h: 37, src: require('../images/BI/biALL.png') };
    } else if (rname == 'Route New BrunsQuick 1 Shuttle') {
      box = { h: 33, src: require('../images/BI/biS1.png') };
    } else if (rname == 'Route New BrunsQuick 2 Shuttle') {
      box = { h: 33, src: require('../images/BI/biS2.png') };
    } else if (rname == 'Route RBHS') {
      box = { h: 48, src: require('../images/BI/biRBHS.png') };
    } else if (rname == 'Route REXB') {
      box = { h: 48, src: require('../images/BI/biREXB.png') };
    } else if (rname == 'Route REXL') {
      box = { h: 48, src: require('../images/BI/biREXL.png') };
    } else if (rname == 'Route Weekend 1' || rname == 'Weekend 1') {
      box = { h: 35, src: require('../images/BI/biW1.png') };
    } else if (rname == 'Route Weekend 2' || rname == 'Weekend 2') {
      box = { h: 35, src: require('../images/BI/biW2.png') };
    } else {
      box = { h: 23, src: require('../images/BI/biN.png') };
    }
    return <Image style={{ width: box.h, height: 23 }} source={box.src} />;
  }

  render() {
    return (
      <View style={styles.flexContainer}>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.imgContainer}>{this.renderRouteImg(this.props.rname)}</View>
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
};

export default RouteInStop;
