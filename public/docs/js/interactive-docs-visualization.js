window.addEventListener('load', function() {
  var JSON_PATH = "http://rawgit.com/interlockjs/interlock/master/docs/compilation.json";

  var md = markdownit();

  var width = 700,
    height = width / 2,
    radius = height;

  var x = d3.scale.linear()
    .range([0, Math.PI]);

  var y = d3.scale.pow()
    .exponent(0.7)
    .range([0, radius]);

  var colorIdx = 0;
  function getColor () {
    return colors[colorIdx++];
  }
  var colors = ["#188dc0", "#21c5b5", "#2a8eff", "#24c7e5", "#17a8fd", "#1bc0fd", "#1c9bb5", "#31b1b5", "#318ed5", "#2c8fea", "#2faad6", "#18a5e5", "#16c6d3", "#16b0c5", "#28c2ef", "#28c4c2", "#2191b6", "#26b1d3", "#2eb8ff", "#1596ff", "#27a0ff", "#1994d3", "#1797ea", "#2da0ea", "#179ed2", "#17afe7", "#229fc4", "#2ea4b5", "#30c1d6", "#17acf9", "#20b7c3", "#2b9bc6", "#2da9c3", "#1ab4df", "#15b8d5", "#15bec3", "#1abbf0", "#19bde2", "#308dde", "#2f8df1", "#30aab5", "#18b4f4", "#21bfb5", "#2e8db7", "#308ec6", "#2ab8b5", "#2d9cd6", "#1fc7fc", "#3097b5", "#2797f8", "#319ee0", "#2e97e3", "#29abd1", "#2facf2", "#228dcf", "#1693c2", "#168df8", "#1d95dd", "#2d97cb", "#1898f3", "#18a3c3", "#219ff1", "#15a3dd", "#22a1fa", "#23b2e4", "#2da9dc", "#1dc6ee", "#30adea", "#2cb2cb", "#1692cb", "#22a1b7", "#1ca2cc", "#1fa4eb", "#1caebd", "#15b5b9", "#1bb9cb", "#2eb7f1", "#2dbfca", "#15c6cd", "#23c7bf", "#31c3fb", "#1f8edc", "#1d8eef", "#1790e8", "#1797ba", "#1caeb7", "#29a8f8", "#31b8cd", "#31b9df", "#26bcfe", "#15c5d8", "#3195d7", "#2299c0", "#279dbc", "#179ddb", "#19a1d1", "#16a8bb", "#31abcb", "#18aef0", "#18b3fd", "#22b9e8", "#30bddc", "#1bc1db", "#3191c5", "#2f92c2", "#2a93bc", "#2f9aca", "#30a8df", "#2dacc2", "#31b6be", "#2abdbe", "#29beb8", "#19bfcf", "#2dc1f2", "#2ac6e8", "#1f8ecb", "#2994b5", "#1e91e3", "#2292dc", "#1c90f8", "#1792f0", "#2597d2", "#1794f9", "#1699de", "#1e9ad1", "#1a9ae8", "#16a1bd", "#2b9af7", "#279bf2", "#30a3bc", "#1fa2e4", "#1aa6c9", "#29a7b6", "#19a3f0", "#2fa4f9", "#15accb", "#2da9f2", "#1face6", "#17ade0", "#1baddb", "#18b1d8", "#31b3bf", "#18b0f6", "#1eb5d4", "#2fb5c7"];

  var svg = d3.select(".interactive-docs .visualization")
    .append("svg")
      .attr("viewBox", "0 0 " + width + " " + height)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height + ")");

  var statusBar = d3.select(".interactive-docs .status-bar");

  var doc = d3.select(".doc");

  var partition = d3.layout.partition()
    .sort(function (a, b) { return b.position - a.position; })
    .value(function(d) { return d.size; });

  var arc = d3.svg.arc()
    .startAngle(function(d) { return (Math.PI / 2) - Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
    .endAngle(function(d) { return (Math.PI / 2) - Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
    .innerRadius(function(d) { return Math.max(0, y(d.y)); })
    .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

  function updateStatusBar (d) {
    statusBar.html(function () {
      return "<b>" + d.name + "</b>";
    });
    statusBar
      .transition()
      .duration(0)
      .style("opacity", 1);

    window.requestAnimationFrame(function () {
      statusBar
        .transition()
        .duration(1600)
        .style("opacity", 0);
    });
  }

  d3.json(JSON_PATH, function(err, root) {
    if (err) throw err;

    function orderChildren (node) {
      if (node.children) {
        node.children = node.children.map(function (child, idx) {
          child = orderChildren(child);
          child.position = idx;
          return child;
        });
      }

      return node;
    }

    orderChildren(root);

    var path = svg.selectAll("path")
      .data(partition.nodes(root))
      .enter().append("path")
      .attr("d", arc)
      .style("fill", function (d) { return getColor(); })
      .classed("graph-arc", true)
      .attr("stroke-width", 2)
      .attr("stroke", "#f0f0f0")
      .on("click", click)
      .on("mouseenter", updateStatusBar);

    function click(d) {
      path.transition()
        .duration(1200)
        .attrTween("d", arcTween(d));
      doc.html(function () {
        return md.render(d.markdown);
      });
    }

    doc.html(function () {
      return md.render(root.markdown);
    });
  });

  function arcTween(d) {
    var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
      yd = d3.interpolate(y.domain(), [d.y, 1]),
      yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
    return function(d, i) {
      return i ?
        function(t) { return arc(d); } :
        function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
    };
  }
}, false);
