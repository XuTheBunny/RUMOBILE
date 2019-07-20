import {
  CLASS,
  CLASS_DATA_HERE,
  CLASS_LIST,
  CLASS_LIST_DATA_HERE,
  CLASS_SETTING,
} from '../actions/types';

const INITIAL_STATE = {
  class_setting: {
    semester: ['92019'],
    campus: ['NB'],
    level: ['U'],
  },
  class_list: [],
  class: [],
  class_list_data_here: 'no',
  class_data_here: 'no',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CLASS_SETTING:
      return { ...state, class_setting: action.payload };
    case CLASS:
      return { ...state, class: action.payload };
    case CLASS_DATA_HERE:
      return { ...state, class_data_here: action.payload };
    case CLASS_LIST:
      return { ...state, class_list: action.payload };
    case CLASS_LIST_DATA_HERE:
      return { ...state, class_list_data_here: action.payload };
    default:
      return state;
  }
};
