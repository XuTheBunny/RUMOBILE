import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  LayoutAnimation,
  SafeAreaView,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import BackButton from '../Components/BackButton';
import Loading from '../Components/Loading';
import { getOneClass } from '../actions';

class CoursesScreen extends Component {
  _keyExtractor = (item, index) => item.courseNumber;

  componentWillMount() {
    if (this.props.classHere == 'no') {
      this.props.getOneClass(this.props.code, this.props.classSetting);
    }
  }

  courseItem = item => {
    return (
      <TouchableOpacity
        onPress={() =>
          this.sections(this.props.courseName.split('(')[1].split(')')[0], item.courseNumber)
        }
      >
        <View style={styles.itemContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.itemTitle}>
              {item.courseNumber} : {item.title}
            </Text>
            <View style={styles.itemNoteContainer}>
              <Text
                style={[
                  styles.itemNote,
                  item.opens > 0 ? { color: 'rgb(96,178,6)' } : { color: 'rgb(255,46,59)' },
                ]}
              >
                {item.opens} open sections of {item.all}
              </Text>
              {item.credits != null && <Text style={styles.itemNote}>{item.credits} Credits</Text>}
            </View>
          </View>
          <EvilIcons name="chevron-right" size={30} color="rgb(138,138,143)" />
        </View>
      </TouchableOpacity>
    );
  };

  courseEmpty = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 55,
        }}
      >
        <Image
          style={{ height: 300 }}
          source={require('../images/Class/blankstate_nocourse.png')}
          resizeMode="contain"
        />
        <Text style={styles.emptyText}>This subject contains no courses.</Text>
      </View>
    );
  };

  sections(subjectNumber, courseNumber) {
    Actions.sections_screen({ subjectNumber, courseNumber });
  }

  render() {
    return (
      <SafeAreaView style={styles.home}>
        <BackButton text={'Subjects'} />
        <Text style={styles.headerText}>{this.props.courseName}</Text>
        {this.props.classHere == 'here' ? (
          <FlatList
            data={this.props.class}
            keyExtractor={this._keyExtractor}
            renderItem={({ item, index }) => this.courseItem(item)}
            ListEmptyComponent={this.courseEmpty()}
          />
        ) : (
          <Loading />
        )}
      </SafeAreaView>
    );
  }
}

const styles = {
  home: {
    flex: 1,
    backgroundColor: 'rgb(255, 255, 255)',
  },
  headerText: {
    fontWeight: '600',
    fontSize: 22,
    textTransform: 'capitalize',
    marginVertical: 10,
    marginHorizontal: 19,
  },
  itemContainer: {
    marginLeft: 16,
    paddingRight: 16,
    paddingVertical: 11,
    borderBottomColor: 'rgb(235,235,235)',
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    fontSize: 13,
    color: 'rgb(74,74,74)',
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
    class: state.class.class,
    classHere: state.class.class_data_here,
    classSetting: state.class.class_setting,
  };
};

export default connect(
  mapStateToProps,
  { getOneClass },
)(CoursesScreen);
