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
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { campusColor } from '../../bus_color.json';

var color = 'rgb(142, 142, 147)';

class MeetingItem extends Component {
  formTime = item => {
    const timeObj = {};
    if (item.startTime > item.endTime) {
      timeObj.startTime = item.startTime + 'AM';
      timeObj.endTime = item.endTime + 'PM';
    } else {
      timeObj.startTime = item.startTime + item.pmCode;
      timeObj.endTime = item.endTime + item.pmCode;
    }
    return timeObj;
  };

  resetColor() {
    color = 'rgb(142, 142, 147)';
  }

  isColor() {
    color = this.props.item.campus
      ? campusColor.find(obj => obj.campus == this.props.item.campus).ccolor
      : 'rgb(142, 142, 147)';
  }

  render() {
    this.resetColor();
    this.isColor();
    if (this.props.item.day != '') {
      return (
        <TouchableOpacity>
          <Text style={styles.itemTitle}>{this.props.item.day}</Text>
          <View style={styles.itemRow}>
            <View style={{ flexDirection: 'row' }}>
              <View style={styles.timeBox}>
                <Text style={styles.startTime}>{this.formTime(this.props.item).startTime}</Text>
                <Text style={styles.endTime}>{this.formTime(this.props.item).endTime}</Text>
              </View>
              <View>
                <Text style={{ fontSize: 14, marginBottom: 5 }}>{this.props.item.building}</Text>
                <View style={{ flexDirection: 'row' }}>
                  <View
                    style={{
                      backgroundColor: color,
                      paddingVertical: 3,
                      paddingHorizontal: 4,
                      borderRadius: 3,
                    }}
                  >
                    <Text style={{ fontSize: 10, color: 'white' }}>{this.props.item.campus}</Text>
                  </View>
                  <Text style={{ fontSize: 12, color: 'rgb(109,109,114)', marginLeft: 4 }}>
                    {this.props.item.room}
                  </Text>
                </View>
              </View>
            </View>
            <EvilIcons name="chevron-right" size={30} color="rgb(138,138,143)" />
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <Text style={[styles.sectionText, { marginLeft: 10 }]}>No meeting time data available</Text>
      );
    }
  }
}

const styles = {
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginVertical: 11,
    marginLeft: 10,
    textTransform: 'uppercase',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginRight: 16,
  },
  timeBox: {
    paddingRight: 5,
    marginRight: 5,
    borderRightColor: 'rgb(235,235,235)',
    borderRightWidth: 0.5,
    width: 90,
  },
  startTime: {
    textAlign: 'right',
    fontSize: 18,
  },
  endTime: {
    textAlign: 'right',
    fontSize: 12,
    color: 'rgb(200,199,204)',
  },
  sectionText: {
    fontSize: 15,
    color: 'rgb(74,74,74)',
    marginTop: 6,
    marginBottom: 11,
  },
};

export default MeetingItem;
