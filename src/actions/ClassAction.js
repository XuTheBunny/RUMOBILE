import axios from 'axios';
import { CLASS, CLASS_DATA_HERE } from './types';

export const getOneClass = (classCode, classSetting) => {
  if (classCode == 'clean') {
    return dispatch => {
      dispatch({ type: CLASS, payload: [] });
      dispatch({ type: CLASS_DATA_HERE, payload: 'no' });
    };
  }
  const base_url = 'http://sis.rutgers.edu/oldsoc/';
  const one_class_url =
    base_url +
    'courses.json?subject=' +
    classCode +
    '&semester=' +
    classSetting.semester +
    '&campus=' +
    classSetting.campus +
    '&level=' +
    classSetting.level;

  weekName = {
    M: ['Monday', 'B'],
    T: ['Tuesday', 'C'],
    W: ['Wednesday', 'D'],
    TH: ['Thursday', 'E'],
    F: ['Friday', 'F'],
    S: ['Saturday', 'G'],
    U: ['Sunday', 'H'],
  };

  ampm = { A: ' AM', P: ' PM' };

  const formTime = t => {
    const time = t.substring(0, 2) + ':' + t.substring(2, t.length);
    if (time[0] == '0') {
      return time.slice(1);
    } else {
      return time;
    }
  };

  const formInstructors = instructors => {
    const instructorList = [];
    if (instructors && instructors.length > 0) {
      for (r in instructors) {
        instructorList.push(instructors[r].name);
      }
      return instructorList.join('; ');
    } else {
      return '';
    }
  };

  const uniqByKey = array => {
    var index = [];
    return array.filter(function(item) {
      var k = item.key;
      return index.indexOf(k) >= 0 ? false : index.push(k);
    });
  };

  const formSection = sectionsData => {
    var obj = { title: {}, data: [] };
    obj.key = sectionsData.number;
    obj.title.openStatus = sectionsData.openStatus;
    obj.title.number = sectionsData.number;
    obj.title.index = sectionsData.index;
    obj.title.sectionNotes = sectionsData.sectionNotes;
    obj.title.instructors = formInstructors(sectionsData.instructors);
    for (m in sectionsData.meetingTimes) {
      obj.data.push(formSectionMeeting(sectionsData.meetingTimes[m]));
    }
    obj.data.sort((a, b) => (a.w > b.w ? 1 : b.w > a.w ? -1 : 0));
    return obj;
  };

  const formSectionMeeting = meetingTime => {
    const meeting = {};
    meeting.day = meetingTime.meetingDay ? this.weekName[meetingTime.meetingDay][0] : '';
    meeting.w = meetingTime.meetingDay ? this.weekName[meetingTime.meetingDay][1] : 'A';
    meeting.building = meetingTime.buildingCode;
    meeting.campus = meetingTime.campusName;
    meeting.room = 'Room ' + meetingTime.roomNumber;
    if (meetingTime.startTime && meetingTime.endTime && meetingTime.pmCode) {
      meeting.startTime = formTime(meetingTime.startTime);
      meeting.endTime = formTime(meetingTime.endTime);
      meeting.pmCode = ampm[meetingTime.pmCode];
    } else {
      meeting.startTime = '';
      meeting.endTime = '';
      meeting.pmCode = '';
    }

    meeting.key = meeting.w + meeting.startTime;
    if (meetingTime.campusAbbrev) {
      const a = meetingTime.campusAbbrev || '';
      const b = meetingTime.buildingCode || '';
      const c = meetingTime.roomNumber || '';
      meeting.place = a + ' ' + b + ' ' + c;
    }
    if (meeting.day.length == 0) {
      meeting.place = 'Independent Study';
    }
    return meeting;
  };

  return dispatch => {
    axios
      .get(one_class_url)
      .then(response => {
        oneClass = response.data;
        var courseList = [];
        for (c in oneClass) {
          var course = {};
          course.key = oneClass[c].courseNumber;
          course.title = oneClass[c].title;
          course.courseNumber = oneClass[c].courseNumber;
          course.title = oneClass[c].title;
          course.credits = oneClass[c].credits;
          course.sections = [];
          if (oneClass[c].sections && oneClass[c].sections.length > 0) {
            course.opens = oneClass[c].sections.filter(s => s.openStatus).length;
            course.all = oneClass[c].sections.length;
            for (s in oneClass[c].sections) {
              course.sections.push(formSection(oneClass[c].sections[s]));
            }
          }
          courseList.push(course);
        }
        dispatch({ type: CLASS, payload: uniqByKey(courseList) });
        dispatch({ type: CLASS_DATA_HERE, payload: 'here' });
      })
      .catch(function(error) {
        console.log(error);
        dispatch({ type: CLASS, payload: [] });
        dispatch({ type: CLASS_DATA_HERE, payload: 'no' });
      });
  };
};
