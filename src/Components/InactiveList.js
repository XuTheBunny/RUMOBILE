import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import ActiveItem from './ActiveItem';
import Loading from './Loading';

class InactiveList extends Component {
  renderList() {
    if (this.props.check == 'here') {
      return this.props.ad.map(route => <ActiveItem key={route.rid} route={route} />);
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
    ad: state.bus.inactive_data,
    check: state.bus.data_here,
  };
};

export default connect(
  mapStateToProps,
  {},
)(InactiveList);
