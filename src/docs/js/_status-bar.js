const { select } = require("d3-selection");


const statusBar = select(".interactive-docs .status");


exports.updateStatusBar = (d) => {
  statusBar.html(() => d.data.name);
};

exports.clearStatusBar = () => {
  statusBar.html(() => "&nbsp;");
};
