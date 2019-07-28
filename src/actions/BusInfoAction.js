import axios from 'axios';
import RNLocation from 'react-native-location';
import { BUS_INFO, LOCATION_SHARING } from './types';
import { routeColor, busInfo } from '../../bus_color.json';

var geodist = require('geodist');

const campusGeoArea = {
  newark: '40.841884%2C-74.011088%7C40.660668%2C-74.277053',
  newBrunswick: '40.382690%2C-74.595626%7C40.625639%2C-74.280317',
};
const agency_id = '1323';
const base_url = 'https://transloc-api-1-2.p.mashape.com/';

export const getBusInfo = action => {
  var bus_info_collect = {};

  var getUserLocation = new Promise((resolve, reject) => {
    user_location = {};
    RNLocation.requestPermission({
      ios: 'whenInUse',
      android: {
        detail: 'coarse',
      },
    }).then(granted => {
      if (granted) {
        RNLocation.getLatestLocation({ timeout: 60000 }).then(latestLocation => {
          user_location.lat = latestLocation.latitude;
          user_location.lon = latestLocation.longitude;
          console.log('User Location: ' + user_location.lat + ',' + user_location.lon);
          resolve(user_location);
        });
      } else {
        console.log('User Location is not allowed');
        user_location.lat = 'no';
        user_location.lon = 'no';
        resolve(user_location);
      }
    });
  });

  var getRoutesInfoNB = new Promise((resolve, reject) => {
    const all_routes_url =
      base_url + 'routes.json?geo_area=' + campusGeoArea.newBrunswick + '&agencies=' + agency_id;
    axios({
      method: 'get',
      url: all_routes_url,
      headers: {
        Accept: 'application/json',
        'X-Mashape-Key': 'Pcl9MfLNF0mshcAni8CgyFuxVXTap1NA0RxjsnoxN4439f9hBq',
      },
    })
      .then(response => {
        raw_data = response.data.data[agency_id];
        raw_data.forEach(function(element) {
          if (!Object.keys(bus_info_collect).includes('r' + element.route_id)) {
            bus_info_collect['r' + element.route_id] = { rname: element.long_name };
          }
        });
        resolve(bus_info_collect);
      })
      .catch(function(error) {
        console.log(error);
        resolve({});
      });
  });

  var getStopsInfoNB = new Promise((resolve, reject) => {
    Promise.all([getUserLocation]).then(value => {
      const all_stops_url =
        base_url + 'stops.json?geo_area=' + campusGeoArea.newBrunswick + '&agencies=' + agency_id;
      axios({
        method: 'get',
        url: all_stops_url,
        headers: {
          Accept: 'application/json',
          'X-Mashape-Key': 'Pcl9MfLNF0mshcAni8CgyFuxVXTap1NA0RxjsnoxN4439f9hBq',
        },
      })
        .then(response => {
          data = response.data.data;
          data.forEach(function(element) {
            var distance = null;
            if (user_location.lat == 'no') {
              distance = '--';
            } else {
              distance = geodist(user_location, element.location, {
                exact: true,
                unit: 'miles',
              });
            }
            if (!Object.keys(bus_info_collect).includes('s' + element.stop_id)) {
              bus_info_collect['s' + element.stop_id] = {
                sname: element.name,
                distance: distance == '--' ? '--' : distance.toFixed(1),
              };
            }
          });
          resolve(bus_info_collect);
        })
        .catch(function(error) {
          console.log(error);
          resolve({});
        });
    });
  });

  var getRoutesInfoNK = new Promise((resolve, reject) => {
    const all_routes_url =
      base_url + 'routes.json?geo_area=' + campusGeoArea.newark + '&agencies=' + agency_id;
    axios({
      method: 'get',
      url: all_routes_url,
      headers: {
        Accept: 'application/json',
        'X-Mashape-Key': 'Pcl9MfLNF0mshcAni8CgyFuxVXTap1NA0RxjsnoxN4439f9hBq',
      },
    })
      .then(response => {
        raw_data = response.data.data[agency_id];
        raw_data.forEach(function(element) {
          if (!Object.keys(bus_info_collect).includes('r' + element.route_id)) {
            bus_info_collect['r' + element.route_id] = { rname: element.long_name };
          }
        });
        resolve(bus_info_collect);
      })
      .catch(function(error) {
        console.log(error);
        resolve({});
      });
  });

  var getStopsInfoNK = new Promise((resolve, reject) => {
    Promise.all([getUserLocation]).then(value => {
      const all_stops_url =
        base_url + 'stops.json?geo_area=' + campusGeoArea.newark + '&agencies=' + agency_id;
      axios({
        method: 'get',
        url: all_stops_url,
        headers: {
          Accept: 'application/json',
          'X-Mashape-Key': 'Pcl9MfLNF0mshcAni8CgyFuxVXTap1NA0RxjsnoxN4439f9hBq',
        },
      })
        .then(response => {
          data = response.data.data;
          data.forEach(function(element) {
            var distance = null;
            if (user_location.lat == 'no') {
              distance = '--';
            } else {
              distance = geodist(user_location, element.location, {
                exact: true,
                unit: 'miles',
              });
            }
            if (!Object.keys(bus_info_collect).includes('s' + element.stop_id)) {
              bus_info_collect['s' + element.stop_id] = {
                sname: element.name,
                distance: distance == '--' ? '--' : distance.toFixed(1),
              };
            }
          });
          resolve(bus_info_collect);
        })
        .catch(function(error) {
          console.log(error);
          resolve({});
        });
    });
  });

  return dispatch => {
    Promise.all([getRoutesInfoNB, getStopsInfoNB, getRoutesInfoNK, getStopsInfoNK]).then(value => {
      dispatch({
        type: BUS_INFO,
        payload: Object.keys(bus_info_collect).length > 0 ? bus_info_collect : busInfo,
      });
    });
  };
};
