const jestConfigurator = require("@times-components/jest-configurator");

module.exports = Object.assign(jestConfigurator("article-label", "web"), {
  collectCoverageFrom: [
    "**/packages/article-label/article-label.js",
    "**/packages/article-label/style/*.js",
    "!**/packages/article-label/**/*.android.js"
  ]
});
