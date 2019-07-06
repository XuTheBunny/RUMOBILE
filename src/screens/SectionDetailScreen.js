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
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import ClearHeader from '../Components/ClearHeader';
import Loading from '../Components/Loading';
import MeetingItem from '../Components/MeetingItem';
import { getOneClass } from '../actions';

class SectionDetailScreen extends Component {
  _keyExtractor = (item, index) => item.courseNumber;

  state = {
    course: {},
    section: {},
    like: false,
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
      this.setState({ section: sectionObj });
      this.setState({ course: courseObj });
    }
  }

  render() {
    return (
      <View style={styles.home}>
        <StatusBar barStyle="light-content" />
        <View
          style={[
            styles.headerContainer,
            this.state.section.openStatus
              ? { backgroundColor: 'rgb(90,175,79)' }
              : { backgroundColor: 'rgb(237,69,69)' },
          ]}
        >
          <ClearHeader text={'Sections'} />
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
        <ScrollView style={{ marginLeft: 16 }}>
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
            data={this.state.section.data}
            renderItem={({ item, index }) => <MeetingItem item={item} />}
          />
          <Text style={styles.sectionTitle}>Instructors</Text>
          <Text style={styles.sectionText}>{this.state.section.title.instructors}</Text>
          <Text style={styles.sectionTitle}>Section Notes</Text>
          <Text style={styles.sectionText}>
            {this.state.section.title.sectionNotes || 'No Data'}
          </Text>
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
  headerContainer: {
    paddingTop: 15,
    paddingBottom: 11,
    marginBottom: 25,
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
  };
};

export default connect(
  mapStateToProps,
  { getOneClass },
)(SectionDetailScreen);