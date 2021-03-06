import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, SectionList, SafeAreaView } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import BackButton from '../Components/BackButton';
import Loading from '../Components/Loading';
import NotificationBar from '../Components/NotificationBar';
import { getAllClass, getOneClass } from '../actions';

class SubjectsScreen extends Component {
  state = {
    search: false,
    sections: [],
  };

  componentDidMount() {
    if (this.props.classList.legnth > 0) {
      this.setState({ sections: this.props.classList });
    } else {
      this.props.getAllClass(null, this.props.classSetting);
    }
  }

  renderSetting() {
    const s = [0, 'spring', 2, 3, 4, 5, 6, 'summer', 8, 'fall'];
    const settingString = [
      s[this.props.classSetting.semester[0][0]],
      this.props.classSetting.semester[0].slice(1),
      ...this.props.classSetting.campus,
      ...this.props.classSetting.level,
    ].join(' ');
    if (settingString.length > 25) {
      return <Text style={styles.headerNote}>{settingString.substring(0, 25) + '...'}</Text>;
    } else {
      return <Text style={styles.headerNote}>{settingString}</Text>;
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
          <Text key={index} style={{ fontSize: 17, flex: 2, textTransform: 'capitalize' }}>
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
    this.setState({ search: false, sections: this.props.classList });
    this.textInput.clear();
    this.textInput.blur();
  }

  searchUpdated = text => {
    let matchedItemsArray = [];
    this.props.classList.map(item => {
      const filtered = item.data.filter(word => word.toUpperCase().includes(text.toUpperCase()));
      matchedItemsArray.push({ title: item.title, data: filtered });
    });
    this.setState({ search: true, sections: matchedItemsArray });
  };

  render() {
    return (
      <SafeAreaView style={styles.home}>
        {!this.props.internet && (
          <NotificationBar text="There is no Internet connection" color="rgb(237,69,69)" />
        )}
        {!this.state.search && (
          <>
            <View style={styles.topButtonContainer}>
              <BackButton text={'More'} />
              <TouchableOpacity onPress={() => Actions.classSetting_screen()}>
                <Text style={styles.editButton}>Edit</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>Subjects</Text>
              {this.renderSetting()}
            </View>
          </>
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.searchBar}>
            <EvilIcons name="search" size={20} color="rgb(138,138,143)" />
            <TextInput
              ref={input => {
                this.textInput = input;
              }}
              spellCheck={false}
              autoCorrect={false}
              clearTextOnFocus={true}
              onChangeText={text => {
                this.searchUpdated(text);
              }}
              onFocus={() => this.setState({ search: true })}
              placeholder="Search"
              clearButtonMode="while-editing"
              inlineImageLeft="search_icon"
              style={{ fontSize: 17, flex: 1, marginLeft: 7 }}
            />
          </View>
          {this.state.search && (
            <TouchableOpacity
              onPress={() => {
                this.textInput.blur();
                this.setState({ search: false, sections: this.props.classList });
                this.textInput.clear();
              }}
            >
              <Text style={{ paddingRight: 15, fontSize: 17, color: 'rgb(237, 69, 69)' }}>
                Cancel
              </Text>
            </TouchableOpacity>
          )}
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
            ListEmptyComponent={() => <Text style={styles.emptyText}>No classes found.</Text>}
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
    color: 'rgb(237, 69, 69)',
    fontSize: 17,
    marginBottom: 12,
    marginHorizontal: 20,
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
    fontSize: 25,
  },
  headerNote: {
    fontSize: 13,
    color: 'rgb(142, 142, 142)',
    textTransform: 'uppercase',
  },
  searchBar: {
    backgroundColor: 'rgba(142, 142, 147, 0.1)',
    margin: 16,
    padding: 8,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  sectionHeader: {
    fontWeight: '700',
    backgroundColor: 'rgb(240, 240, 240)',
    paddingLeft: 16,
    paddingVertical: 4,
  },
  sectionItem: {
    flex: 2,
    marginLeft: 16,
    paddingRight: 16,
    paddingVertical: 11,
    borderBottomColor: 'rgb(235,235,235)',
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emptyText: {
    fontSize: 15,
    color: 'rgb(142, 142, 147)',
    width: '100%',
    textAlign: 'center',
    marginTop: 50,
  },
};

const mapStateToProps = state => {
  return {
    classList: state.class.class_list,
    classListHere: state.class.class_list_data_here,
    classSetting: state.class.class_setting,
    internet: state.home.internet,
  };
};

export default connect(
  mapStateToProps,
  { getAllClass, getOneClass },
)(SubjectsScreen);
