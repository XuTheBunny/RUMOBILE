import { TIME, FIREBASE_LOGIN, COUNTS } from './types';
import firebase from 'firebase';

export const timeAction = date => {
  return {
    type: TIME,
    payload: date,
  };
};

export const loginUser = (email, password) => {
  return dispatch => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(dispatch({ type: FIREBASE_LOGIN, payload: 'successful' }));
  };
};

export const setCounts = counts => {
  return dispatch => {
    dispatch({ type: COUNTS, payload: counts });
  };
};
