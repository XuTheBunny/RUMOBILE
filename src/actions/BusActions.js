import axios from "axios";

import {
  NEARBYBUS,
  ALLBUS,
  ACTIVEROUTES,
  INACTIVEROUTES,
  BUS_DATA_HERE
} from "./types";

var geodist = require("geodist");
var agency_id = "1323";
var base_url = "https://transloc-api-1-2.p.mashape.com/";
var all_stops_url = base_url + "stops.json?agencies=" + agency_id;
var all_routes_url = base_url + "routes.json?agencies=" + agency_id;
var all_buses_url = base_url + "vehicles.json?agencies=" + agency_id;
var all_routes = [
  "Route A",
  "Route B",
  "Route C",
  "Route EE",
  "Route F",
  "Route H",
  "Route LX",
  "Route All Campuses",
  "Route New BrunsQuick 1 Shuttle",
  "Route New BrunsQuick 2 Shuttle",
  "Route REXB",
  "Route REXL",
  "Route RBHS",
  "Route Weekend 1",
  "Route Weekend 2",
  "Summer 1",
  "Summer 2"
];

export const getBusStops = () => {
  var stops = {};
  var active_routs = {};
  var nearby_stops = [];
  var all_stops = [];
  var user_location = {};
  var nearby_count = 3;
  var routes_active = [];
  var routes_inactive = [];
  var routes_with_bus = [];

  var getUserLocation = new Promise((resolve, reject) => {
    user_location = {};
    navigator.geolocation.getCurrentPosition(
      position => {
        user_location.lat = position.coords.latitude;
        user_location.lon = position.coords.longitude;
        console.log("user_location.lat: " + user_location.lat);
        console.log("user_location.lon: " + user_location.lon);
        resolve(user_location);
      },
      error => {
        console.log(error.message);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 6000 }
    );
  });

  var checkHaveBus = new Promise((resolve, reject) => {
    axios({
      method: "get",
      url: all_buses_url,
      headers: {
        Accept: "application/json",
        "X-Mashape-Key": "Pcl9MfLNF0mshcAni8CgyFuxVXTap1NA0RxjsnoxN4439f9hBq"
      }
    }).then(response => {
      data = response.data.data[agency_id];
      for (i in data) {
        if (!routes_with_bus.includes(data[i]["route_id"])) {
          routes_with_bus.push(data[i]["route_id"]);
        }
      }
      resolve(routes_with_bus);
    });
  });

  var getActiveRoutes = new Promise((resolve, reject) => {
    Promise.all([checkHaveBus]).then(values => {
      axios({
        method: "get",
        url: all_routes_url,
        headers: {
          Accept: "application/json",
          "X-Mashape-Key": "Pcl9MfLNF0mshcAni8CgyFuxVXTap1NA0RxjsnoxN4439f9hBq"
        }
      }).then(response => {
        raw_data = response.data.data[agency_id];
        data = [];
        for (i in raw_data) {
          if (all_routes.includes(raw_data[i]["long_name"])) {
            data.push(raw_data[i]);
          }
        }
        for (i in data) {
          rid = data[i]["route_id"];
          if (data[i]["is_active"] && values[0].includes(data[i]["route_id"])) {
            active_routs[rid] = data[i]["long_name"];
            routes_active.push(data[i]["long_name"]);
          } else {
            routes_inactive.push(data[i]["long_name"]);
          }
        }
        resolve(active_routs);
      });
    });
  });

  return dispatch => {
    Promise.all([getUserLocation, getActiveRoutes]).then(value => {
      dispatch({ type: ACTIVEROUTES, payload: routes_active });
      dispatch({ type: INACTIVEROUTES, payload: routes_inactive });
      axios({
        method: "get",
        url: all_stops_url,
        headers: {
          Accept: "application/json",
          "X-Mashape-Key": "Pcl9MfLNF0mshcAni8CgyFuxVXTap1NA0RxjsnoxN4439f9hBq"
        }
      }).then(response => {
        data = response.data.data;
        for (i in data) {
          s = {};
          route = [];
          s.name = data[i]["name"];
          for (i in data[i]["routes"]) {
            rid = data[i]["routes"][i];
            if (active_routs[rid]) {
              rname = active_routs[rid];
              route.push(rname);
            }
          }
          s.route = route;
          distance = geodist(user_location, data[i].location, {
            exact: true,
            unit: "miles"
          });
          s.distance = distance;
          all_stops.push(s);
        }
        dispatch({
          type: NEARBYBUS,
          payload: all_stops
            .sort((a, b) =>
              a.distance > b.distance ? 1 : b.distance > a.distance ? -1 : 0
            )
            .slice(0, nearby_count)
        });
        dispatch({
          type: ALLBUS,
          payload: all_stops.sort((a, b) =>
            a.name > b.name ? 1 : b.name > a.name ? -1 : 0
          )
        });
        dispatch({ type: BUS_DATA_HERE, payload: "here" });
      });
    });
  };
};
