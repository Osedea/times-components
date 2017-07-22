/* eslint-env browser */
import React from "react";
import { storiesOf } from "@storybook/react-native";

import Ad, { AdComposer, AdManager } from "./ad.web";

const adManager = new AdManager({section: 'article'});

export default () =>
  storiesOf("Ad", module).add("render two ads in article page", () => (
    // Hack, gpt map sizes don't seem to work inside iframes as such this is a
    // temporary fix, while waiting for https://github.com/storybooks/storybook/issues/862

    <div>
      <a
        href={`/iframe.html${window.top.location.search}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Render ads
      </a>
      <AdComposer section="article" adManager={adManager}>
        <Ad code="ad-header" adManager={adManager} />
        <Ad code="intervention" adManager={adManager} />
      </AdComposer>
    </div>
  ));
