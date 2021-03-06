/* eslint-env jest */

import React from "react";
import renderer from "react-test-renderer";
import { MockedProvider } from "@times-components/utils/graphql";
// eslint-disable-next-line import/no-unresolved
import { addTypenameToDocument } from "apollo-utilities";
import { ArticleProvider } from "../provider";
import { query as articleQuery } from "../article";
import fixture from "../fixtures/article.json";

const mocks = [
  {
    request: {
      query: addTypenameToDocument(articleQuery)
    },
    result: fixture
  }
];

const renderComponent = child =>
  renderer.create(
    <MockedProvider mocks={mocks}>
      <ArticleProvider id="3107c018-cb60-11e4-81dd-064fe933cd41">
        {child}
      </ArticleProvider>
    </MockedProvider>
  );

it("returns query result", done => {
  renderComponent(({ isLoading, article }) => {
    if (!isLoading) {
      expect(article).toMatchSnapshot();
      done();
    }

    return null;
  });
});
