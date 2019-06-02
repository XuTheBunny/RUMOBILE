import axios from 'axios';
import { CLASS_SETTING } from './types';

export const setClass = classSettingObj => {
  return dispatch => {
    dispatch({ type: CLASS_SETTING, payload: classSettingObj });
  };
};
