const path = require("path");
const glob = require("glob");
const jadePlugin = require("./jade-plugin");
const stylusPlugin = require("./stylus-plugin");
const interlockHtml = require("interlock-html");
const interlockCss = require("interlock-css");


const srcRoot = path.resolve(__dirname, "../src");
const destRoot = path.resolve(__dirname, "../dist")

const jsFiles = filterHidden(glob.sync("**/*.js", { cwd: srcRoot }));
const jadeFiles = filterHidden(glob.sync("**/*.jade", { cwd: srcRoot }));
const htmlFiles = filterHidden(glob.sync("**/*.{htm,html}", { cwd: srcRoot }));
const stylusFiles = filterHidden(glob.sync("**/*.styl", { cwd: srcRoot }));
const cssFiles = filterHidden(glob.sync("**/*.css", { cwd: srcRoot }));

const jsEntries = jsFiles.reduce((memo, relPath) => {
  memo[relPath] = relPath;
  return memo;
}, {});
const jadeEntries = jadeFiles.reduce((memo, relPath) => {
  memo[relPath] = relPath.replace(/\.jade$/, ".html");
  return memo;
}, {});
const stylusEntries = stylusFiles.reduce((memo, relPath) => {
  memo[relPath] = relPath.replace(/\.styl$/, ".css");
  return memo;
}, {});
const cssEntries = cssFiles.reduce((memo, relPath) => {
  memo[relPath] = relPath;
  return memo;
}, {});

module.exports = {
  srcRoot,
  destRoot,

  entry: Object.assign({}, jsEntries, jadeEntries, stylusEntries, cssEntries),

  plugins: [
    jadePlugin,
    stylusPlugin,
    interlockHtml(),
    interlockCss()
  ],

  // babelConfig: {
  //   plugins: [require.resolve("./example-plugin")]
  // }
};

function filterHidden (relPaths) {
  return relPaths.filter(relPath => {
    const pathSegments = relPath.split("/");
    return pathSegments.reduce(
      (memo, segment) => memo && segment.indexOf("_") !== 0,
      true
    );
  });
}
