import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { View, Text, TouchableWithoutFeedback, Image } from 'react-native';
import BackHeader from '../Components/BackHeader';
import BottomBar from '../Components/BottomBar';
// import { getBusStops } from "../actions";

class Stop extends Component {
  // componentWillMount() {
  //   console.log(this.props)
  // }
  render() {
    return (
      <View style={styles.home}>
      <BackHeader
        text={'Bus'}
      />
        <BottomBar hs={true} bus={false} fs={true} ls={true} mr={true}/>
      </View>
    );
  }
}

const styles = {
  home: {
    flex: 1,
    backgroundColor: 'rgb(255, 255, 255)'
  },
};


// const mapStateToProps = state => {
//   return {
//     nearby: state.bus.nb_data,
//     all: state.bus.all_data,
//     check: state.bus.data_here
//   };
// };

// export default connect(
//   mapStateToProps,
//   { getBusStops }
// )(Stop);



