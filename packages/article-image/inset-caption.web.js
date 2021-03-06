import React from "react";
import { View } from "react-native";
import Caption from "@times-components/caption";
import withResponsiveStyles from "@times-components/responsive-styles";

const InsetCaptionStyle = withResponsiveStyles(View, {
  base: () => "padding-left: 10px;",
  mediumUp: () => "padding-left: 0px;"
});

const InsetCaptiontWeb = props => (
  <InsetCaptionStyle>
    <Caption text={props.caption} credits={props.credits} />
  </InsetCaptionStyle>
);

InsetCaptiontWeb.propTypes = {
  ...Caption.propTypes
};

InsetCaptiontWeb.defaultProps = {
  ...Caption.defaultProps
};

export default InsetCaptiontWeb;
