import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { deleteFavoriteClass } from '../actions';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  SectionList,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import MeetingItem from '../Components/MeetingItem';

class FavClassScreen extends Component {
  backUp() {
    Actions.pop();
  }

  renderHeader = ({ title, data }) => {
    return (
      <>
        <View
          style={
            data.length == 0 && title == 'Independent Study'
              ? { display: 'none' }
              : styles.sectionHeaderContainer
          }
        >
          <Image
            style={title == this.props.today ? styles.sectionHeaderImage : { display: 'none' }}
            source={require('../images/Today/Today-flag.png')}
          />
          <Text
            style={[styles.sectionHeader, title == this.props.today ? { paddingRight: 83 } : {}]}
          >
            {title}
          </Text>
        </View>
        <View
          style={
            data.length == 0 && title != 'Independent Study'
              ? {
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'white',
                }
              : { display: 'none' }
          }
        >
          <Text style={styles.sectionEmpty}>No classes</Text>
        </View>
      </>
    );
  };

  renderItem = (item, index) => {
    return (
      <MeetingItem
        key={item.day + item.startTime + index.toString()}
        item={item}
        className={item.className}
        addStyle={{ marginLeft: 30 }}
      />
    );
  };

  render() {
    return (
      <View style={styles.home}>
        <StatusBar barStyle="light-content" />
        <View style={styles.cardContainer}>
          <View style={styles.headerContainer}>
            <View style={{ height: 64, flexDirection: 'column', justifyContent: 'space-between' }}>
              <Text style={styles.subHeader}>THIS WEEK</Text>
              <Text style={styles.cardHeader}>My Schedule</Text>
            </View>
            <View
              style={{
                height: 64,
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <TouchableOpacity onPress={() => this.backUp()}>
                <Icon name="closecircle" size={35} color="rgb(151, 151, 151)" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.editButton}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
          <SectionList
            stickySectionHeadersDisabled
            renderItem={({ item, index, section }) => this.renderItem(item, index)}
            renderSectionHeader={({ section: { title, data } }) =>
              this.renderHeader({ title, data })
            }
            sections={this.props.classList}
            keyExtractor={(item, index) => item + index}
          />
        </View>
      </View>
    );
  }
}

const styles = {
  home: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
  },
  cardContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    marginTop: 45,
    paddingBottom: 40,
    marginHorizontal: 5,
  },
  headerContainer: {
    marginTop: 18,
    marginBottom: 8,
    marginHorizontal: 23,
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
  editButton: {
    fontSize: 14,
    color: 'rgb(237, 69, 69)',
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  sectionHeaderImage: {
    width: 83,
    resizeMode: 'contain',
  },
  sectionHeader: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 8,
  },
  sectionEmpty: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '500',
    color: 'rgb(142, 142, 147)',
  },
};

const mapStateToProps = state => {
  return {
    classSetting: state.class.class_setting,
  };
};

export default connect(
  mapStateToProps,
  { deleteFavoriteClass },
)(FavClassScreen);
