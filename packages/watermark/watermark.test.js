/* eslint-env jest */

import "react-native";
import React from "react";
import renderer from "react-test-renderer";
import Watermark from "./watermark";

it("renders correctly", () => {
  const tree = renderer.create(<Watermark width={300} height={250} />).toJSON();

  expect(tree).toMatchSnapshot();
});
