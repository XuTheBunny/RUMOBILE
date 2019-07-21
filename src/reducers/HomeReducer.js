import { FIREBASE_LOGIN, BANNER_PULL, HOME_DATE, TIME, COUNTS } from '../actions/types';

const INITIAL_STATE = {
  login: '',
  banner: 'Welcome to RUMobile 🐻',
  time: [],
  dateText: '',
  counts: 0,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FIREBASE_LOGIN:
      return { ...state, login: action.payload };
    case BANNER_PULL:
      return { ...state, banner: action.payload };
    case TIME:
      return { ...state, time: action.payload };
    case HOME_DATE:
      return { ...state, dateText: action.payload };
    case COUNTS:
      return { ...state, counts: state.counts * action.payload + action.payload };
    default:
      return state;
  }
};
