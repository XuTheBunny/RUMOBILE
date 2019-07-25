import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { SwipeRow } from 'react-native-swipe-list-view';
import { deleteFavoriteClass } from '../actions';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  SectionList,
  SafeAreaView,
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
            source={require('../images/Today/Today.png')}
          />
          <Text
            style={[styles.sectionHeader, title == this.props.today ? { paddingRight: 66 } : {}]}
          >
            {title}
          </Text>
        </View>
      </>
    );
  };

  renderFooter = ({ title, data }) => {
    return (
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
        <Text style={styles.sectionEmpty}>NO CLASSES</Text>
      </View>
    );
  };

  renderItem = (item, index) => {
    return (
      <SwipeRow
        key={item.day + item.startTime + index.toString()}
        disableRightSwipe
        rightOpenValue={-75}
      >
        <View style={styles.rowBack}>
          <TouchableOpacity
            onPress={() => {
              sectionObj = this.props.class_favorites.find(obj => obj.classId == item.classId);
              this.props.deleteFavoriteClass(sectionObj);
              this.storeFavClassData(sectionObj);
            }}
          >
            <Text style={{ color: 'white', padding: 15 }}>Delete</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.rowFront}>
          <MeetingItem item={item} className={item.className} addStyle={{ marginLeft: 30 }} />
        </View>
      </SwipeRow>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.home}>
        <StatusBar barStyle="dark-content" />
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
              <View style={styles.closeButton}>
                <Image
                  style={styles.iconStyle}
                  source={require('../images/Today/actionClose.png')}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
        <SectionList
          stickySectionHeadersDisabled
          renderItem={({ item, index, section }) => this.renderItem(item, index)}
          renderSectionHeader={({ section: { title, data } }) => this.renderHeader({ title, data })}
          renderSectionFooter={({ section: { title, data } }) => this.renderFooter({ title, data })}
          sections={this.props.classList}
          keyExtractor={(item, index) => item + index}
        />
      </SafeAreaView>
    );
  }
}

const styles = {
  home: {
    flex: 1,
    backgroundColor: 'white',
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
    paddingVertical: 8,
  },
  sectionHeaderImage: {
    width: 66,
    height: 25,
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
  iconStyle: {
    height: 13,
    width: 13,
  },
  closeButton: {
    height: 28,
    width: 28,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderRadius: 14,
    shadowColor: 'rgb(220, 220, 220)',
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    backgroundColor: 'white',
  },
  rowFront: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  rowBack: {
    flex: 1,
    backgroundColor: 'rgb(237, 69, 69)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
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
