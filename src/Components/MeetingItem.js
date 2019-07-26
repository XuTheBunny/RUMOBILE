import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { campusColor } from '../../bus_color.json';
import { building } from '../../building.json';

class MeetingItem extends Component {
  formTime = item => {
    const timeObj = {};
    if (parseInt(item.startTime.split(':')[0]) > parseInt(item.endTime.split(':')[0])) {
      timeObj.startTime = item.startTime + 'AM';
      timeObj.endTime = item.endTime + 'PM';
    } else {
      timeObj.startTime = item.startTime + item.pmCode;
      timeObj.endTime = item.endTime + item.pmCode;
    }
    return timeObj;
  };

  buildingName() {
    if (this.props.item.place == 'Independent Study') {
      return 'Independent Study';
    } else {
      if (this.props.item.building) {
        if (building.find(obj => obj.tag.includes(this.props.item.building.toLowerCase()))) {
          return building.find(obj => obj.tag.includes(this.props.item.building.toLowerCase()))
            .bName;
        } else {
          return this.props.item.building;
        }
      } else {
        return 'No building data';
      }
    }
  }

  campusIcon() {
    var color = '';
    var name = '';
    if (this.props.item.campus) {
      color = campusColor.find(obj => obj.campus == this.props.item.campus)
        ? campusColor.find(obj => obj.campus == this.props.item.campus).ccolor
        : 'rgb(74, 74, 74)';
      name = campusColor.find(obj => obj.campus == this.props.item.campus)
        ? campusColor.find(obj => obj.campus == this.props.item.campus).cName
        : this.props.item.campus;
    } else {
      color = 'rgb(229, 25, 54)';
      name = 'Rutgers';
    }
    return (
      <View
        style={{
          backgroundColor: color,
          paddingVertical: 3,
          paddingHorizontal: 4,
          borderRadius: 3,
        }}
      >
        <Text style={{ fontSize: 10, color: 'white' }}>{name}</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={this.props.addStyle}>
        {!this.props.className && this.props.item.day.length > 0 && (
          <Text style={styles.itemTitle}>{this.props.item.day}</Text>
        )}
        <View style={styles.itemRow}>
          <View style={{ flexDirection: 'row' }}>
            {this.props.item.day == '' ? (
              <View style={styles.timeBox}>
                <Text style={styles.startTime}>All Day</Text>
              </View>
            ) : (
              <View style={styles.timeBox}>
                <Text style={styles.startTime}>{this.formTime(this.props.item).startTime}</Text>
                <Text style={styles.endTime}>{this.formTime(this.props.item).endTime}</Text>
              </View>
            )}
            <View>
              {this.props.className ? (
                <Text style={{ fontSize: 14, marginBottom: 5, textTransform: 'capitalize' }}>
                  {this.props.className}
                </Text>
              ) : (
                <Text style={{ fontSize: 14, marginBottom: 5, maxWidth: 230 }}>
                  {this.buildingName()}
                </Text>
              )}
              <View style={{ flexDirection: 'row' }}>
                {this.campusIcon()}
                <Text style={{ fontSize: 12, color: 'rgb(109,109,114)', marginLeft: 4 }}>
                  {this.props.className && this.props.item.building && (
                    <Text>{this.props.item.building + ' '}</Text>
                  )}
                  {this.props.item.room != 'Room null' && (
                    <Text>
                      {this.props.className
                        ? this.props.item.room.split(' ')[1]
                        : this.props.item.room}
                    </Text>
                  )}
                </Text>
              </View>
            </View>
          </View>
          {!this.props.className && (
            <TouchableOpacity>
              <EvilIcons name="chevron-right" size={30} color="rgb(138,138,143)" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
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
    flexDirection: 'column',
    justifyContent: 'center',
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
