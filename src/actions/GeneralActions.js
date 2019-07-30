import { TIME, COUNTS, INTERNET } from './types';

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
