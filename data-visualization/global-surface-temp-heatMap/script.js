let url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
let req = new XMLHttpRequest();

let baseTemp;
let values;

let xScale;
let yScale;

let width = 1200;
let height = 600;
let padding = 70;

let tooltip = d3.select("#tooltip");
let canvas = d3.select("#canvas");

let drawCanvas = () => {
  canvas.attr("width", width).attr("height", height);
};

let generateScales = () => {
  let minYear = d3.min(values, (item) => item.year);
  let maxYear = d3.max(values, (item) => item.year);

  xScale = d3
    .scaleLinear()
    .domain([minYear, maxYear + 1])
    .range([padding, width - padding]);
  yScale = d3
    .scaleTime()
    .domain([new Date(0, 0, 0, 0, 0, 0, 0), new Date(0, 12, 0, 0, 0, 0, 0)])
    .range([padding, height - padding]);
};

let drawAxes = () => {
  let xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  let yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%B"));

  canvas
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", "translate(0, " + (height - padding) + ")");
  canvas
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ", 0)");
};

let drawCells = () => {
  canvas
    .selectAll("rect")
    .data(values)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("fill", (item) => {
      variance = item.variance;
      if (variance <= -1) {
        return "SteelBlue";
      } else if (variance <= 0) {
        return "LightSteelBlue";
      } else if (variance <= 1) {
        return "Orange";
      } else {
        return "Crimson";
      }
    })
    .attr("data-year", (item) => item.year)
    .attr("data-month", (item) => item.month - 1)
    .attr("data-temp", (item) => baseTemp + item.variance)
    .attr("height", (height - 2 * padding) / 12)
    .attr("width", (item) => {
      let minYear = d3.min(values, (item) => item.year);
      let maxYear = d3.max(values, (item) => item.year);

      return (width - 2 * padding) / (maxYear - minYear);
    })
    .attr("x", (item) => {
      return xScale(item.year);
    })
    .attr("y", (item) => {
      return yScale(new Date(0, item.month - 1, 0, 0, 0, 0, 0));
    })
    .on("mouseover", (item) => {
      tooltip.transition().style("visibility", "visible");

      let monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      tooltip.html(
        item.year + " " + monthNames[item.month - 1] + " : " + item.variance
      );

      tooltip.attr("data-year", item.year);
    })
    .on("mouseout", (item) => {
      tooltip.transition().style("visibility", "hidden");
    });
};

req.open("GET", url, true);
req.onload = () => {
  let obj = JSON.parse(req.responseText);
  baseTemp = obj.baseTemperature;
  values = obj.monthlyVariance;
  drawCanvas();
  generateScales();
  drawAxes();
  drawCells();
};
req.send();
