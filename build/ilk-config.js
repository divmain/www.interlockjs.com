const path = require("path");
const glob = require("glob");
const jadePlugin = require("./jade-plugin");
const interlockHtml = require("interlock-html");


const srcRoot = path.resolve(__dirname, "../src");
const destRoot = path.resolve(__dirname, "../dist")

const jadeFiles = filterHidden(glob.sync("**/*.jade", { cwd: srcRoot }));
const htmlFiles = filterHidden(glob.sync("**/*.{htm,html}", { cwd: srcRoot }));
const cssFiles = filterHidden(glob.sync("**/*.css", { cwd: srcRoot }));

const jadeEntries = jadeFiles.reduce((memo, relPath) => {
  memo[relPath] = relPath.replace(/\.jade$/, ".html");
  return memo;
}, {});


module.exports = {
  srcRoot,
  destRoot,

  entry: Object.assign({}, jadeEntries),

  plugins: [
    jadePlugin,
    interlockHtml({
      filter: /\.(html?)|(jade)$/
    })
  ],

  // babelConfig: {
  //   plugins: [require.resolve("./example-plugin")]
  // }
};

function filterHidden (relPaths) {
  return relPaths.filter(relPath => {
    const pathSegments = relPath.split("/");
    const filename = pathSegments[pathSegments.length - 1];
    return filename.indexOf("_") !== 0;
  });
}
