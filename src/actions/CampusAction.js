import axios from 'axios';
import { CAMPUS } from './types';

export const setCampus = campus => {
  return dispatch => {
    dispatch({ type: CAMPUS, payload: campus });
  };
};
