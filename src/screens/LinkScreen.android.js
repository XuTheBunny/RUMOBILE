import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
  SafeAreaView,
} from 'react-native';
import SafariView from 'react-native-safari-view';
import Header from '../Components/Header';
import NotificationBar from '../Components/NotificationBar';

class LinkScreen extends Component {
  constructor() {
    super();
    links = new Array();
    //Adds to the list of links. Just add and remove entries as neccesary
    links.push({
      title: 'myRutgers',
      url: 'https://cas.rutgers.edu/login?service=https://my.rutgers.edu/portal/Login',
      src: require('../images/Links/University.png'),
    });
    links.push({
      title: 'Sakai',
      url:
        'https://cas.rutgers.edu/login?service=https%3A%2F%2Fsakai.rutgers.edu%2Fsakai-login-tool%2Fcontainer',
      src: require('../images/Links/Classroom.png'),
    });
    links.push({
      title: 'Library Hours',
      url: 'https://www.libraries.rutgers.edu',
      src: require('../images/Links/Clock.png'),
    });
    links.push({
      title: 'Targum',
      url: 'http://www.dailytargum.com/',
      src: require('../images/Links/News.png'),
    });
    links.push({
      title: 'Rutgers Reddit',
      url: 'https://m.reddit.com/r/rutgers/',
      src: require('../images/Links/Reddit.png'),
    });
    links.push({
      title: 'The Medium',
      url: 'https://rutgersthemedium.wordpress.com',
      src: require('../images/Links/Monkey.png'),
    });
    links.push({
      title: 'Student Organizations',
      url: 'https://rutgers.collegiatelink.net',
      src: require('../images/Links/Map.png'),
    });
    links.push({
      title: 'Grades',
      url:
        'https://cas.rutgers.edu/login?service=https://my.rutgers.edu/portal/Login%3fuP_fname=my-grades&uP_args=',
      src: require('../images/Links/Exam.png'),
    });
    links.push({
      title: 'eCollege',
      url:
        'https://cas.rutgers.edu/login?service=http%3A%2F%2Fonlinelearning.rutgers.edu%2Facademics.php',
      src: require('../images/Links/Student.png'),
    });
    links.push({
      title: 'Financial Aid',
      url: 'https://finservices.rutgers.edu/otb/chooseSemester.htm?login=cas',
      src: require('../images/Links/Bank.png'),
    });
    links.push({
      title: 'Privacy Policy',
      url: 'https://rumobile-cbb58.firebaseapp.com',
      src: require('../images/Links/Privacy.png'),
    });
  }

  LinkList() {
    return links.map(link => (
      <TouchableOpacity key={link.title} onPress={() => Linking.openURL(link.url)}>
        <View style={{ flexDirection: 'row', paddingHorizontal: 15 }}>
          <Image style={styles.iconStyle} source={link.src} />
          <View style={styles.listContainer}>
            <Text style={styles.listText}>{link.title}</Text>
          </View>
        </View>
      </TouchableOpacity>
    ));
  }
  render() {
    return (
      <SafeAreaView style={styles.home}>
        {!this.props.internet && (
          <NotificationBar text="There is no Internet connection." color="rgb(237,69,69)" />
        )}
        <Header text={'Links'} />
        <ScrollView style={{ marginTop: 16 }}>{this.LinkList()}</ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = {
  home: {
    flex: 1,
    backgroundColor: 'rgb(255, 255, 255)',
  },
  listContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomColor: 'rgb(235,235,235)',
    borderBottomWidth: 0.5,
    marginLeft: 17,
  },
  iconStyle: {
    height: 24,
    width: 24,
    resizeMode: 'contain',
    marginVertical: 12,
    marginLeft: 2,
  },
  listText: {
    fontSize: 17,
  },
};

const mapStateToProps = state => {
  return {
    internet: state.home.internet,
  };
};

export default connect(
  mapStateToProps,
  {},
)(LinkScreen);
