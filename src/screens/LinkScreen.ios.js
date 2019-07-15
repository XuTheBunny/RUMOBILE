import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
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

export default class LinkScreen extends Component {
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
      url: 'https://m.libraries.rutgers.edu/hours.php',
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

    this.sfViewController = this.sfViewController.bind(this);
  }

  sfViewController(link) {
    //When iOS 8.0 or Higher, it opens SafariViewController
    SafariView.isAvailable()
      .then(
        SafariView.show({
          url: link.url,
          tintColor: '#ed4545',
          barTintColor: 'white',
          readerMode: true,
        }),
      )
      .catch(error => {
        //When iOS 8.0 or Lower, it opens in Safari Browser
        Linking.openURL(link.url);
      });
  }

  LinkList() {
    return links.map(link => (
      <TouchableOpacity key={link.title} onPress={() => this.sfViewController(link)}>
        <View style={styles.viewStyle}>
          <Image style={{ width: 28, height: 28 }} source={link.src} />
          <View style={styles.textContainer}>
            <Text style={styles.textStyle}>{link.title}</Text>
          </View>
        </View>
      </TouchableOpacity>
    ));
  }
  render() {
    return (
      <SafeAreaView style={styles.home}>
        <Header text={'Links'} />
        <ScrollView style={{ marginTop: 5 }}>{this.LinkList()}</ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = {
  home: {
    flex: 1,
    backgroundColor: 'rgb(255, 255, 255)',
  },
  textStyle: {
    fontFamily: 'system font',
    fontSize: 17,
  },
  viewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginLeft: 26,
  },
  textContainer: {
    borderBottomColor: 'rgb(235,235,235)',
    borderBottomWidth: 0.5,
    marginLeft: 26,
    flex: 1,
    paddingVertical: 7,
  },
};
