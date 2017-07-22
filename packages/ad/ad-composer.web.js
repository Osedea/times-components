import React, { Component } from "react";
import PropTypes from "prop-types";

import AdManager from "./ad-manager";

class AdComposer extends Component {

  componentDidMount() {
    this.props.adManager.getAds();
  }

  componentWillUnmount() {
    this.props.adManager.unregisterAds();
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

AdComposer.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
  adManager: PropTypes.instanceOf(AdManager).isRequired
};

export default AdComposer;
