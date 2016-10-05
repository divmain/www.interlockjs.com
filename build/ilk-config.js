const path = require("path");

const staticSiteConfig = require("interlock-static-site-config");
const htmlPrerender = require("interlock-html-prerender");
const appcache = require("interlock-appcache");

const buildIndex = require("./build-index");
const buildPluginDocs = require("./build-plugin-docs");


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
    buildIndex({
      dest: "site-index.json"
    }),
    appcache({
      exclude: [
        /\bwww\.google-analytics\.com\b/
      ],
      // Google Fonts APIs will return CSS that references these files.
      include: [
        "http://fonts.gstatic.com/s/lato/v11/22JRxvfANxSmnAhzbFH8PgLUuEpTyoUstqEm5AMlJo4.woff2",
        "http://fonts.gstatic.com/s/alegreyasanssc/v3/AjAmkoP1y0Vaad0UPPR463fFwosrDvhZ0KqLfsf2vpo.woff2",
        "http://fonts.gstatic.com/s/lato/v11/MDadn8DQ_3oT6kvnUq_2r_esZW2xOQ-xsNqO47m55DA.woff2",
        "http://fonts.gstatic.com/s/lato/v11/MgNNr5y1C_tIEuLEmicLmwLUuEpTyoUstqEm5AMlJo4.woff2",
        "http://fonts.gstatic.com/s/sourcecodepro/v6/mrl8jkM18OlOQN8JLgasD5bPFduIYtoLzwST68uhz_Y.woff2"
      ],
      strip: /(\bindex)?(\.html?)$/
    }),
    buildPluginDocs(),
    ...plugins
  ]
};
