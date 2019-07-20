import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  FlatList,
  LayoutAnimation,
  StatusBar,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import BackButton from '../Components/BackButton';
import Loading from '../Components/Loading';
import MeetingItem from '../Components/MeetingItem';
import { getOneClass, addFavoriteClass, deleteFavoriteClass } from '../actions';

class SectionDetailScreen extends Component {
  _keyExtractor = (item, index) => item.day + item.startTime;

  state = {
    course: {},
    section: {},
    like:
      this.props.class_favorites.filter(
        item =>
          item.classId ==
          this.props.subjectNumber +
            '-' +
            this.props.courseNumber +
            '-' +
            this.props.sectionNumber +
            '-' +
            this.props.classSetting.semester,
      ).length > 0,
  };

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  componentWillMount() {
    if (this.props.classHere == 'no') {
      this.props.getOneClass(this.props.code, this.props.classSetting);
    } else {
      courseObj = this.props.class.find(obj => obj.courseNumber == this.props.courseNumber);
      sectionObj = courseObj.sections.find(obj => obj.key == this.props.sectionNumber);
      sectionObj.classId =
        this.props.subjectNumber +
        '-' +
        this.props.courseNumber +
        '-' +
        this.props.sectionNumber +
        '-' +
        this.props.classSetting.semester;
      sectionObj.className = courseObj.title;
      this.setState({ section: sectionObj });
      this.setState({ course: courseObj });
    }
  }

  render() {
    return (
      <SafeAreaView
        style={[
          styles.home,
          this.state.section.title.openStatus
            ? { backgroundColor: 'rgb(90,175,79)' }
            : { backgroundColor: 'rgb(237,69,69)' },
        ]}
      >
        <StatusBar barStyle="light-content" />
        <View
          style={[
            styles.headerContainer,
            this.state.section.title.openStatus
              ? { backgroundColor: 'rgb(90,175,79)' }
              : { backgroundColor: 'rgb(237,69,69)' },
          ]}
        >
          <BackButton text={'Sections'} clear={true} />
          <Text style={styles.headerTitle}>{this.state.course.title}</Text>
          <View style={styles.headerNote}>
            <View>
              <Text style={{ fontSize: 25, fontWeight: '500', color: 'white' }}>
                {this.props.sectionNumber || 'no data'}
              </Text>
              <Text style={{ fontSize: 13, color: 'white' }}>SECTION</Text>
            </View>
            <View>
              <Text style={{ fontSize: 25, fontWeight: '500', color: 'white' }}>
                {this.state.section.title.index || 'no data'}
              </Text>
              <Text style={{ fontSize: 13, color: 'white' }}>INDEX</Text>
            </View>
            <View>
              <Text style={{ fontSize: 25, fontWeight: '500', color: 'white' }}>
                {this.state.course.credits || 'no data'}
              </Text>
              <Text style={{ fontSize: 13, color: 'white' }}>CREDITS</Text>
            </View>
          </View>
        </View>
        <ScrollView
          style={{ paddingLeft: 16, paddingTop: 23, backgroundColor: 'rgb(255, 255, 255)' }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text style={styles.sectionTitle}>Schedule</Text>
            <TouchableOpacity
              onPress={() => {
                if (this.state.like) {
                  this.props.deleteFavoriteClass(this.state.section);
                } else {
                  this.props.addFavoriteClass(this.state.section);
                }
                this.setState({
                  like: !this.state.like,
                });
              }}
            >
              {this.state.like ? (
                <Image
                  style={styles.heartImage}
                  source={require('../images/Like/LikeFilled.png')}
                />
              ) : (
                <Image style={styles.heartImage} source={require('../images/Like/Like.png')} />
              )}
            </TouchableOpacity>
          </View>
          <FlatList
            keyExtractor={this._keyExtractor}
            data={this.state.section.data}
            renderItem={({ item, index }) => <MeetingItem item={item} />}
          />
          <View style={{ paddingRight: 16 }}>
            <Text style={styles.sectionTitle}>Instructors</Text>
            <Text style={styles.sectionText}>{this.state.section.title.instructors}</Text>
            <Text style={styles.sectionTitle}>Section Notes</Text>
            <Text style={styles.sectionText}>
              {this.state.section.title.sectionNotes || 'No Data'}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = {
  home: {
    flex: 1,
  },
  headerContainer: {
    paddingBottom: 20,
    flexDirection: 'column',
    backgroundColor: 'rgb(96,178,6)',
  },
  headerTitle: {
    color: 'white',
    fontWeight: '600',
    fontSize: 23,
    marginHorizontal: 19,
    marginTop: 12,
    textTransform: 'capitalize',
  },
  headerNote: {
    marginTop: 14,
    marginRight: 22,
    marginLeft: 28,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 5,
  },
  sectionText: {
    fontSize: 15,
    color: 'rgb(74,74,74)',
    marginTop: 6,
    marginBottom: 11,
  },
  heartImage: {
    width: 33,
    height: 29,
    marginRight: 21,
  },
};

const mapStateToProps = state => {
  return {
    class: state.class.class,
    classHere: state.class.class_data_here,
    classSetting: state.class.class_setting,
    class_favorites: state.favorite.class_favorites,
  };
};

export default connect(
  mapStateToProps,
  { getOneClass, addFavoriteClass, deleteFavoriteClass },
)(SectionDetailScreen);
