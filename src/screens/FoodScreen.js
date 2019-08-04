import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  AppState,
  SafeAreaView,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Header from '../Components/Header';
import NotificationBar from '../Components/NotificationBar';
import { foodPull } from '../actions';

class FoodScreen extends Component {
  state = { appState: AppState.currentState };
  componentDidMount() {
    this.props.foodPull('https://rumobile.rutgers.edu/1/rutgers-dining.txt');
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this.props.foodPull('https://rumobile.rutgers.edu/1/rutgers-dining.txt');
    }
    this.setState({ appState: nextAppState });
  };

  openStatus(name) {
    var open = false;
    for (var i = 0; i < this.props.brower.meals.length; i++) {
      if (this.props[name].meals[i].meal_avail == true) {
        open = true;
      }
    }
    return (
      <View style={styles.cardStatus}>
        <Text
          style={{
            fontSize: 13,
            color: open ? 'rgb(146,207,72)' : 'rgb(237, 69, 69)',
            fontWeight: '600',
          }}
        >
          {open ? 'OPEN' : 'CLOSED'}
        </Text>
      </View>
    );
  }

  foodList(d) {
    Actions.food_list({ data: d });
  }

  renderFood() {
    if (!this.props.internet) {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 30,
          }}
        >
          <Image
            style={{ height: 300 }}
            source={require('../images/Food/blankstate_nofood.png')}
            resizeMode="contain"
          />
          <Text style={styles.emptyText}>There is currently no food data avaliable.</Text>
        </View>
      );
    } else {
      if (this.props.trying_food_pull == 'pulled') {
        return (
          <View style={styles.cardGrid}>
            <View style={styles.cardRow}>
              <TouchableOpacity onPress={() => this.foodList(this.props.brower)}>
                <ImageBackground
                  source={require('../images/Food/browerImg.png')}
                  style={styles.cardBody}
                >
                  <Text style={styles.cardTitle}>Brower</Text>
                  {this.openStatus('brower')}
                </ImageBackground>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.foodList(this.props.busch)}>
                <ImageBackground
                  source={require('../images/Food/buschImg.png')}
                  style={styles.cardBody}
                >
                  <Text style={styles.cardTitle}>Busch</Text>
                  {this.openStatus('busch')}
                </ImageBackground>
              </TouchableOpacity>
            </View>

            <View style={styles.cardRow}>
              <TouchableOpacity onPress={() => this.foodList(this.props.livingston)}>
                <ImageBackground
                  source={require('../images/Food/livingstonImg.png')}
                  style={styles.cardBody}
                >
                  <Text style={styles.cardTitle}>Livingston</Text>
                  {this.openStatus('livingston')}
                </ImageBackground>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.foodList(this.props.neilson)}>
                <ImageBackground
                  source={require('../images/Food/neilsonImg.png')}
                  style={styles.cardBody}
                >
                  <Text style={styles.cardTitle}>Neilson</Text>
                  {this.openStatus('neilson')}
                </ImageBackground>
              </TouchableOpacity>
            </View>
          </View>
        );
      } else {
        return (
          <View style={{ marginTop: 30 }}>
            <Text style={styles.emptyText}>Pulling, Please Wait . . .</Text>
          </View>
        );
      }
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.home}>
        {!this.props.internet && (
          <NotificationBar text="There is no Internet connection" color="rgb(237,69,69)" />
        )}
        <Header text={'Food'} />
        <View style={styles.bodyGrid}>
          <Text style={styles.baseText}>PLACES TO EAT</Text>
          <Text style={styles.titleText}>Dining Halls</Text>
          <Text style={styles.subText}>Food is essential to life</Text>
          {this.renderFood()}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = {
  home: {
    flex: 1,
    backgroundColor: 'rgb(255, 255, 255)',
  },
  titleBar: {
    marginLeft: 15,
    marginRight: 15,
    height: 2,
    backgroundColor: 'rgb(231, 231, 231)',
  },
  baseText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgb(236, 70, 70)',
  },
  bodyGrid: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 11,
  },
  titleText: {
    fontSize: 22,
  },
  subText: {
    fontSize: 22,
    color: 'rgb(138, 138, 143)',
  },
  cardGrid: {
    aspectRatio: 1,
    flexDirection: 'column',
  },
  cardRow: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    alignContent: 'stretch',
  },
  cardBody: {
    flex: 2,
    alignSelf: 'stretch',
    flexDirection: 'column',
    justifyContent: 'space-between',
    aspectRatio: 1,
    margin: 5,
  },
  cardTitle: {
    fontSize: 22,
    textAlign: 'left',
    paddingLeft: 12,
    paddingTop: 10,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0)',
    color: 'white',
    textTransform: 'capitalize',
  },
  cardStatus: {
    marginRight: 8,
    marginBottom: 8,
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 4,
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
    trying_food_pull: state.food.trying_food_pull,
    brower: state.food.brower,
    busch: state.food.busch,
    livingston: state.food.livingston,
    neilson: state.food.neilson,
    internet: state.home.internet,
  };
};

export default connect(
  mapStateToProps,
  { foodPull },
)(FoodScreen);
