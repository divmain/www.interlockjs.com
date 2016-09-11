const path = require("path");
const fs = require("fs");
const pug = require("pug");
const yaml = require('js-yaml');

const assign = Object.assign;
const isJadeFile = /\.jade$/;

module.exports = (override, transform) => {
  transform("setModuleType", module => {
    return isJadeFile.test(module.path) ?
      assign({}, module, { type: "html" }) :
      module;
  });

  transform("readSource", module => {
    if (!isJadeFile.test(module.path)) {
      return module;
    }

    let locals;
    try {
      const dataPath = path.resolve(module.path, "../_locals.yaml");
      locals = yaml.safeLoad(fs.readFileSync(dataPath, 'utf8'));
    } catch (err) {
      locals = {}
    }

    assign(locals, {
      filename: module.path,
      nsPath: module.nsPath
    });

    const html = pug.render(module.rawSource, locals);

    return assign({}, module, { rawSource: html });
  });
};
