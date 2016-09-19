const marked = require("marked");
const { jsdom } = require("jsdom");
const { select } = require("d3-selection");
const { partition } = require("d3-hierarchy");
const fetch = require("node-fetch");


const PLUGGABLE_DATA = "http://rawgit.com/interlockjs/interlock/master/docs/compilation.json";


function cleanData (datum) {
  if (datum.markdown) {
    datum.html = marked(datum.markdown);
    datum.markdown = undefined;
  }
  if (datum.node) {
    datum.node = undefined;
  }
  if (datum.children) {
    datum.children = datum.children.map(cleanData);
  }
  return datum;
}


module.exports = () => {
  require("babel-register");

  const loadData = require("./_load-data");
  const { getColor } = require("./_colors");
  const { getArcPath } = require("./_math");
  const { width, height } = require("./_constants");

  return fetch(PLUGGABLE_DATA)
    .then(response => response.json())
    .then(cleanData)
    .then(rawData => Promise.all([ rawData, loadData(rawData) ]))
    .then(([rawData, rootNode]) => {
      const document = jsdom("<html><svg></svg></html>", {});
      const window = document.defaultView;

      global.document = document;
      global.window = window;

      const svg = select("svg")
        .attr("viewbox", `0 0 ${width} ${height}`)
        .append("g")
          .attr("transform", `translate(${width / 2},${height})`)

      svg
        .append("circle")
        .attr("r", "349")
        .style("fill", "none")
        .style("stroke-width", "1")
        .style("stroke", "#121212")
        .style("stroke-dasharray", "2,6")

      svg.selectAll("path")
        .data(partition()(rootNode).descendants())
        .enter()
        .append("path")
        .attr("d", getArcPath)
        .style("fill", d => getColor())
        .classed("graph-arc", true)
        .attr("stroke-width", 2)
        .attr("stroke", "#f0f0f0")
        .attr("stroke", "#121212");

      global.document = null;
      global.window = null;
      global.fetch = null;

      const svgHtml = document.querySelector("svg").outerHTML;

      return `
        ${svgHtml}
        <script type="application/javascript">
          window.__pluggable_data__ = ${JSON.stringify(rawData)}
        </script>
      `;
    });
};
