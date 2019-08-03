import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import NearbyItem from './NearbyItem';
import Loading from './Loading';

class AllList extends Component {
  renderList() {
    if (this.props.check == 'here') {
      return this.props.all
        .sort((a, b) => (a.sname > b.sname ? 1 : b.sname > a.sname ? -1 : 0))
        .map(stop => <NearbyItem stop={stop} key={stop.sid} />);
    } else {
      return <Loading />;
    }
  }

  render() {
    return <View>{this.renderList()}</View>;
  }
}

const styles = {};

const mapStateToProps = state => {
  return {
    all: state.bus.all_data,
    check: state.bus.data_here,
  };
};

export default connect(
  mapStateToProps,
  {},
)(AllList);
