import { select } from "d3-selection";
import "d3-transition";
import { partition } from "d3-hierarchy";

import loadData from "./_load-data";
import { buildBreadcrumb } from "./_breadcrumbs";
import { updateStatusBar, clearStatusBar } from "./_status-bar";
import { getArcPath } from "./_math";
import { arcTween } from "./_animation";


const rootNode = loadData(window.__pluggable_data__);

const svg = select(".interactive-docs .visualization svg g");
svg.on("mouseleave", clearStatusBar)

const path = svg.selectAll("path")
  .data(partition()(rootNode).descendants())

path
  .attr("d", getArcPath)
  .on("click", onClick)
  .on("mouseenter", updateStatusBar)
  .on("mouseleave", clearStatusBar);

const doc = select(".doc");
function updateDoc (d) {
  doc.html(() => d.data.html);
  buildBreadcrumb(d.anscestors, ".doc-wrapper .breadcrumb", onClick);
}

function onClick(d) {
  updateDoc(d);

  path.transition()
    .duration(1200)
    .attrTween("d", arcTween(d));
}
