import { h } from "preact";


export const AddlFeatures = props => {
  const {
    minification,
    setMinification,
    linting,
    setLinting,
    jsx,
    setJsx,
    webpackLoaders,
    setWebpackLoaders,
    browserifyTransforms,
    setBrowserifyTransforms
  } = props;

  return (
    <div className="quick-start-section">
      <div className="prompt">
        Which additional features interest you?
      </div>
      <div className="quick-start-options">
        <input
          type="checkbox"
          checked={minification}
          name="minification"
          id="minification"
          onClick={setMinification}
        />
        <label for="minification">Minification</label>
        <input
          type="checkbox"
          checked={linting}
          name="linting"
          id="linting"
          onClick={setLinting}
        />
        <label for="linting">Linting</label>
        <input
          type="checkbox"
          checked={jsx}
          name="jsx"
          id="jsx"
          onClick={setJsx}
        />
        <label for="jsx">JSX</label>
        <input
          type="checkbox"
          checked={webpackLoaders}
          name="webpackLoaders"
          id="webpackLoaders"
          onClick={setWebpackLoaders}
        />
        <label for="webpackLoaders">Webpack loaders</label>
        <input
          type="checkbox"
          checked={browserifyTransforms}
          name="browserifyTransforms"
          id="browserifyTransforms"
          onClick={setBrowserifyTransforms}
        />
        <label for="browserifyTransforms">Browserify transforms</label>
      </div>
    </div>
  );
};

export const defaults = {
  minification: true,
  linting: true,
  jsx: false,
  webpackLoaders: false,
  browserifyTransforms: false
}
