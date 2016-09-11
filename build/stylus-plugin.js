const stylus = require("stylus");

const assign = Object.assign;
const isStylusFile = /\.styl$/;

module.exports = (override, transform) => {
  transform("setModuleType", module => {
    return isStylusFile.test(module.path) ?
      assign({}, module, { type: "css" }) :
      module;
  });

  transform("readSource", module => {
    if (!isStylusFile.test(module.path)) {
      return module;
    }

    return new Promise((resolve, reject) => {
      stylus.render(
        module.rawSource,
        { filename: module.path },
        (err, css) => err ?
          reject(err) :
          resolve(assign({}, module, { rawSource: css }))
      );
    });
  });
};
