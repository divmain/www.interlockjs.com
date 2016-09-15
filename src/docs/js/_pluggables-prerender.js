import render from "preact-render-to-string";
import { h } from "preact";

import { HalfSunburst } from "./_half-sunburst";
import loadData from "./_load-data";
import { getArcPath } from "./_math";
import { width, height } from "./_constants";


module.exports = () => loadData().then(rootNode => render(
  <HalfSunburst
    rootNode={rootNode}
    height={height}
    width={width}
    getArcPath={getArcPath}
  />
));
