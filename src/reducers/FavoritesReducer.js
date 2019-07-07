import {
  ADD_FAVORITE_BUS,
  DELETE_FAVORITE_BUS,
  ADD_FAVORITE_CLASS,
  DELETE_FAVORITE_CLASS,
} from '../actions/types';

const INITIAL_STATE = { bus_favorites: new Array(), class_favorites: new Array() };

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_FAVORITE_BUS:
      return { ...state, bus_favorites: [...state.bus_favorites, action.payload] };
    case DELETE_FAVORITE_BUS:
      return {
        ...state,
        bus_favorites: state.bus_favorites.filter(item => action.payload !== item),
      };
    case ADD_FAVORITE_CLASS:
      return { ...state, class_favorites: [...state.class_favorites, action.payload] };
    case DELETE_FAVORITE_CLASS:
      return {
        ...state,
        class_favorites: state.class_favorites.filter(
          item => action.payload.classId !== item.classId,
        ),
      };
    default:
      return state;
  }
};
