import { CAMPUS } from './types';

export const setCampus = campus => {
  return dispatch => {
    dispatch({ type: CAMPUS, payload: campus });
  };
};
