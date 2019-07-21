import axios from 'axios';
import RNLocation from 'react-native-location';
import {
  NEARBYBUS,
  ALLBUS,
  ACTIVEROUTES,
  INACTIVEROUTES,
  BUS_DATA_HERE,
  CAMPUS,
  BUS_INFO,
  LOCATION_SHARING,
} from './types';

var geodist = require('geodist');

const campusGeoArea = {
  newark: '40.841884%2C-74.011088%7C40.660668%2C-74.277053',
  newBrunswick: '40.382690%2C-74.595626%7C40.625639%2C-74.280317',
};
const campusIndex = ['newBrunswick', 'newark'];
const agency_id = '1323';
const base_url = 'https://transloc-api-1-2.p.mashape.com/';

export const getBusStops = action => {
  var campus = '';
  if (campusIndex.includes(action)) {
    campus = action;
  } else if (action == 'clean') {
    return dispatch => {
      dispatch({ type: ACTIVEROUTES, payload: [] });
      dispatch({ type: INACTIVEROUTES, payload: [] });
      dispatch({ type: NEARBYBUS, payload: [] });
      dispatch({ type: ALLBUS, payload: [] });
      dispatch({ type: BUS_DATA_HERE, payload: 'no' });
    };
  } else {
    campus = campusIndex[0];
  }
  const all_stops_url =
    base_url + 'stops.json?geo_area=' + campusGeoArea[campus] + '&agencies=' + agency_id;
  const all_routes_url =
    base_url + 'routes.json?geo_area=' + campusGeoArea[campus] + '&agencies=' + agency_id;
  const all_buses_url =
    base_url + 'vehicles.json?geo_area=' + campusGeoArea[campus] + '&agencies=' + agency_id;

  var stop_name = {};
  var route_name = {};
  var nearby_stops = [];
  var all_stops = [];
  var user_location = {};
  var nearby_count = 5;
  var routes_active = [];
  var routes_inactive = [];
  var routes_with_bus = [];
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

  var checkHaveBus = new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: all_buses_url,
      headers: {
        Accept: 'application/json',
        'X-Mashape-Key': 'Pcl9MfLNF0mshcAni8CgyFuxVXTap1NA0RxjsnoxN4439f9hBq',
      },
    }).then(response => {
      if (response.data.data[agency_id]) {
        data = response.data.data[agency_id];
        data.forEach(function(element) {
          if (!routes_with_bus.includes(element.route_id) && element.arrival_estimates.length > 0) {
            routes_with_bus.push(element.route_id);
          }
        });
      }
      resolve(routes_with_bus);
    });
  });

  var getActiveRoutes = new Promise((resolve, reject) => {
    Promise.all([checkHaveBus]).then(values => {
      axios({
        method: 'get',
        url: all_routes_url,
        headers: {
          Accept: 'application/json',
          'X-Mashape-Key': 'Pcl9MfLNF0mshcAni8CgyFuxVXTap1NA0RxjsnoxN4439f9hBq',
        },
      }).then(response => {
        raw_data = response.data.data[agency_id];
        raw_data.forEach(function(element) {
          rid = element.route_id;
          r = {
            rid: element.route_id,
            rname: element.long_name,
            stops: [],
            isActive: false,
          };
          element.stops.forEach(function(e) {
            s = { sid: e, sname: null, distance: null };
            r.stops.push(s);
          });
          if (element.is_active && values[0].includes(element.route_id)) {
            r.isActive = true;
            routes_active.push(r);
          } else {
            routes_inactive.push(r);
          }
          route_name[element.route_id] = element.long_name;
          if (!Object.keys(bus_info_collect).includes('r' + element.route_id)) {
            bus_info_collect['r' + element.route_id] = { rname: element.long_name };
          }
        });
        resolve(route_name);
      });
    });
  });

  return dispatch => {
    Promise.all([getUserLocation, getActiveRoutes]).then(value => {
      axios({
        method: 'get',
        url: all_stops_url,
        headers: {
          Accept: 'application/json',
          'X-Mashape-Key': 'Pcl9MfLNF0mshcAni8CgyFuxVXTap1NA0RxjsnoxN4439f9hBq',
        },
      }).then(response => {
        data = response.data.data;
        data.forEach(function(element) {
          stop_name[element.stop_id] = element.name;
          s = {};
          routes = [];
          s.sid = element.stop_id;
          s.sname = element.name;
          element.routes.forEach(function(e) {
            r = {
              rid: e,
              rname: route_name[e],
              isActive: routes_with_bus.includes(e),
            };
            routes.push(r);
          });
          s.routes = routes;
          if (user_location.lat == 'no') {
            distance = '--';
          } else {
            distance = geodist(user_location, element.location, {
              exact: true,
              unit: 'miles',
            });
          }
          s.distance = distance == '--' ? '--' : distance.toFixed(2);
          all_stops.push(s);
          if (!Object.keys(bus_info_collect).includes('s' + element.stop_id)) {
            bus_info_collect['s' + element.stop_id] = {
              sname: element.name,
              distance: distance == '--' ? '--' : distance.toFixed(1),
            };
          }
        });
        routes_active.forEach(function(element) {
          element.stops.forEach(function(e) {
            e.sname = stop_name[e.sid];
            e.distance = all_stops.find(obj => obj.sid == e.sid).distance;
          });
        });
        routes_inactive.forEach(function(element) {
          element.stops.forEach(function(e) {
            e.sname = stop_name[e.sid];
            e.distance = all_stops.find(obj => obj.sid == e.sid).distance;
          });
        });
        dispatch({ type: BUS_INFO, payload: bus_info_collect });
        dispatch({ type: ACTIVEROUTES, payload: routes_active });
        dispatch({ type: INACTIVEROUTES, payload: routes_inactive });
        if (all_stops[0].distance == '--') {
          dispatch({
            type: NEARBYBUS,
            payload: [],
          });
          dispatch({
            type: ALLBUS,
            payload: all_stops.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0)),
          });
          dispatch({ type: LOCATION_SHARING, payload: false });
        } else {
          dispatch({
            type: NEARBYBUS,
            payload: all_stops
              .sort((a, b) => (a.distance > b.distance ? 1 : b.distance > a.distance ? -1 : 0))
              .slice(0, nearby_count),
          });
          dispatch({
            type: ALLBUS,
            payload: all_stops.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0)),
          });
          dispatch({ type: LOCATION_SHARING, payload: true });
        }
        dispatch({ type: BUS_DATA_HERE, payload: 'here' });
      });
    });
  };
};
