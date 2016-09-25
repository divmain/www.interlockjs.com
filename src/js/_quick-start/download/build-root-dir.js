// nodeProject
// browserProject

// esnext
// css
// stylus
// html
// json
// raw

// minification
// linting
// jsx
// webpackLoaders
// browserifyTransforms

// srcLocation
// destLocation
// projectName

const packageJson = ({
  projectName,
  destLocation,
  browserProject,
  nodeProject,

  linting,
  esnext,
  jsx,
  minification,
  css,
  html,
  json,
  raw,
  stylus,

  browserifyTransforms,
  webpackLoaders
}) => JSON.stringify({
  "name": projectName,
  "version": "1.0.0",
  "description": "",
  "main": `${destLocation}index.js`,
  "scripts": {
    "build": "ilk build -c ./ilk-config.js",
    "dev": browserProject ?
      "open http://localhost:1337 & ilk server -c ./ilk-config.js" :
      undefined,
    "test": "echo 'WARNING: No tests provided'",
  },
  "devDependencies": {
    "@divmain/eslint-config-defaults": linting ? "^10.0.0" : undefined,
    "babel-eslint": "^6.1.2",
    "babel-preset-latest": esnext ? "^6.14.0" : undefined,
    "babel-preset-react": jsx ? "^6.11.1" : undefined,
    "eslint": linting ? "^3.6.0" : undefined,
    "eslint-plugin-filenames": linting ? "^0.2.0" : undefined,
    "interlock": "^0.10.5",
    "interlock-babili": minification ? "^0.2.1" : undefined,
    "interlock-browserify-transforms": browserifyTransforms ? "^0.1.0" : undefined,
    "interlock-css": css ? "^0.1.0" : undefined,
    "interlock-html": html ? "^0.1.1" : undefined,
    "interlock-json": json ? "^0.1.0" : undefined,
    "interlock-node": nodeProject ? "0.1.0" : undefined,
    "interlock-raw": raw ? "^0.1.3" : undefined,
    "interlock-stylus": stylus ? "^0.1.1" : undefined,
    "interlock-webpack-loaders": webpackLoaders ? "^0.1.0" : undefined
  }
}, null, 2);


const babelrc = ({
  esnext,
  jsx
}) => JSON.stringify({
  "presets": [
    esnext ? "latest" : undefined,
    jsx ? "react" : undefined
  ]
}, null, 2);


const eslintrc = ({
  esnext,
  jsx
}) => JSON.stringify({
  "parser": "babel-eslint",
  "extends": [
    "@divmain/eslint-config-defaults/configurations/walmart/es6-node",
    jsx ? "@divmain/eslint-config-defaults/configurations/walmart/es6-react" : null
  ].filter(x => x)
}, null, 2);


export default (tarFile, props) => {
  tarFile.addFile("package.json", packageJson(props));
  if (props.esnext || props.jsx) {
    tarFile.addFile(".babelrc", babelrc(props));
  }
  if (props.linting) {
    tarFile.addFile(".eslintrc.json", eslintrc(props));
    tarFile.addFile(".eslintignore", props.destLocation);
  }
};
