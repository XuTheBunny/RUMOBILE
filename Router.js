import React from 'react';
import { Scene, Router } from 'react-native-router-flux';
import TabIcon from './src/Components/TabIcon';
import TodayScreen from './src/screens/TodayScreen';
import FavClassScreen from './src/screens/FavClassScreen';
import FavBusScreen from './src/screens/FavBusScreen';
import BusScreen from './src/screens/BusScreen';
import Route from './src/screens/Route';
import Stop from './src/screens/Stop';
import FoodScreen from './src/screens/FoodScreen';
import FoodList from './src/screens/FoodList';
import LinkScreen from './src/screens/LinkScreen';
import MoreScreen from './src/screens/MoreScreen';
import SubjectsScreen from './src/screens/SubjectsScreen';
import CoursesScreen from './src/screens/CoursesScreen';
import SectionsScreen from './src/screens/SectionsScreen';
import SectionDetailScreen from './src/screens/SectionDetailScreen';
import ClassSettingScreen from './src/screens/ClassSettingScreen';

const RouterComponent = () => {
  return (
    <Router>
      <Scene key="root" hideNavBar>
        <Scene key="tabbar" tabs={true} activeTintColor="rgb(237,69,69)">
          <Scene key="today" title="Today" icon={TabIcon} modal={true}>
            <Scene key="today_screen" component={TodayScreen} hideNavBar />
            <Scene key="favClass_screen" component={FavClassScreen} hideNavBar hideTabBar />
            <Scene key="favBus_screen" component={FavBusScreen} hideNavBar hideTabBar />
          </Scene>
          <Scene key="bus" title="Bus" icon={TabIcon}>
            <Scene key="bus_screen" component={BusScreen} hideNavBar />
            <Scene key="stop" component={Stop} hideNavBar />
            <Scene key="route" component={Route} hideNavBar />
          </Scene>
          <Scene key="food" title="Food" icon={TabIcon}>
            <Scene key="food_screen" component={FoodScreen} hideNavBar />
            <Scene key="food_list" component={FoodList} hideNavBar />
          </Scene>
          <Scene key="links" title="Links" icon={TabIcon}>
            <Scene key="links_screen" component={LinkScreen} hideNavBar />
          </Scene>
          <Scene key="more" title="More" icon={TabIcon}>
            <Scene key="more_screen" component={MoreScreen} hideNavBar />
            <Scene key="classSetting_screen" component={ClassSettingScreen} hideNavBar hideTabBar />
            <Scene key="subjects_screen" component={SubjectsScreen} hideNavBar />
            <Scene key="courses_screen" component={CoursesScreen} hideNavBar />
            <Scene key="sections_screen" component={SectionsScreen} hideNavBar />
            <Scene key="section_detail_screen" component={SectionDetailScreen} hideNavBar />
          </Scene>
        </Scene>
      </Scene>
    </Router>
  );
};

export default RouterComponent;
