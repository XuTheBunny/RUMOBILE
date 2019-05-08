import {
  NEARBYBUS,
  ALLBUS,
  ACTIVEROUTES,
  INACTIVEROUTES,
  BUS_DATA_HERE,
  PREDICTION,
  PREDICTION_DATA_HERE,
  CAMPUS,
} from '../actions/types';

const INITIAL_STATE = {
  nb_data: [],
  all_data: [],
  active_data: [],
  inactive_data: [],
  data_here: 'no',
  prediction: [],
  has_prediction: 'no',
  campus: 'newBrunswick',
};

export default (state = INITIAL_STATE, action) => {
  console.log(action);
  switch (action.type) {
    case NEARBYBUS:
      return { ...state, nb_data: action.payload };
    case ALLBUS:
      return { ...state, all_data: action.payload };
    case ACTIVEROUTES:
      return { ...state, active_data: action.payload };
    case INACTIVEROUTES:
      return { ...state, inactive_data: action.payload };
    case BUS_DATA_HERE:
      return { ...state, data_here: action.payload };
    case PREDICTION:
      return { ...state, prediction: action.payload };
    case PREDICTION_DATA_HERE:
      return { ...state, has_prediction: action.payload };
    case CAMPUS:
      return { ...state, campus: action.payload };
    default:
      return state;
  }
};
