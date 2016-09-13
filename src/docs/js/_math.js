import { scaleLinear, scalePow } from "d3-scale";
import { arc } from "d3-shape";

import { radius } from "./_constants";


export const xScale = scaleLinear()
  .range([0, Math.PI]);

export const yScale = scalePow()
  .exponent(0.7)
  .range([0, radius]);

export const getArcPath = arc()
  .startAngle(d =>
    (Math.PI / 2) - Math.max(0, Math.min(2 * Math.PI, xScale(d.x0)))
  )
  .endAngle(d =>
    (Math.PI / 2) - Math.max(0, Math.min(2 * Math.PI, xScale(d.x1)))
  )
  .innerRadius(d => Math.max(0, yScale(d.y0)))
  .outerRadius(d => Math.max(0, yScale(d.y1)));
