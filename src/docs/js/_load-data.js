const { hierarchy } = require("d3-hierarchy");


const JSON_PATH = "http://rawgit.com/interlockjs/interlock/master/docs/compilation.json";


function orderChildren (datum) {
  if (datum.children) {
    datum.children = datum.children.map((child, idx) => {
      child = orderChildren(child);
      child.position = idx;
      return child;
    });
  }
  return datum;
}


function addAnscestors (node, anscestors) {
  if (node.children) {
    node.children = node.children.map((child, idx) => {
      const childAnscestors = anscestors.concat(node);
      child = addAnscestors(child, childAnscestors);
      return child;
    });
  }

  node.anscestors = anscestors;
  return node;
}

module.exports = data => {
  data = orderChildren(data);
  return addAnscestors(hierarchy(data), [])
    .sort((a, b) => b.data.position > a.data.position)
    .sum(d => d.size)
};
