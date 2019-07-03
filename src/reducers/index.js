import { combineReducers } from 'redux';
import HomeReducer from './HomeReducer';
import FoodReducer from './FoodReducer';
import BusReducer from './BusReducer';
import LinkReducer from './LinkReducer';
import ClassReducer from './ClassReducer';
import FavoritesReducer from './FavoritesReducer';

export default combineReducers({
  home: HomeReducer,
  food: FoodReducer,
  bus: BusReducer,
  link: LinkReducer,
  class: ClassReducer,
  favorite: FavoritesReducer,
});
