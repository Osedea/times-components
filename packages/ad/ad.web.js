import React, { Component } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import PropTypes from "prop-types";

import AdComposer from "./ad-composer";
import AdManager from "./ad-manager";
import { getSlotConfig } from "./generate-config";

const getStyles = config =>
  StyleSheet.create({
    container: {
      backgroundColor: "#f1f1f1",
      height: config.maxHeight
    }
  });

class Ad extends Component {
  constructor(props) {
    super(props);
    const { width } = Dimensions.get("window");
    this.config = getSlotConfig(
      this.props.adManager.section,
      this.props.code,
      width
    );
    this.state = { width };
    this.handleLayout = this.handleLayout.bind(this);
  }

  componentDidMount() {
    this.props.adManager.registerAd(this.config);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.width !== nextState.width;
  }

  componentWillUpdate(nextProps, nextState) {
    const adManager = nextProps.adManager;
    this.config = getSlotConfig(
      this.props.adManager.section,
      this.props.code,
      nextState.width
    );
    adManager.unregisterAds([nextProps.code])
      .then(adManager.registerAd.bind(adManager, this.config))
      .then(adManager.getAds.bind(adManager));
  }

  componentWillUnmount() {
    this.props.adManager.unregisterAds([this.props.code]);
  }

  handleLayout(event, callback) {
    const { width } = Dimensions.get("window");
    this.setState({ width }, callback);
  }

  render() {
    const styles = getStyles(this.config);
    return (
      <View
        id={this.props.code}
        onLayout={this.handleLayout}
        style={styles.container}
      />
    );
  }
}

Ad.propTypes = {
  code: PropTypes.string.isRequired,
  adManager: PropTypes.instanceOf(AdManager).isRequired
};

export default Ad;

export { AdComposer, AdManager };
