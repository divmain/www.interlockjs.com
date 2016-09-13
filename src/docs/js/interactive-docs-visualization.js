import marked from "marked";
import { select } from "d3-selection";
import "d3-transition";
import { partition } from "d3-hierarchy";

import loadData from "./_load-data";
import { buildBreadcrumb } from "./_breadcrumbs";
import { updateStatusBar, clearStatusBar } from "./_status-bar";
import { getColor } from "./_colors";
import { getArcPath } from "./_math";
import { arcTween } from "./_animation";
import { width, height } from "./_constants";


const svg = select(".interactive-docs .visualization svg")
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height + ")");

svg.on("mouseleave", clearStatusBar)


loadData().then(rootNode => {
  svg
    .append("circle")
    .attr("r", "349")
    .style("fill", "none")
    .style("stroke-width", "1")
    .style("stroke", "#121212")
    .style("stroke-dasharray", "2,6")

  const path = svg.selectAll("path")
    .data(partition()(rootNode).descendants())
    .enter()
    .append("path")

  path
    .attr("d", getArcPath)
    .style("fill", function (d) { return getColor(); })
    .classed("graph-arc", true)
    .attr("stroke-width", 2)
    .attr("stroke", "#f0f0f0")
    .attr("stroke", "#121212")
    .on("click", onClick)
    .on("mouseenter", updateStatusBar)
    .on("mouseleave", clearStatusBar);

  const doc = select(".doc");
  function updateDoc (d) {
    doc.html(() => marked(d.data.markdown));
    buildBreadcrumb(d.anscestors, ".doc-wrapper .breadcrumb", onClick);
  }

  function onClick(d) {
    updateDoc(d);

    path.transition()
      .duration(1200)
      .attrTween("d", arcTween(d));
  }
});
