const path = require("path");
const glob = require("glob");
const { generateEntries, generateRawEntries } = require("./helpers");
const jadePlugin = require("./jade-plugin");
const stylusPlugin = require("./stylus-plugin");
const interlockHtml = require("interlock-html");
const interlockCss = require("interlock-css");
const interlockRaw = require("interlock-raw");


const srcRoot = path.resolve(__dirname, "../src");
const destRoot = path.resolve(__dirname, "../dist")

const excludeFromRaw = ["js", "jade", "html", "styl", "css"];

const jsEntries = generateEntries(srcRoot, "js", null);
const jadeEntries = generateEntries(srcRoot, "jade", "html");
const htmlEntries = generateEntries(srcRoot, "html", null);
const stylusEntries = generateEntries(srcRoot, "styl", "css");
const cssEntries = generateEntries(srcRoot, "css", null);
const rawEntries = generateRawEntries(srcRoot, excludeFromRaw);


module.exports = {
  srcRoot,
  destRoot,

  entry: Object.assign(
    {},
    jsEntries,
    htmlEntries,
    jadeEntries,
    stylusEntries,
    cssEntries,
    rawEntries
  ),

  plugins: [
    jadePlugin,
    stylusPlugin,
    interlockHtml(),
    interlockCss(),
    interlockRaw({ exclude: excludeFromRaw })
  ]
};
