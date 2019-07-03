import {
  ADD_FAVORITE_BUS,
  DELETE_FAVORITE_BUS,
  ADD_FAVORITE_CLASS,
  DELETE_FAVORITE_CLASS,
} from './types';

export const addFavoriteBus = (val) => {
  return (dispatch) => {
    dispatch({ type: ADD_FAVORITE_BUS, payload: val });
  }
}

export const deleteFavoriteBus = (val) => {
  return (dispatch) => {
    dispatch({ type: DELETE_FAVORITE_BUS, payload: val });
  }
}

export const addFavoriteClass = (val) => {
  return (dispatch) => {
    dispatch({ type: ADD_FAVORITE_CLASS, payload: val });
  }
}

export const deleteFavoriteClass = (val) => {
  return (dispatch) => {
    dispatch({ type: DELETE_FAVORITE_CLASS, payload: val });
  }
}
