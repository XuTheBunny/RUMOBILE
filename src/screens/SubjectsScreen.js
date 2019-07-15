import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SectionList,
  LayoutAnimation,
  SafeAreaView,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import BackButton from '../Components/BackButton';
import Loading from '../Components/Loading';
import { getAllClass, getOneClass } from '../actions';

class SubjectsScreen extends Component {
  state = {
    search: false,
    sections: [],
  };

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  componentWillMount() {
    if (this.props.classList.legnth > 0) {
      this.setState({ sections: this.props.classList });
    } else {
      this.props.getAllClass(null, this.props.classSetting);
    }
  }

  renderHeader = ({ title, data }) => {
    return (
      <Text style={[styles.sectionHeader, data.length == 0 ? { display: 'none' } : {}]}>
        {title}
      </Text>
    );
  };

  renderItem = (item, index) => {
    return (
      <TouchableOpacity onPress={() => this.courses(item)}>
        <View style={styles.sectionItem}>
          <Text key={index} style={{ fontSize: 17, maxWidth: 300, textTransform: 'capitalize' }}>
            {item}
          </Text>
          <EvilIcons name="chevron-right" size={30} color="rgb(138,138,143)" />
        </View>
      </TouchableOpacity>
    );
  };

  courses(item) {
    const code = item.substring(item.indexOf('(') + 1, item.indexOf(')'));
    this.props.getOneClass(code, this.props.classSetting);
    Actions.courses_screen({ code, courseName: item });
  }

  searchUpdated = text => {
    let matchedItemsArray = [];
    if (text === '') {
      this.setState({ search: false, sections: this.props.classList });
    } else {
      this.props.classList.map(item => {
        const filtered = item.data.filter(word => word.toUpperCase().includes(text.toUpperCase()));
        matchedItemsArray.push({ title: item.title, data: filtered });
      });
      this.setState({ search: true, sections: matchedItemsArray });
      console.log(this.state);
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.home}>
        <View style={styles.topButtonContainer}>
          <BackButton text={'More'} />
          <TouchableOpacity>
            <Text style={styles.editButton}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Subjects</Text>
          <Text style={styles.headerNote}>FALL 2019 NB U</Text>
        </View>
        <View style={styles.searchBar}>
          <EvilIcons name="search" size={20} color="rgb(138,138,143)" />
          <TextInput
            onChangeText={text => {
              this.searchUpdated(text);
            }}
            placeholder="Search"
            clearButtonMode="while-editing"
            inlineImageLeft="search_icon"
            style={{ fontSize: 17, flex: 1, marginLeft: 7 }}
          />
        </View>
        {this.props.classListHere == 'here' ? (
          <SectionList
            stickySectionHeadersEnabled
            renderItem={({ item, index, section }) => this.renderItem(item, index)}
            renderSectionHeader={({ section: { title, data } }) =>
              this.renderHeader({ title, data })
            }
            sections={this.state.search ? this.state.sections : this.props.classList}
            keyExtractor={(item, index) => item + index}
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
  topButtonContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  editButton: {
    color: 'red',
    fontSize: 17,
    marginBottom: 12,
    marginRight: 20,
  },
  headerContainer: {
    marginTop: 10,
    marginHorizontal: 19,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  headerText: {
    fontWeight: '600',
    fontSize: 22,
  },
  headerNote: {
    fontSize: 13,
    color: 'rgb(142, 142, 142)',
  },
  searchBar: {
    backgroundColor: 'rgba(142, 142, 147, 0.1)',
    margin: 16,
    padding: 8,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionHeader: {
    fontWeight: '700',
    backgroundColor: 'rgb(240, 240, 240)',
    paddingLeft: 16,
    paddingVertical: 4,
  },
  sectionItem: {
    marginLeft: 16,
    paddingRight: 16,
    paddingVertical: 11,
    borderBottomColor: 'rgb(235,235,235)',
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
};

const mapStateToProps = state => {
  return {
    classList: state.class.class_list,
    classListHere: state.class.class_list_data_here,
    classSetting: state.class.class_setting,
  };
};

export default connect(
  mapStateToProps,
  { getAllClass, getOneClass },
)(SubjectsScreen);
