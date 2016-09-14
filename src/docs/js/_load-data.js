import { hierarchy } from "d3-hierarchy";


const JSON_PATH = "http://rawgit.com/interlockjs/interlock/master/docs/compilation.json";


function orderChildren (node, anscestors) {
  if (node.children) {
    node.children = node.children.map((child, idx) => {
      const childAnscestors = anscestors.concat(node);
      child = orderChildren(child, childAnscestors);
      child.position = idx;
      return child;
    });
  }

  node.anscestors = anscestors;
  return node;
}

module.exports = () => fetch(JSON_PATH)
  .then(response => response.json())
  .then(data => 
    orderChildren(hierarchy(data), [])
      .sort((a, b) => b.data.position - a.data.position)
      .sum(d => d.size)
  );
