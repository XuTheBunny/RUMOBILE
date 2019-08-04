import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  FlatList,
  SectionList,
  SafeAreaView,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import BackButton from '../Components/BackButton';
import Loading from '../Components/Loading';
import NotificationBar from '../Components/NotificationBar';
import { getOneClass } from '../actions';

class SectionsScreen extends Component {
  state = {
    course: {},
  };

  componentDidMount() {
    if (this.props.classHere == 'here') {
      this.setState({
        course: this.props.class.find(obj => obj.courseNumber == this.props.courseNumber),
      });
    } else {
      this.props.getOneClass(this.props.code, this.props.classSetting);
    }
  }

  sectionTitle = title => {
    return (
      <View style={styles.itemRow}>
        <View
          style={[
            { borderRadius: 4 },
            title.openStatus
              ? { backgroundColor: 'rgb(90,175,79)' }
              : { backgroundColor: 'rgb(237,69,69)' },
          ]}
        >
          <Text style={styles.codeIcon}>{title.number}</Text>
        </View>
        <Text style={styles.name}>{title.instructors}</Text>
      </View>
    );
  };

  sectionItem = item => {
    return (
      <View
        style={[styles.itemRow, { marginTop: 10 }]}
        key={item.place + item.day + item.startTime}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
          <View style={{ width: 105 }}>
            <Text style={styles.itemNote}>{item.day}</Text>
          </View>
          {item.startTime.length > 0 && (
            <Text style={{ fontSize: 15, color: 'black', fontWeight: '500' }}>
              {item.startTime}-{item.endTime + item.pmCode.trim()}
            </Text>
          )}
        </View>
        <Text style={styles.itemNote}>{item.place}</Text>
      </View>
    );
  };

  sectionDetail(subjectNumber, courseNumber, sectionNumber) {
    Actions.section_detail_screen({ subjectNumber, courseNumber, sectionNumber });
  }

  sectionList = item => {
    return (
      <TouchableOpacity
        onPress={() =>
          this.sectionDetail(this.props.subjectNumber, this.props.courseNumber, item.title.number)
        }
      >
        <View style={styles.itemBorder}>
          {this.sectionTitle(item.title)}
          {item.data.map(i => this.sectionItem(i))}
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={styles.home}>
        {!this.props.internet && (
          <NotificationBar text="There is no Internet connection." color="rgb(237,69,69)" />
        )}
        <ImageBackground
          imageStyle={{ opacity: 0.7 }}
          style={styles.headerContainer}
          source={require('../images/Class/ClassBackground.jpeg')}
        >
          <SafeAreaView>
            <BackButton text={'Courses'} clear={true} />
            <Text style={styles.headerTitle}>{this.state.course.title}</Text>
            <View style={styles.headerNote}>
              <View style={styles.opens}>
                <Text
                  style={[
                    { fontSize: 17 },
                    this.state.course.opens > 0
                      ? { color: 'rgb(96,178,6)' }
                      : { color: 'rgb(255,46,59)' },
                  ]}
                >
                  {this.state.course.opens} open sections of {this.state.course.all}
                </Text>
              </View>
              {this.state.course.credits != null && (
                <Text style={{ fontSize: 13, color: 'white', paddingBottom: 11 }}>
                  <Text style={{ fontSize: 35, fontWeight: '500' }}>
                    {this.state.course.credits}
                  </Text>
                  <Text style={styles.stopDistanceText}> credits</Text>
                </Text>
              )}
            </View>
          </SafeAreaView>
        </ImageBackground>
        <FlatList
          data={this.state.course.sections}
          renderItem={({ item, index }) => this.sectionList(item)}
          ListHeaderComponent={() => <View style={{ height: 10 }} />}
        />
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
    paddingBottom: 19,
    flexDirection: 'column',
    backgroundColor: 'black',
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
    marginTop: 7,
    marginRight: 19,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  opens: {
    paddingRight: 19,
    paddingLeft: 12,
    paddingTop: 18,
    paddingBottom: 11,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  itemContainer: {
    marginTop: 14,
    marginBottom: 12,
    borderBottomColor: 'rgb(235,235,235)',
    borderBottomWidth: 0.5,
  },
  itemBorder: {
    flex: 1,
    paddingTop: 12,
    paddingBottom: 15,
    marginRight: 16,
    borderBottomColor: 'rgb(235,235,235)',
    borderBottomWidth: 0.5,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 16,
    marginRight: 14,
  },
  codeIcon: {
    color: 'white',
    fontSize: 20,
    paddingHorizontal: 7,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    maxWidth: 300,
    paddingLeft: 2,
  },
  itemTitle: {
    fontSize: 17,
    maxWidth: 300,
    textTransform: 'capitalize',
  },
  itemNoteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    fontSize: 13,
    marginTop: 6,
    marginRight: 6,
  },
  itemNote: {
    fontSize: 15,
    color: 'rgb(74,74,74)',
  },
};

const mapStateToProps = state => {
  return {
    class: state.class.class,
    classHere: state.class.class_data_here,
    classSetting: state.class.class_setting,
    internet: state.home.internet,
  };
};

export default connect(
  mapStateToProps,
  { getOneClass },
)(SectionsScreen);
