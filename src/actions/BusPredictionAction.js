import axios from 'axios';
import {
  PREDICTION,
  PREDICTION_DATA_HERE,
  TODAY_PREDICTION,
  TODAY_PREDICTION_DATA_HERE,
} from './types';
import { API_KEY } from '../../env.json';

export const getPrediction = (rid, sid, today) => {
  if (rid == 'clean') {
    return dispatch => {
      if (today) {
        dispatch({ type: TODAY_PREDICTION, payload: [] });
        dispatch({ type: TODAY_PREDICTION_DATA_HERE, payload: 'no' });
      } else {
        dispatch({ type: PREDICTION, payload: [] });
        dispatch({ type: PREDICTION_DATA_HERE, payload: 'no' });
      }
    };
  }
  const agency_id = '1323';
  const base_url = 'https://transloc-api-1-2.p.rapidapi.com/';
  const prediction_url =
    base_url +
    'arrival-estimates.json?routes=' +
    rid.join('%2C') +
    '&stops=' +
    sid.join('%2C') +
    '&agencies=' +
    agency_id;
  return dispatch => {
    axios({
      method: 'get',
      url: prediction_url,
      headers: {
        Accept: 'application/json',
        'X-Mashape-Key': API_KEY,
      },
    })
      .then(response => {
        prediction = response.data.data;
        if (today) {
          dispatch({ type: TODAY_PREDICTION, payload: prediction });
          dispatch({ type: TODAY_PREDICTION_DATA_HERE, payload: 'here' });
        } else {
          dispatch({ type: PREDICTION, payload: prediction });
          dispatch({ type: PREDICTION_DATA_HERE, payload: 'here' });
        }
      })
      .catch(function(error) {
        console.log(error);
        dispatch({ type: TODAY_PREDICTION, payload: [] });
        dispatch({ type: TODAY_PREDICTION_DATA_HERE, payload: 'no' });
      });
  };
};
