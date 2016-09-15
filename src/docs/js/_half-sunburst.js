import { h, Component } from 'preact';
import { partition } from "d3-hierarchy";

import { getColor } from "./_colors";


const HalfSunburst = exports.HalfSunburst = (props = {}) => {
  const {
    width,
    height,
    rootNode,
    getArcPath,
    onClick
  } = props;

  const data = partition()(rootNode).descendants();

  return (
    <svg width={width} height={height} viewbox={`0 0 ${width} ${height}`}>
      <g transform={`translate(${width / 2},${height})`}>
        <Border radius={height - 1} />
        {data.map(datum =>
          <Arc
            datum={datum}
            onClick={onClick}
            getArcPath={getArcPath}
          />
        )}
      </g>
    </svg>
  );
};

const Border = (props = {}) => {
  const { radius } = props;

  const style = {
    fill: "none",
    "stroke-width": "1",
    stroke: "#121212",
    "stroke-dasharray": "2,6"
  };

  return (
    <circle r={radius} style={style} />
  );
};

const Arc = (props = {}) => {
  const { datum, onClick, getArcPath } = props;

  const arcPath = getArcPath(datum);
  const style = { fill: getColor() };

  return (
    <path
      d={arcPath}
      style={style}
      stroke-width="2"
      stroke="#121212"
      className="graph-arc"
      onClick={ev => onClick(datum)}
    />
  );
};
