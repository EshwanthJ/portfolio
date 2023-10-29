let countyURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
let educationURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

let countyData;
let statesData;
let educationData;

let canvas = d3.select("#canvas");
let tooltip = d3.select('#tooltip')

const legendData = [
    { color: "#e5f5e0", label: "3% or less" },
    { color: "#c7e9c0", label: "4% - 12%" },
    { color: "#a1d99b", label: "13% - 21%" },
    { color: "#74c476", label: "22% - 30%" },
    { color: "#41ab5d", label: "31% - 39%" },
    { color: "#238b45", label: "40% - 48%" },
    { color: "#006d2c", label: "49% - 57%" },
    { color: "#00441b", label: "58% or more" },
  ];

let drawLegend = (data) => {
    const legend = d3.select("#legend")
      .append("svg")
      .attr("width", 150)
      .attr("height", 160);
  
    const legendGroup = legend.append("g");
    const legendItemHeight = 160 / data.length;
  
    legendGroup.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", 10)
      .attr("y", (d, i) => i * legendItemHeight)
      .attr("width", 20)
      .attr("height", legendItemHeight)
      .attr("fill", (d) => d.color);
  
    legendGroup.selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .text((d) => d.label)
      .attr("x", 40)
      .attr("y", (d, i) => i * legendItemHeight + legendItemHeight / 2)
      .attr("font-size", "12px")
      .attr("text-anchor", "start");
  
    legend.attr("transform", "translate(10,10)");
  }

  let updateTooltipPosition = (x, y) => {
    tooltip.style("top", (y + 10) + "px").style("left", (x + 10) + "px");
};


  let drawMap = () => {
    canvas
      .selectAll("path")
      .data(countyData)
      .enter()
      .append("path")
      .attr("d", d3.geoPath())
      .attr("class", "county")
      .attr('fill', (countyItem) => {
        let id = countyItem.id;
        let county = educationData.find((item) => {
          return item.fips === id;
        });
        let percentage = county.bachelorsOrHigher;
        if (percentage <= 3) {
          return legendData[0].color;
        } else if (percentage <= 12) {
          return legendData[1].color;
        } else if (percentage <= 21) {
          return legendData[2].color;
        } else if (percentage <= 30) {
          return legendData[3].color;
        } else if (percentage <= 39) {
          return legendData[4].color;
        } else if (percentage <= 48) {
          return legendData[5].color;
        } else if (percentage <= 57) {
          return legendData[6].color;
        } else if (percentage <= 66) {
          return legendData[7].color;
        }
      })
      .attr('data-fips', (countyItem) => countyItem.id)
      .attr('data-education', (countyItem) => {
        let id = countyItem.id;
        let county = educationData.find((item) => {
          return item.fips === id;
        });
        let percentage = county.bachelorsOrHigher;
        return percentage;
      })
      .on('mouseover', (countyItem) => {
        let x = event.clientX + 20;
        let y = event.clientY;
        updateTooltipPosition(x, y);
        tooltip.transition().style('visibility', 'visible')
  
        let id = countyItem.id;
        let county = educationData.find((item) => {
          return item.fips === id;
        });
  
        tooltip.text(county.fips + ' - ' + county.area_name + ', ' + county.state + ' : ' + county.bachelorsOrHigher + '%')
        tooltip.attr('data-education', county.bachelorsOrHigher)
      }).on('mouseout', (countyItem) => {
        tooltip.transition().style('visibility', 'hidden')
      });
  };
  
  

d3.json(countyURL).then((data, error) => {
  if (error) {
    console.log(log);
  } else {
    console.log(data)
    countyData = topojson.feature(data, data.objects.counties).features;
    statesData = topojson.mesh(data, data.objects.states, function(a, b) { return a !== b; });
    console.log(countyData);

    d3.json(educationURL).then((data, error) => {
      if (error) {
        console.log(error);
      } else {
        educationData = data;
        console.log(educationData);
        drawMap();
        drawLegend(legendData);
      }
    });
  }
});
