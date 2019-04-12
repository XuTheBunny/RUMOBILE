import React from "react";
import { Scene, Router } from "react-native-router-flux";
import HomeScreen from "./src/screensTEMP/HomeScreen";
import BusScreen from "./src/screensTEMP/BusScreen";
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
          component={BusScreen}
          hideNavBar
          type="reset"
        />
        <Scene
          key="food_screen"
          component={FoodScreen}
          hideNavBar
          type="reset"
        />
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
        <Scene key="food_list" component={FoodList} hideNavBar />
      </Scene>
    </Router>
  );
};

export default RouterComponent;
