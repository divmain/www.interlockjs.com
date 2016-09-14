const path = require("path");
const fs = require("fs");
const yaml = require("js-yaml");

const { generateEntries, generateRawEntries } = require("./helpers");
const interlockPug = require("interlock-pug");
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
    interlockPug({
      filter: /\.jade$/,
      getLocals: module => {
        try {
          const dataPath = path.resolve(module.path, "../_locals.yaml");
          return yaml.safeLoad(fs.readFileSync(dataPath, 'utf8'));
        } catch (err) {
          return {};
        }
      }
    }),
    interlockStylus(),
    interlockHtml(),
    interlockCss(),
    interlockRaw({ exclude: excludeFromRaw }),
    interlockBabili()
  ]
};
