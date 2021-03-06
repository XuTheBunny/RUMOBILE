import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { setClass, getAllClass } from '../actions';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SectionList,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import NotificationBar from '../Components/NotificationBar';

class ClassSettingScreen extends Component {
  state = { semester: [], campus: [], level: [] };

  classSettingObj = {
    semester: [{ key: '72019', value: 'Summer 2019' }, { key: '92019', value: 'Fall 2019' }],
    level: [{ key: 'U', value: 'Undergraduate' }, { key: 'G', value: 'Graduate' }],
    campus: [
      { key: 'NB', value: 'New Brunswick' },
      { key: 'NK', value: 'Newark' },
      { key: 'CM', value: 'Camden' },
      { key: 'B', value: 'Burlington County Community College - Mt Laurel' },
      { key: 'CC', value: 'Camden County College - Blackwood Campus' },
      { key: 'H', value: 'County College of Morris' },
      { key: 'CU', value: 'Cumberland County College' },
      { key: 'MC', value: 'Denville - RU-Morris' },
      { key: 'WM', value: 'Freehold WMHEC - RU-BCC' },
      { key: 'L', value: 'Lincroft - RU-BCC' },
      { key: 'AC', value: 'Mays Landing - RU-ACCC' },
      { key: 'J', value: 'McGuire-Dix-Lakehurst RU-JBMDL' },
      { key: 'D', value: 'Mercer County Community College' },
      { key: 'RV', value: 'North Branch - RU-RVCC' },
    ],
  };

  storeClassSettingData = async () => {
    try {
      await AsyncStorage.setItem('class_setting', JSON.stringify(this.state));
    } catch (e) {
      console.log(e);
    }
  };

  backUp() {
    this.props.getAllClass('clean', null);
    this.props.setClass(this.state);
    Actions.pop();
    this.props.getAllClass(null, this.state);
    this.storeClassSettingData();
  }

  componentDidMount() {
    this.setState({
      semester: this.props.classSetting.semester,
      campus: this.props.classSetting.campus,
      level: this.props.classSetting.level,
    });
  }

  render() {
    return (
      <View style={styles.home}>
        <SafeAreaView>
          {this.state.campus.length == 0 && (
            <NotificationBar text="Choose at least one campus." color="rgb(237,69,69)" />
          )}
          {this.state.level.length == 0 && (
            <NotificationBar text="Choose at least one level." color="rgb(237,69,69)" />
          )}
          {!this.props.internet && (
            <NotificationBar text="There is no Internet connection" color="rgb(237,69,69)" />
          )}
          <View style={styles.headerContainer}>
            <View style={{ height: 64, flexDirection: 'column', justifyContent: 'space-between' }}>
              <Text style={styles.subHeader}>OPTIONS</Text>
              <Text style={styles.cardHeader}>Classes</Text>
            </View>
            {this.state.campus.length > 0 && this.state.level.length > 0 && (
              <TouchableOpacity onPress={() => this.backUp()}>
                <View
                  style={{
                    height: 64,
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginRight: 23,
                  }}
                >
                  <View style={styles.closeButton}>
                    <Image
                      style={styles.iconStyle}
                      source={require('../images/Today/actionClose.png')}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
        <ScrollView style={{ marginBottom: 20 }}>
          <View style={styles.cardContainer}>
            <View style={styles.cardTitleContainer}>
              <Image style={styles.cardIcon} source={require('../images/More/semester.png')} />
              <Text style={styles.cardTitle}>Semester</Text>
            </View>
            {this.classSettingObj.semester.map(obj => (
              <TouchableOpacity
                key={obj.key}
                onPress={() => {
                  if (!this.state.semester.includes(obj.key)) {
                    this.setState({ semester: [obj.key] });
                  }
                }}
              >
                <View style={styles.listItem}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 2 }}>
                    <Text style={{ fontSize: 24, color: 'rgb(74, 74, 74)' }}>{`\u2022`}</Text>
                    <Text style={{ fontSize: 17, marginLeft: 11, flex: 2 }}>{obj.value}</Text>
                  </View>
                  {this.state.semester.includes(obj.key) && (
                    <Icon name="check" size={13} color="rgb(237, 69, 69)" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.cardContainer}>
            <View style={styles.cardTitleContainer}>
              <Image style={styles.cardIcon} source={require('../images/More/level.png')} />
              <Text style={styles.cardTitle}>Level</Text>
            </View>
            {this.classSettingObj.level.map(obj => (
              <TouchableOpacity
                key={obj.key}
                onPress={() => {
                  if (this.state.level.includes(obj.key)) {
                    this.setState({
                      level: this.state.level.filter(item => obj.key !== item),
                    });
                  } else {
                    if (this.state.level.length > 0) {
                      this.setState({ level: [...this.state.level, obj.key] });
                    } else {
                      this.setState({ level: [obj.key] });
                    }
                  }
                }}
              >
                <View style={styles.listItem}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 24, color: 'rgb(74, 74, 74)' }}>{`\u2022`}</Text>
                    <Text style={{ fontSize: 17, marginLeft: 11, maxWidth: 240 }}>{obj.value}</Text>
                  </View>
                  {this.state.level.includes(obj.key) && (
                    <Icon name="check" size={13} color="rgb(237, 69, 69)" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.cardContainer}>
            <View style={styles.cardTitleContainer}>
              <Image style={styles.cardIcon} source={require('../images/More/campus.png')} />
              <Text style={styles.cardTitle}>Campus</Text>
            </View>
            {this.classSettingObj.campus.map(obj => (
              <TouchableOpacity
                key={obj.key}
                onPress={() => {
                  if (this.state.campus.includes(obj.key)) {
                    this.setState({
                      campus: this.state.campus.filter(item => obj.key !== item),
                    });
                  } else {
                    if (this.state.campus.length > 0) {
                      this.setState({ campus: [...this.state.campus, obj.key] });
                    } else {
                      this.setState({ campus: [obj.key] });
                    }
                  }
                }}
              >
                <View style={styles.listItem}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      flex: 2,
                    }}
                  >
                    <Text style={{ fontSize: 24, color: 'rgb(74, 74, 74)' }}>{`\u2022`}</Text>
                    <Text style={{ fontSize: 17, marginLeft: 11, flex: 2 }}>{obj.value}</Text>
                  </View>
                  <View style={{ width: 30, flexDirection: 'row', justifyContent: 'flex-end' }}>
                    {this.state.campus.includes(obj.key) && (
                      <Icon name="check" size={13} color="rgb(237, 69, 69)" />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = {
  home: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerContainer: {
    marginTop: 18,
    marginBottom: 8,
    marginLeft: 23,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardHeader: {
    fontSize: 34,
    fontWeight: '700',
  },
  subHeader: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgb(142, 142, 147)',
  },
  closeButton: {
    height: 28,
    width: 28,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderRadius: 14,
    shadowColor: 'rgb(233, 233, 233)',
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    backgroundColor: 'white',
  },
  iconStyle: {
    height: 13,
    width: 13,
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
    paddingHorizontal: 8,
    paddingVertical: 6,
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
    color: 'rgb(74, 74, 74)',
    paddingLeft: 6,
    textTransform: 'capitalize',
  },
  listItem: {
    flex: 2,
    paddingLeft: 23,
    paddingRight: 16,
    paddingVertical: 11,
    borderTopColor: 'rgb(233, 233, 233)',
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
};

const mapStateToProps = state => {
  return {
    classSetting: state.class.class_setting,
    internet: state.home.internet,
  };
};

export default connect(
  mapStateToProps,
  { setClass, getAllClass },
)(ClassSettingScreen);
