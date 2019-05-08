import React, { Component } from 'react';
import { FIREBASE_USER, FIREBASE_PASSWORD } from '../../env.json';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import Header from '../Components/Header';
import HomeBanner from '../Components/HomeBanner';
import { loginUser, pullBanner, timeAction, pullDate, getBusStops } from '../actions';

class TodayScreen extends Component {
  state = {
    busEmpty: true,
    classEmpty: true,
  };

  componentWillMount() {
    //Handles the Date Text at the top of the Header
    this.props.pullDate(new Date());

    //Logins In firebase Admin which has read-only access to the RTD
    this.props.loginUser(FIREBASE_USER, FIREBASE_PASSWORD);
  }

  componentDidMount() {
    //At Every Second, the method below Time() is run. Use this to monitor refreshes
    //this.timer = setInterval(()=> this.Time(), 1000);
    //This pulls the FireBase Header Data
    this.props.pullBanner();
  }

  Time() {
    var x = new Date();
    this.props.timeAction(x);
  }

  onBusPress() {
    this.props.getBusStops('clean');
    Actions.bus_screen();
    this.props.getBusStops(this.props.campus);
  }

  render() {
    return (
      <View style={styles.home}>
        <Header text={'Today'} dateText={this.props.dateText} showProfilePic={true} />
        <HomeBanner message={this.props.banner} />
        <ScrollView>
          {this.state.classEmpty && (
            <View style={styles.cardContainer}>
              <View style={styles.cardTitleContainer}>
                <View style={{ flexDirection: 'row' }}>
                  <Image style={styles.cardIcon} source={require('../images/Today/Class.png')} />
                  <Text style={styles.cardTitle}>Classes</Text>
                </View>
                <TouchableOpacity>
                  <Text style={styles.cardTitle}>Edit</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.cardBodyContainer, { marginVertical: 20 }]}>
                <Text style={styles.emptyText}>Quickly access your schedule of classes here.</Text>
                <TouchableOpacity>
                  <Text style={styles.emptyButton}>Add Classes</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {this.state.busEmpty && (
            <View style={styles.cardContainer}>
              <View style={styles.cardTitleContainer}>
                <View style={{ flexDirection: 'row' }}>
                  <Image style={styles.cardIcon} source={require('../images/Today/Bus.jpg')} />
                  <Text style={styles.cardTitle}>Buses</Text>
                </View>
                <TouchableOpacity>
                  <Text style={styles.cardTitle}>Edit</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.cardBodyContainer, { marginBottom: 20 }]}>
                <Image style={styles.emptyImage} source={require('../images/Today/noBus.png')} />
                <Text style={styles.emptyText}>Quickly access your favorites buses here.</Text>
                <TouchableOpacity onPress={this.onBusPress.bind(this)}>
                  <Text style={styles.emptyButton}>Add Buses</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
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
  cardContainer: {
    marginHorizontal: 15,
    marginVertical: 10,
    borderColor: 'rgb(233, 233, 233)',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: 'white',
    shadowOffset: { width: 3, height: 5 },
    shadowColor: 'rgb(233, 233, 233)',
    shadowOpacity: 0.8,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderBottomColor: 'rgb(233, 233, 233)',
    borderBottomWidth: 1,
  },
  cardBodyContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  cardIcon: {
    height: 15,
    width: 15,
  },
  cardTitle: {
    fontSize: 14,
    color: 'rgb(237, 69, 69)',
    paddingLeft: 6,
  },
  emptyText: {
    fontSize: 15,
    color: 'rgb(142, 142, 147)',
    width: '100%',
    textAlign: 'center',
  },
  emptyImage: {
    height: 230,
    width: 230,
  },
  emptyButton: {
    fontSize: 15,
    borderColor: 'rgb(142, 142, 147)',
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 3,
    paddingHorizontal: 12,
    marginTop: 10,
    color: 'rgb(142, 142, 147)',
  },
};

const mapStateToProps = state => {
  return {
    login: state.home.login,
    banner: state.home.banner,
    dateText: state.home.dateText,
  };
};

export default connect(
  mapStateToProps,
  { loginUser, pullBanner, timeAction, pullDate, getBusStops },
)(TodayScreen);
