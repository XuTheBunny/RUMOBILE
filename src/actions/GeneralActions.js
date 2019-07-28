import { TIME, FIREBASE_LOGIN, COUNTS, INTERNET } from './types';
import firebase from 'firebase';

export const timeAction = date => {
  return {
    type: TIME,
    payload: date,
  };
};

export const loginUser = (email, password) => {
  return dispatch => {
    try {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(dispatch({ type: FIREBASE_LOGIN, payload: 'successful' }));
    } catch (error) {
      console.log(error);
      dispatch({ type: FIREBASE_LOGIN, payload: '' });
    }
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
