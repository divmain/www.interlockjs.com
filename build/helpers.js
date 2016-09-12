const glob = require("glob");


const includes = (arr, match) => arr.reduce((memo, el) => memo || el === match, false);


const filterHidden = relPaths => relPaths.filter(relPath => {
  const pathSegments = relPath.split("/");
  return pathSegments.reduce(
    (memo, segment) => memo && segment.indexOf("_") !== 0,
    true
  );
});

exports.generateEntries = (srcRoot, inputExt, outputExt) => {
  const files = filterHidden(glob.sync(`**/*.${inputExt}`, {
    cwd: srcRoot,
    nodir: true
  }));
  const inputMatcher = RegExp(`\.${inputExt}$`);

  return files.reduce((memo, relPath) => {
    memo[relPath] = outputExt ?
      relPath.replace(inputMatcher, `.${outputExt}`) :
      relPath;
    return memo;
  }, {});
};

exports.generateRawEntries = (srcRoot, excludeExts) => {
  const allFiles = glob.sync("**/*", {
    cwd: srcRoot,
    nodir: true
  });
  const rawFiles = allFiles.filter(filePath => {
    const dotSegments = filePath.split(/\.|\//);
    const extension = dotSegments[dotSegments.length - 1];
    return !includes(excludeExts, extension);
  });
  const unhiddenRawFiles = filterHidden(rawFiles);

  return unhiddenRawFiles.reduce((memo, relPath) => {
    memo[relPath] = relPath;
    return memo;
  }, {});
};
