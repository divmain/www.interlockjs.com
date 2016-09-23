const { select } = require("d3-selection");
require("d3-transition");
const { partition } = require("d3-hierarchy");

const loadData = require("./_load-data");
const { buildBreadcrumb } = require("./_breadcrumbs");
const { updateStatusBar, clearStatusBar } = require("./_status-bar");
const { getArcPath } = require("./_math");
const { arcTween } = require("./_animation");


const rootNode = loadData(window.__pluggable_data__);

const svg = select(".interactive-docs .visualization svg g");
svg.on("mouseleave", clearStatusBar);

const path = svg.selectAll("path")
  .data(partition()(rootNode).descendants());

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
