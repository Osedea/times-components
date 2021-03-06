/* eslint-env browser */
import { storiesOf } from "dextrose/storiesOfOverloader";
import React from "react";
import { Platform } from "react-native";

import { ArticleProvider } from "@times-components/provider";
import { MockedProvider } from "@times-components/utils/graphql";
// eslint-disable-next-line import/no-unresolved
import { addTypenameToDocument } from "apollo-utilities";
import { query as articleQuery } from "@times-components/provider/article";
import Article from "./article";

const fullArticleTypenameFixture = require("./fixtures/full-article-typename.json");
const fullArticleFixture = require("./fixtures/full-article.json");
const fullLongArticleFixture = require("./fixtures/full-long-article.json");
const articleFixtureNoStandfirst = require("./fixtures/no-standfirst.json");
const articleFixtureNoLabel = require("./fixtures/no-label.json");
const articleFixtureNoAds = require("./fixtures/no-ads.json");
const articleFixtureNoFlags = require("./fixtures/no-flags.json");
const articleFixtureNoStandfirstNoLabel = require("./fixtures/no-standfirst-no-label.json");
const articleFixtureNoStandfirstNoFlags = require("./fixtures/no-standfirst-no-flags.json");
const articleFixtureNoLabelNoFlags = require("./fixtures/no-label-no-flags.json");
const articleFixtureNoLabelNoFlagsNoStandFirst = require("./fixtures/no-label-no-flags-no-standfirst.json");
const articleFixtureNoLeadAsset = require("./fixtures/no-lead-asset.json");

const mocks = [
  {
    request: {
      query: addTypenameToDocument(articleQuery),
      variables: {
        id: "198c4b2f-ecec-4f34-be53-c89f83bc1b44"
      }
    },
    result: fullArticleTypenameFixture
  }
];

storiesOf("Article", module)
  .add("Default", () => {
    const props = {
      ...fullArticleFixture.data,
      isLoading: false,
      analyticsStream: () => {}
    };

    return <Article {...props} />;
  })
  .add("Long Article", () => {
    const props = {
      ...fullLongArticleFixture.data,
      isLoading: false,
      analyticsStream: () => {}
    };

    return <Article {...props} />;
  })
  .add("Loading", () => {
    const props = {
      analyticsStream: () => {},
      isLoading: true
    };

    return <Article {...props} />;
  })
  .add("Error", () => {
    const props = {
      analyticsStream: () => {},
      error: { message: "An example error." }
    };

    return <Article {...props} />;
  })
  .add("With Provider", () => (
    <MockedProvider mocks={mocks}>
      <ArticleProvider id="198c4b2f-ecec-4f34-be53-c89f83bc1b44">
        {({ article, isLoading, error }) => (
          <Article
            article={article}
            isLoading={isLoading}
            error={error}
            analyticsStream={() => {}}
          />
        )}
      </ArticleProvider>
    </MockedProvider>
  ))
  .add("Fixtures - Full", () => {
    // Hack, render ads inside storybook's iframe
    if (Platform.OS === "web") {
      return (
        <div>
          <a
            href={`/iframe.html${window.top.location.search}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Click to render the ads
          </a>
          <Article {...fullArticleFixture.data} analyticsStream={() => {}} />
        </div>
      );
    }

    return <Article {...fullArticleFixture.data} analyticsStream={() => {}} />;
  })
  .add("Fixtures - No ads", () => (
    <Article {...articleFixtureNoAds.data} analyticsStream={() => {}} />
  ))
  .add("Fixtures - No standfirst", () => (
    <Article {...articleFixtureNoStandfirst.data} analyticsStream={() => {}} />
  ))
  .add("Fixtures - No label", () => (
    <Article {...articleFixtureNoLabel.data} analyticsStream={() => {}} />
  ))
  .add("Fixtures - No flags", () => (
    <Article {...articleFixtureNoFlags.data} analyticsStream={() => {}} />
  ))
  .add("Fixtures - No standfirst, no label", () => (
    <Article
      {...articleFixtureNoStandfirstNoLabel.data}
      analyticsStream={() => {}}
    />
  ))
  .add("Fixtures - No standfirst, no flags", () => (
    <Article
      {...articleFixtureNoStandfirstNoFlags.data}
      analyticsStream={() => {}}
    />
  ))
  .add("Fixtures - No label, no flags", () => (
    <Article
      {...articleFixtureNoLabelNoFlags.data}
      analyticsStream={() => {}}
    />
  ))
  .add("Fixtures - No label, no flags, no standfirst", () => (
    <Article
      {...articleFixtureNoLabelNoFlagsNoStandFirst.data}
      analyticsStream={() => {}}
    />
  ))
  .add("Fixtures - No lead asset", () => (
    <Article {...articleFixtureNoLeadAsset.data} analyticsStream={() => {}} />
  ));
