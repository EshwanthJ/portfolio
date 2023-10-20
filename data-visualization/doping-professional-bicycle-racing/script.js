let url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
let req = new XMLHttpRequest();

let values = [];

let xScale;
let yScale;

let width = 800;
let height = 600;
let padding = 40;

let svg = d3.select("svg");
let tooltip = d3.select("#tooltip");
let line1 = d3.select("#line1");
let line2 = d3.select("#line2");
let line3 = d3.select("#line3");

let updateTooltipPosition = (x, y) => {
  tooltip.style("top", y + "px").style("left", x + "px");
};

let drawCanvas = () => {
  svg.attr("width", width);
  svg.attr("height", height);
};

let generateScales = () => {
  xScale = d3
    .scaleLinear()
    .domain([
      d3.min(values, (item) => item.Year - 1),
      d3.max(values, (item) => item.Year + 1),
    ])
    .range([padding, width - padding]);

  yScale = d3
    .scaleTime()
    .domain([
      d3.min(values, (item) => new Date(item.Seconds * 1000)),
      d3.max(values, (item) => new Date(item.Seconds * 1000)),
    ])
    .range([padding, height - padding]);
};

let generateAxes = () => {
  let xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  let yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", "translate(0, " + (height - padding) + ")");

  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ", 0)");
};

let drawLegend = () => {
  const legend = svg
    .append("g")
    .attr("id", "legend")
    .attr("transform", "translate(" + 600 + ", 250)");

  legend
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill", "lightgreen");

  legend
    .append("rect")
    .attr("x", 0)
    .attr("y", 30)
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill", "orange");

  legend
    .append("text")
    .attr("x", 30)
    .attr("y", 15)
    .text("No Doping Allegations");

  legend
    .append("text")
    .attr("x", 30)
    .attr("y", 45)
    .text("Doping Allegations");
};


let drawPoints = () => {
  svg
    .selectAll("circle")
    .data(values)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("r", "5")
    .attr("data-xvalue", (item) => item.Year)
    .attr("data-yvalue", (item) => new Date(item.Seconds * 1000))
    .attr("cx", (item) => xScale(item.Year))
    .attr("cy", (item) => yScale(new Date(item.Seconds * 1000)))
    .attr("fill", (item) => (item.URL ? "orange" : "lightgreen"))
    .on("mouseover", (item) => {
      let x = event.clientX + 20;
      let y = event.clientY;
      updateTooltipPosition(x, y);
      tooltip.transition().style("visibility", "visible");
      line1.text(item.Name + ", " + item.Nationality);
      line2.text("Year: " + item.Year + " Time: " + item.Time);
      line3.text(item.Doping);
      tooltip.attr('data-year', item.Year)
    })
    .on("mouseout", (item) => {
      tooltip.transition().style("visibility", "hidden");
    });
};

req.open("GET", url, true);
req.onload = () => {
  values = JSON.parse(req.responseText);
  drawCanvas();
  generateScales();
  generateAxes();
  drawLegend();
  drawPoints();
};
req.send();
