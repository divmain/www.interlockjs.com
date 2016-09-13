import { interpolate } from "d3-interpolate";

import { xScale, yScale, getArcPath } from "./_math";
import { radius } from "./_constants";


exports.arcTween = d => {
  const xd = interpolate(xScale.domain(), [d.x0, d.x1]);
  const yd = interpolate(yScale.domain(), [d.y0, 1]);
  const yr = interpolate(yScale.range(), [d.y0 ? 20 : 0, radius]);

  return (d, i) => i ?
    () => getArcPath(d) :
    t => {
      xScale.domain(xd(t));
      yScale.domain(yd(t)).range(yr(t));
      return getArcPath(d);
    };
};
