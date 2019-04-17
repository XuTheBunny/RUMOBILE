import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Text } from "react-native";
import ActiveItem from "./ActiveItem";
import Loading from "./Loading";

class ActiveList extends Component {
  renderList() {
    if (this.props.check == "here") {
      return this.props.ad.map(route => (
        <ActiveItem key={route} route={route} />
      ));
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
    ad: state.bus.active_data,
    check: state.bus.data_here
  };
};

export default connect(
  mapStateToProps,
  {}
)(ActiveList);
