import axios from 'axios';

import { NEARBYBUS, ALLBUS, ACTIVEROUTES, INACTIVEROUTES, BUS_DATA_HERE } from './types';

var geodist = require('geodist');
const agency_id = '1323';
const base_url = 'https://transloc-api-1-2.p.mashape.com/';
const all_stops_url = base_url + 'stops.json?agencies=' + agency_id;
const all_routes_url = base_url + 'routes.json?agencies=' + agency_id;
const all_buses_url = base_url + 'vehicles.json?agencies=' + agency_id;
const all_routes = [
  'Route A',
  'Route B',
  'Route C',
  'Route EE',
  'Route F',
  'Route H',
  'Route LX',
  'Route All Campuses',
  'Route New BrunsQuick 1 Shuttle',
  'Route New BrunsQuick 2 Shuttle',
  'Route REXB',
  'Route REXL',
  'Route RBHS',
  'Route Weekend 1',
  'Route Weekend 2',
  'Summer 1',
  'Summer 2',
];
const newark = '40.841884,-74.011088|40.660668,-74.277053';
const newBrunswick = '40.382690,-74.595626|40.625639,-74.280317';

export const getBusStops = () => {
  var stops = {};
  var active_routs = {};
  var nearby_stops = [];
  var all_stops = [];
  var user_location = {};
  var nearby_count = 5;
  var routes_active = [];
  var routes_inactive = [];
  var routes_with_bus = [];

  var getUserLocation = new Promise((resolve, reject) => {
    user_location = {};
    navigator.geolocation.getCurrentPosition(
      position => {
        user_location.lat = position.coords.latitude;
        user_location.lon = position.coords.longitude;
        console.log('user_location.lat: ' + user_location.lat);
        console.log('user_location.lon: ' + user_location.lon);
        resolve(user_location);
      },
      error => {
        console.log(error.message);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 6000 },
    );
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
      data = response.data.data[agency_id];
      data.forEach(function(element) {
        if (!routes_with_bus.includes(element.route_id)) {
          routes_with_bus.push(element.route_id);
        }
      });
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
        data = [];
        raw_data.forEach(function(element) {
          if (all_routes.includes(element.long_name)) {
            data.push(element);
          }
        });
        data.forEach(function(element) {
          rid = element.route_id;
          if (element.is_active && values[0].includes(element.route_id)) {
            active_routs[rid] = element.long_name;
            routes_active.push(element.long_name);
          } else {
            routes_inactive.push(element.long_name);
          }
        });
        resolve(active_routs);
      });
    });
  });

  return dispatch => {
    Promise.all([getUserLocation, getActiveRoutes]).then(value => {
      dispatch({ type: ACTIVEROUTES, payload: routes_active });
      dispatch({ type: INACTIVEROUTES, payload: routes_inactive });
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
          s = {};
          route = [];
          s.name = element.name;
          element.routes.forEach(function(e) {
            if (active_routs[e]) {
              rname = active_routs[e];
              route.push(rname);
            }
          });
          s.route = route;
          distance = geodist(user_location, element.location, {
            exact: true,
            unit: 'miles',
          });
          s.distance = distance.toFixed(2);
          all_stops.push(s);
        });
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
        dispatch({ type: BUS_DATA_HERE, payload: 'here' });
      });
    });
  };
};
