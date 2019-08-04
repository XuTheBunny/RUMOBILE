import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { SwipeRow } from 'react-native-swipe-list-view';
import AsyncStorage from '@react-native-community/async-storage';
import { deleteFavoriteClass } from '../actions';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SectionList,
  SafeAreaView,
  LayoutAnimation,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MeetingItem from '../Components/MeetingItem';
import NotificationBar from '../Components/NotificationBar';

class FavClassScreen extends Component {
  state = {
    editing: 'done',
    swiped: [],
  };

  backUp() {
    Actions.pop();
  }

  formClass() {
    classList = [
      { title: 'Independent Study', data: [] },
      { title: 'Monday', data: [] },
      { title: 'Tuesday', data: [] },
      { title: 'Wednesday', data: [] },
      { title: 'Thursday', data: [] },
      { title: 'Friday', data: [] },
      { title: 'Saturday', data: [] },
      { title: 'Sunday', data: [] },
    ];
    this.props.class_favorites.forEach(function(c) {
      c.data.forEach(function(d) {
        d.className = c.className;
        if (d.w == 'A') {
          d.classId = c.classId;
          classList.find(obj => obj.title == 'Independent Study').data.push(d);
        } else {
          d.classId = c.classId;
          classList.find(obj => obj.title == d.day).data.push(d);
        }
      });
    });
    classList.forEach(function(c) {
      if (c.data.length > 0) {
        c.data.forEach(function(item) {
          if (
            item.pmCode == ' PM' &&
            parseInt(item.startTime.split(':')[0]) < parseInt(item.endTime.split(':')[0])
          ) {
            item.hour =
              (parseInt(item.startTime.split(':')[0]) + 12).toString() +
              ':' +
              item.startTime.split(':')[1];
          } else {
            if (item.startTime.length < 5) {
              item.hour = '0' + item.startTime;
            } else {
              item.hour = item.startTime;
            }
          }
        });
        c.data.sort((a, b) => (a.hour > b.hour ? 1 : b.hour > a.hour ? -1 : 0));
      }
    });
    return classList;
  }

  storeFavClassData = async classObj => {
    var favClassArray = [];
    favClassArray = this.props.class_favorites.filter(item => classObj.classId !== item.classId);
    try {
      await AsyncStorage.setItem('class_favorites', JSON.stringify({ classFav: favClassArray }));
    } catch (e) {
      console.log(e);
    }
  };

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
            style={
              title.toLowerCase() == this.props.today
                ? styles.sectionHeaderImage
                : { display: 'none' }
            }
            source={require('../images/Today/Today.png')}
          />
          <Text
            style={[
              styles.sectionHeader,
              title.toLowerCase() == this.props.today ? { paddingRight: 66 } : {},
            ]}
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
        key={item.day + item.startTime + item.classId}
        disableRightSwipe
        disableLeftSwipe={this.state.editing == 'edit'}
        rightOpenValue={-75}
        onRowDidOpen={() => {
          const id = item.classId + item.day + item.startTime;
          var openedList = [...this.state.swiped, id];
          this.setState({
            swiped: openedList,
          });
        }}
        onRowDidClose={() => {
          const id = item.classId + item.day + item.startTime;
          var openedList = this.state.swiped.filter(i => id !== i);
          this.setState({
            swiped: openedList,
          });
        }}
      >
        <View style={styles.rowBack}>
          <TouchableOpacity
            onPress={() => {
              sectionObj = this.props.class_favorites.find(obj => obj.classId == item.classId);
              this.props.deleteFavoriteClass(sectionObj);
              this.storeFavClassData(sectionObj);
              var openedList = this.state.swiped.filter(i => !i.startsWith(item.classId));
              this.setState({
                swiped: openedList,
              });
            }}
          >
            <Text style={{ color: 'white', padding: 15 }}>Delete</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.rowFront}>
          {this.state.editing == 'edit' && (
            <TouchableOpacity
              onPress={() => {
                sectionObj = this.props.class_favorites.find(obj => obj.classId == item.classId);
                this.props.deleteFavoriteClass(sectionObj);
                this.storeFavClassData(sectionObj);
              }}
            >
              <View
                style={{
                  backgroundColor: 'white',
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingLeft: 20,
                }}
              >
                <Icon name="ios-remove-circle" size={22} color="rgb(237, 69, 69)" />
              </View>
            </TouchableOpacity>
          )}
          <MeetingItem item={item} className={item.className} addStyle={{ marginLeft: 30 }} />
        </View>
      </SwipeRow>
    );
  };

  render() {
    return (
      <View style={styles.home}>
        <SafeAreaView>
          {!this.props.internet && (
            <NotificationBar text="There is no Internet connection" color="rgb(237,69,69)" />
          )}
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
              {this.state.swiped.length == 0 && (
                <TouchableOpacity
                  onPress={() => {
                    LayoutAnimation.easeInEaseOut();
                    if (this.state.editing == 'done') {
                      this.setState({ editing: 'edit' });
                    } else {
                      this.setState({ editing: 'done' });
                    }
                  }}
                >
                  <Text style={styles.editButton}>
                    {this.state.editing == 'done' ? 'Edit' : 'Done'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </SafeAreaView>
        {this.props.classList.length > 0 ? (
          <SectionList
            style={{ marginBottom: 20 }}
            stickySectionHeadersDisabled
            renderItem={({ item, index, section }) => this.renderItem(item, index)}
            renderSectionHeader={({ section: { title, data } }) =>
              this.renderHeader({ title, data })
            }
            renderSectionFooter={({ section: { title, data } }) =>
              this.renderFooter({ title, data })
            }
            sections={this.formClass()}
            keyExtractor={(item, index) => item + index}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Image
              style={styles.emptyImage}
              source={require('../images/Class/blankstate_nocourse.png')}
            />
            <Text style={styles.emptyText}>Quickly access your schedule of classes here</Text>
          </View>
        )}
      </View>
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
    width: 44,
    color: 'rgb(237, 69, 69)',
    fontSize: 17,
    textAlign: 'center',
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
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 8,
    textTransform: 'uppercase',
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
  emptyContainer: {
    marginTop: 70,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyImage: {
    height: 230,
    width: 230,
  },
  emptyText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '500',
    color: 'rgb(142, 142, 147)',
  },
};

const mapStateToProps = state => {
  return {
    class_favorites: state.favorite.class_favorites,
    internet: state.home.internet,
  };
};

export default connect(
  mapStateToProps,
  { deleteFavoriteClass },
)(FavClassScreen);
