import axios from 'axios';
import { CLASS_LIST, CLASS_LIST_DATA_HERE } from './types';
import { ALL_CLASS } from '../../class-backup.json';

export const getAllClass = (stage, classSetting) => {
  if (stage == 'clean') {
    return dispatch => {
      dispatch({ type: CLASS_LIST, payload: [] });
      dispatch({ type: CLASS_LIST_DATA_HERE, payload: 'no' });
    };
  }
  const base_url = 'http://sis.rutgers.edu/oldsoc/';
  const all_class_url =
    base_url +
    'subjects.json?semester=' +
    classSetting.semester +
    '&campus=' +
    classSetting.campus +
    '&level=' +
    classSetting.level;

  const reformatData = rawClassList => {
    const initSections = [
      { title: 'A', data: [] },
      { title: 'B', data: [] },
      { title: 'C', data: [] },
      { title: 'D', data: [] },
      { title: 'E', data: [] },
      { title: 'F', data: [] },
      { title: 'G', data: [] },
      { title: 'H', data: [] },
      { title: 'I', data: [] },
      { title: 'J', data: [] },
      { title: 'K', data: [] },
      { title: 'L', data: [] },
      { title: 'M', data: [] },
      { title: 'N', data: [] },
      { title: 'O', data: [] },
      { title: 'P', data: [] },
      { title: 'Q', data: [] },
      { title: 'R', data: [] },
      { title: 'S', data: [] },
      { title: 'T', data: [] },
      { title: 'U', data: [] },
      { title: 'V', data: [] },
      { title: 'W', data: [] },
      { title: 'X', data: [] },
      { title: 'Y', data: [] },
      { title: 'Z', data: [] },
    ];
    const sortedList = rawClassList.sort((a, b) =>
      a.description > b.description ? 1 : b.description > a.description ? -1 : 0,
    );
    for (e in sortedList) {
      initSections
        .find(obj => obj.title == sortedList[e].description.charAt(0))
        .data.push(sortedList[e].description + ' (' + sortedList[e].code + ')');
    }
    return initSections;
  };

  return dispatch => {
    axios
      .get(all_class_url)
      .then(response => {
        if (response.status == 200) {
          if (response.data.length > 0) {
            allClass = reformatData(response.data);
          } else {
            allClass = [];
          }
        } else {
          console.log(response);
        }
        dispatch({ type: CLASS_LIST, payload: allClass });
        dispatch({ type: CLASS_LIST_DATA_HERE, payload: 'here' });
      })
      .catch(function(error) {
        console.log(error);
        dispatch({ type: CLASS_LIST, payload: [] });
        dispatch({ type: CLASS_LIST_DATA_HERE, payload: 'no' });
      });
  };
};
