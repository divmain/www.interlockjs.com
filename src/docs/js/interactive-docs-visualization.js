import marked from "marked";
import { scaleLinear, scalePow } from "d3-scale";
import { select } from "d3-selection";
import "d3-transition";
import { hierarchy, partition } from "d3-hierarchy";
import { arc } from "d3-shape";
import { interpolate } from "d3-interpolate";


const JSON_PATH = "http://rawgit.com/interlockjs/interlock/master/docs/compilation.json";
const width = 700;
const height = width / 2;
const radius = height;
const colors = ["#188dc0", "#21c5b5", "#2a8eff", "#24c7e5", "#17a8fd", "#1bc0fd", "#1c9bb5", "#31b1b5", "#318ed5", "#2c8fea", "#2faad6", "#18a5e5", "#16c6d3", "#16b0c5", "#28c2ef", "#28c4c2", "#2191b6", "#26b1d3", "#2eb8ff", "#1596ff", "#27a0ff", "#1994d3", "#1797ea", "#2da0ea", "#179ed2", "#17afe7", "#229fc4", "#2ea4b5", "#30c1d6", "#17acf9", "#20b7c3", "#2b9bc6", "#2da9c3", "#1ab4df", "#15b8d5", "#15bec3", "#1abbf0", "#19bde2", "#308dde", "#2f8df1", "#30aab5", "#18b4f4", "#21bfb5", "#2e8db7", "#308ec6", "#2ab8b5", "#2d9cd6", "#1fc7fc", "#3097b5", "#2797f8", "#319ee0", "#2e97e3", "#29abd1", "#2facf2", "#228dcf", "#1693c2", "#168df8", "#1d95dd", "#2d97cb", "#1898f3", "#18a3c3", "#219ff1", "#15a3dd", "#22a1fa", "#23b2e4", "#2da9dc", "#1dc6ee", "#30adea", "#2cb2cb", "#1692cb", "#22a1b7", "#1ca2cc", "#1fa4eb", "#1caebd", "#15b5b9", "#1bb9cb", "#2eb7f1", "#2dbfca", "#15c6cd", "#23c7bf", "#31c3fb", "#1f8edc", "#1d8eef", "#1790e8", "#1797ba", "#1caeb7", "#29a8f8", "#31b8cd", "#31b9df", "#26bcfe", "#15c5d8", "#3195d7", "#2299c0", "#279dbc", "#179ddb", "#19a1d1", "#16a8bb", "#31abcb", "#18aef0", "#18b3fd", "#22b9e8", "#30bddc", "#1bc1db", "#3191c5", "#2f92c2", "#2a93bc", "#2f9aca", "#30a8df", "#2dacc2", "#31b6be", "#2abdbe", "#29beb8", "#19bfcf", "#2dc1f2", "#2ac6e8", "#1f8ecb", "#2994b5", "#1e91e3", "#2292dc", "#1c90f8", "#1792f0", "#2597d2", "#1794f9", "#1699de", "#1e9ad1", "#1a9ae8", "#16a1bd", "#2b9af7", "#279bf2", "#30a3bc", "#1fa2e4", "#1aa6c9", "#29a7b6", "#19a3f0", "#2fa4f9", "#15accb", "#2da9f2", "#1face6", "#17ade0", "#1baddb", "#18b1d8", "#31b3bf", "#18b0f6", "#1eb5d4", "#2fb5c7"];


const x = scaleLinear()
  .range([0, Math.PI]);

const y = scalePow()
  .exponent(0.7)
  .range([0, radius]);

let colorIdx = 0;
const getColor = () => colors[colorIdx++];

const svg = select(".interactive-docs .visualization svg")
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height + ")");

svg.on("mouseleave", clearStatusBar)

const statusBar = select(".interactive-docs .status");

const doc = select(".doc");

const p = partition();

const arcShape = arc()
  .startAngle(function(d) { return (Math.PI / 2) - Math.max(0, Math.min(2 * Math.PI, x(d.x0))); })
  .endAngle(function(d) { return (Math.PI / 2) - Math.max(0, Math.min(2 * Math.PI, x(d.x1))); })
  .innerRadius(function(d) { return Math.max(0, y(d.y0)); })
  .outerRadius(function(d) { return Math.max(0, y(d.y1)); });

function updateStatusBar (d) {
  statusBar.html(function () {
    return d.data.name;
  });
}

function clearStatusBar () {
  statusBar.html(function () {
    return "&nbsp;";
  });
}

fetch(JSON_PATH).then(response => response.json()).then(root => {
  function orderChildren (node, anscestors) {
    if (node.children) {
      node.children = node.children.map(function (child, idx) {
        const childAnscestors = anscestors.concat(node);
        child = orderChildren(child, childAnscestors);
        child.position = idx;
        return child;
      });
    }

    node.anscestors = anscestors;
    return node;
  }

  root = orderChildren(hierarchy(root), [])
  // root = hierarchy(orderChildren(root, []))
    .sort((a, b) => b.data.position - a.data.position)
    .sum(d => d.size);

  svg
    .append("circle")
    .attr("r", "349")
    .style("fill", "none")
    .style("stroke-width", "1")
    .style("stroke", "#121212")
    .style("stroke-dasharray", "2,6")

  const path = svg.selectAll("path")
    .data(p(root).descendants())
    .enter()
    .append("path")
  path
    .attr("d", arcShape)
    .style("fill", function (d) { return getColor(); })
    .classed("graph-arc", true)
    .attr("stroke-width", 2)
    .attr("stroke", "#f0f0f0")
    .attr("stroke", "#121212");

  path
    .on("click", click)
    .on("mouseenter", updateStatusBar)
    .on("mouseleave", clearStatusBar);

  function buildBreadcrumb (nodes, selector) {
    window.requestAnimationFrame(function () {
      const breadcrumb = document.createDocumentFragment();

      nodes.forEach(function (node, idx) {
        const isLast = idx === nodes.length - 1;

        const domNode = document.createElement("a");
        domNode.className = "breadcrumb-item";
        domNode.addEventListener("click", function (ev) {
          ev.preventDefault();
          click(node);
        });
        domNode.innerHTML = node.data.name;
        breadcrumb.appendChild(domNode);

        const separator = document.createElement("i");
        separator.className = "breadcrumb-separator ion-android-arrow-dropright";
        breadcrumb.appendChild(separator);
      });

      const parent = document.querySelector(selector);
      parent.innerHTML = "";
      parent.appendChild(breadcrumb);
    });
  }

  function updateDoc (d) {
    doc.html(() => marked(d.data.markdown));
    buildBreadcrumb(d.anscestors, ".doc-wrapper .breadcrumb");
  }

  function click(d) {
    updateDoc(d);

    path.transition()
      .duration(1200)
      .attrTween("d", arcTween(d));
  }
});

function arcTween(d) {
  const xd = interpolate(x.domain(), [d.x0, d.x1]),
    yd = interpolate(y.domain(), [d.y0, 1]),
    yr = interpolate(y.range(), [d.y0 ? 20 : 0, radius]);
  return function(d, i) {
    return i ?
      function(t) { return arcShape(d); } :
      function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arcShape(d); };
  };
}
