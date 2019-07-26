import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';

class AboutMeScreen extends Component {
  state = { y: 0, width: 0 };
  render() {
    return (
      <View style={styles.home}>
        <SafeAreaView>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              paddingTop: 3,
              paddingRight: 24,
            }}
          >
            <TouchableOpacity onPress={() => Actions.pop()}>
              <View style={styles.closeButton}>
                <Image
                  style={styles.iconStyle}
                  source={require('../images/Today/actionClose.png')}
                />
              </View>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
        <View
          style={{
            flex: 1,
            zIndex: 10,
            width: this.state.width,
            height: 120,
            position: 'absolute',
            marginTop: this.state.y - 70,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            style={{ height: 120, width: 120, borderRadius: 15 }}
            source={require('../images/More/TaroKuma_profPic.jpeg')}
          />
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            marginTop: 62,
            paddingTop: 67,
            borderTopStartRadius: 50,
            borderTopEndRadius: 50,
          }}
          onLayout={event => {
            const layout = event.nativeEvent.layout;
            this.setState({ y: layout.y, width: layout.width });
          }}
        >
          <Text style={{ textAlign: 'center', fontSize: 24, fontWeight: '600' }}>
            Taro Kumakabe
          </Text>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 18,
              color: 'rgb(122, 122, 123)',
              marginTop: 10,
            }}
          >
            App Developer
          </Text>
          <View style={{ marginLeft: 33 }}>
            <Text style={{ fontSize: 20, fontWeight: '600', paddingVertical: 14 }}>About Me</Text>
            <View style={{ flexDirection: 'row' }}>
              <Image
                style={{ height: 18, width: 22, marginRight: 14 }}
                source={require('../images/More/image-quote-begin.png')}
              />
              <Text style={{ fontSize: 17, width: 280 }}>
                I’m a bear and I love to eat, build apps, and sleep ʕ•ᴥ•ʔ{' '}
                <Image
                  style={{ height: 9, width: 30, resizeMode: 'contain' }}
                  source={require('../images/More/image-quote-end.png')}
                />
              </Text>
            </View>
            <Text style={{ fontSize: 20, fontWeight: '600', paddingVertical: 14 }}>Badges</Text>
            <View style={{ flexDirection: 'row', marginVertical: 15 }}>
              <Image
                style={{
                  height: 45,
                  width: 56,
                  resizeMode: 'contain',
                  marginRight: 27,
                  marginLeft: 8,
                }}
                source={require('../images/More/coding-badge.png')}
              />
              <View>
                <Text style={{ fontSize: 18, fontWeight: '500' }}>
                  Coding: <Text style={{ fontSize: 17, fontWeight: 'normal' }}>Advanced</Text>
                </Text>
                <Text style={{ fontSize: 13, color: 'rgb(122, 122, 123)', paddingTop: 10 }}>
                  September 1st, 2015
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 8,
                  backgroundColor: 'rgb(0, 111, 186)',
                  paddingHorizontal: 4,
                  paddingVertical: 1,
                  borderRadius: 2,
                  height: 12,
                  color: 'white',
                  marginLeft: 8,
                }}
              >
                Lvl 5
              </Text>
            </View>
            <View style={{ flexDirection: 'row', marginVertical: 15 }}>
              <Image
                style={{
                  height: 45,
                  width: 52,
                  resizeMode: 'contain',
                  marginRight: 27,
                  marginLeft: 12,
                }}
                source={require('../images/More/artist-badge.png')}
              />
              <View>
                <Text style={{ fontSize: 18, fontWeight: '500' }}>
                  Artist: <Text style={{ fontSize: 17, fontWeight: 'normal' }}>Intermediate</Text>
                </Text>
                <Text style={{ fontSize: 13, color: 'rgb(122, 122, 123)', paddingTop: 10 }}>
                  September 1st, 2015
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 8,
                  backgroundColor: 'rgb(98, 166, 20)',
                  paddingHorizontal: 4,
                  paddingVertical: 1,
                  borderRadius: 2,
                  height: 12,
                  color: 'white',
                  marginLeft: 8,
                }}
              >
                Lvl 3
              </Text>
            </View>
            <Text style={{ fontSize: 20, fontWeight: '600', paddingVertical: 14 }}>
              Social Media
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 7 }}>
              <Image
                style={{
                  height: 22,
                  width: 22,
                  resizeMode: 'contain',
                  marginRight: 16,
                  marginLeft: 8,
                }}
                source={require('../images/More/Facebook-icon.png')}
              />
              <Text style={{ fontSize: 17 }}>rumobileapplication</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = {
  home: {
    flex: 1,
    backgroundColor: 'rgb(48, 48, 48)',
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
    shadowColor: 'rgb(233, 233, 233)',
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    backgroundColor: 'white',
  },
};

export default AboutMeScreen;
