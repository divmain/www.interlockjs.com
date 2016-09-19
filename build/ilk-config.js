const path = require("path");
const staticSiteConfig = require("interlock-static-site-config");
const htmlPrerender = require("interlock-html-prerender");


const srcRoot = path.resolve(__dirname, "../src");
const destRoot = path.resolve(__dirname, "../dist")

const { entry, plugins } = staticSiteConfig({
  srcRoot,
  pug: "jade",
  stylus: "styl",
  autoprefixer: true,
  minify: true
});


module.exports = {
  srcRoot,
  destRoot,
  entry,
  plugins: [
    htmlPrerender(),
    ...plugins
  ]
};
