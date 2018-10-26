//////////////////////////////////////////////////////////////////////
//                                                                  //
//                      Copyright © Hao Xu                          //
//                                                                  //
//                  Contact: 1044504787@QQ.COM                      //
//                                                                  //
//                               -                                  //
//                                                                  //
//////////////////////////////////////////////////////////////////////


if (document.getElementsByClassName("canvas-overlay") != null){


// Time_scale
var Time_scale = 0


if (typeof d3 != "undefined"){

Time_scale+=1

var w = 6*innerWidth/7,
    h = 4*innerHeight/5,
    node,
    link,
    root;
if (w>=1024){
var force = d3.layout.force()
    .on("tick", tick)
    .gravity(-0.0)
    .charge(function(d) { return d._children ? -d.size / 14 : -4; })
    .linkDistance(function(d) { return d.target._children ? 1.21 : 1; })
    .size([8*w/7, 2.7*h/5]);

var vis = d3.select(".canvas-overlay").append("svg:svg")
    .attr("width", w)
    .attr("height", 7.4*h/9);

d3.json("https://cdn.rawgit.com/mbostock/1093025/raw/b40b9fc5b53b40836ead8aa4b4a17d948b491126/flare.json", function(json) {
  root = json;
  root.fixed = true;
  root.x = 2*w / 5 +Math.sin(Time_scale);
  root.y = 4*h / 9 - 210+Math.cos(Time_scale);
  update();
});


var dragOnOff = d3.select('.canvas-overlay');
var draggable = true;

dragOnOff.on('click', function () {
    myNodes.on('mousedown.drag', draggable ? null : dragCallback);
    draggable = !draggable;
});

function update() {
  var nodes = flatten(root),
      links = d3.layout.tree().links(nodes);

  // Restart the force layout.
  force
      .nodes(nodes)
      .links(links)
      .start();

  // Update the links…
  link = vis.selectAll("line.link")
      .data(links, function(d) { return d.target.id; })
      .on('mouseover',mouseover);

  // Enter any new links.
  link.enter().insert("svg:line", ".node")
      .attr("class", "link")
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x + Math.sin(Time_scale); })
      .attr("y2", function(d) { return d.target.y + Math.cos(Time_scale); })
      .on('mouseover',mouseover)
      .style("stroke", "#8ba298")
      .call(force.drag);

  // Exit any old links.
  link.exit().remove();

  // Update the nodes…
  node = vis.selectAll("circle.node")
      .data(nodes, function(d) { return d.id; })
      .style("fill", color)
      .on('mouseover',mouseover);

  node.transition()
      .attr("r", function(d) { return d.children ? 2.8 : Math.sqrt(d.size) / 44; });

  // Enter any new nodes.
  node.enter().append("svg:circle")
      .attr("class", "node")
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .attr("r", function(d) { return d.children ? 3.4 : Math.sqrt(d.size) / 44; })
      .style("fill", color)
      .on('mouseover',mouseover)
      .on("click", click)
      .call(force.drag);

  // Exit any old nodes.
  node.exit().remove();

}

function mouseover(d) {
  d.x += 20*Math.random();
  d.y += 20*Math.random();
  update();
}

function tick() {
  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
}

// Color leaf nodes orange, and packages white or blue.
function color(d) {
  return d._children ? "#f3be2f" : d.children ? "#fffee8" : "#ad3240";
}

// Toggle children on click.
function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update();
}
// Mouseover action
// function mouseover() {
//   console.log(d3.select(this));
// }


// Returns a list of all nodes under the root.
function flatten(root) {
  var nodes = [], i = 0;

  function recurse(node) {
    if (node.children) node.size = node.children.reduce(function(p, v) { return p + recurse(v); }, 0);
    if (!node.id) node.id = ++i;
    nodes.push(node);
    return node.size;
  }

  root.size = recurse(root);
  return nodes;
}
}
else
  document.getElementsByClassName("canvas-overlay").style.display= "none";
////////////////////////////////////////////////////////////////////////////////////////////
}


function visibilitySetup() {
  if (document.getElementById("sparckles") != null) {
    setTimeout(function() {
      document.getElementById('sparckles').style.visibility = 'visible';
    }, 1600);
  }
}

visibilitySetup();

}