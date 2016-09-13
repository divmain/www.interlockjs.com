import { select } from "d3-selection";


const statusBar = select(".interactive-docs .status");


export function updateStatusBar (d) {
  statusBar.html(() => d.data.name);
}

export function clearStatusBar () {
  statusBar.html(() => "&nbsp;");
}
