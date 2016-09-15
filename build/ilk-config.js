const path = require("path");
const staticSiteConfig = require("interlock-static-site-config");

// These two are required for pre-rendering the interactive docs...
require("babel-register");
global.fetch = require("node-fetch");


const srcRoot = path.resolve(__dirname, "../src");
const destRoot = path.resolve(__dirname, "../dist")


const { entry, plugins } = staticSiteConfig({
  srcRoot,
  pug: "jade",
  stylus: "styl",
  autoprefixer: true,
  minify: true
});


const PreRenderPlugin = () => {
  return (override, transform) => {
    transform("transformModule", module => {
      if (module.type !== "html") { return module; }

      const { $ } = module;
      const moduleDir = path.dirname(module.path);
      const preRenderEls = $("PreRender");
      const preRenderSrcs = preRenderEls
        .map((idx, el) => $(el).attr("src"))
        .get()
        .map(relPath => path.resolve(moduleDir, relPath));

      return Promise.all(preRenderSrcs.map(srcPath => require(srcPath)()))
        .then(htmlSegments => {
          preRenderEls.each((idx, el) => {
            $(el).replaceWith($(htmlSegments[idx]));
          });
          return module;
        });
    });
  };
};


module.exports = {
  srcRoot,
  destRoot,
  entry,
  plugins: [
    ...plugins,
    PreRenderPlugin()
  ]
};


