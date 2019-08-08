import { TIME, COUNTS, INTERNET, BUS_SCREEN_OPENED } from './types';

export const timeAction = date => {
  return {
    type: TIME,
    payload: date,
  };
};

export const setCounts = counts => {
  return dispatch => {
    dispatch({ type: COUNTS, payload: counts });
  };
};

export const hasInternet = internet => {
  return dispatch => {
    dispatch({ type: INTERNET, payload: internet });
  };
};

export const busOpenedId = id => {
  return dispatch => {
    dispatch({ type: BUS_SCREEN_OPENED, payload: id });
  };
};
