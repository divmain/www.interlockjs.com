const path = require("path");
const { generateEntries, generateRawEntries } = require("./helpers");
const jadePlugin = require("./jade-plugin");
const interlockStylus = require("interlock-stylus");
const interlockHtml = require("interlock-html");
const interlockCss = require("interlock-css");
const interlockRaw = require("interlock-raw");
const interlockBabili = require("interlock-babili");


const srcRoot = path.resolve(__dirname, "../src");
const destRoot = path.resolve(__dirname, "../dist")

const excludeFromRaw = ["js", "jade", "html", "styl", "css"];


module.exports = {
  srcRoot,
  destRoot,

  entry: Object.assign(
    {},
    generateEntries(srcRoot, "js", null),
    generateEntries(srcRoot, "html", null),
    generateEntries(srcRoot, "jade", "html"),
    generateEntries(srcRoot, "styl", "css"),
    generateEntries(srcRoot, "css", null),
    generateRawEntries(srcRoot, excludeFromRaw)
  ),

  plugins: [
    jadePlugin,
    interlockStylus(),
    interlockHtml(),
    interlockCss(),
    interlockRaw({ exclude: excludeFromRaw }),
    interlockBabili()
  ]
};
