import React from "react";
import { Scene, Router } from "react-native-router-flux";
import HomeScreen from "./src/screensTEMP/HomeScreen";
import StopScreen from "./src/screensTEMP/StopScreen";
import RouteScreen from "./src/screensTEMP/RouteScreen";
import Route from "./src/screensTEMP/Route";
import Stop from "./src/screensTEMP/Stop";
import FoodScreen from "./src/screensTEMP/FoodScreen";
import FoodList from "./src/screensTEMP/FoodList";
import LinkScreen from "./src/screensTEMP/LinkScreen";
import MoreScreen from "./src/screensTEMP/MoreScreen";

const RouterComponent = () => {
  return (
    <Router>
      <Scene key="root" hideNavBar>
        <Scene
          key="home_screen"
          component={HomeScreen}
          hideNavBar
          type="reset"
        />
        <Scene
          key="stop_screen"
          component={StopScreen}
          hideNavBar
          type="reset"
        />
        <Scene key="stop_" component={Stop} hideNavBar />
        <Scene
          key="route_screen"
          component={RouteScreen}
          hideNavBar
          type="reset"
        />
        <Scene key="route" component={Route} hideNavBar />
        <Scene
          key="food_screen"
          component={FoodScreen}
          hideNavBar
          type="reset"
        />
        <Scene key="food_list" component={FoodList} hideNavBar />
        <Scene
          key="links_screen"
          component={LinkScreen}
          hideNavBar
          type="reset"
        />
        <Scene
          key="more_screen"
          component={MoreScreen}
          hideNavBar
          type="reset"
        />
      </Scene>
    </Router>
  );
};

export default RouterComponent;
