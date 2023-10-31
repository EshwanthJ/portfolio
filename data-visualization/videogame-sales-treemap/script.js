let url =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";

let urlData;

const canvas = d3.select("#canvas");
const legend = d3.select("#legend");
const tooltip = d3.select("#tooltip");

let updateTooltipPosition = (x, y) => {
  tooltip.style("top", y + 10 + "px").style("left", x + 10 + "px");
};

const categoryColors = {
  2600: "rgb(210, 210, 210)",
  Wii: "rgb(76, 146, 195)",
  NES: "rgb(173, 229, 161)",
  GB: "rgb(255, 201, 147)",
  DS: "rgb(190, 210, 237)",
  X360: "rgb(255, 153, 62)",
  PS3: "rgb(86, 179, 86)",
  PS2: "rgb(222, 82, 83)",
  SNES: "rgb(209, 192, 221)",
  GBA: "rgb(233, 146, 206)",
  PS4: "rgb(169, 133, 202)",
  "3DS": "rgb(255, 173, 171)",
  N64: "rgb(208, 176, 169)",
  PS: "rgb(163, 120, 111)",
  XB: "rgb(249, 197, 219)",
  PC: "rgb(153, 153, 153)",
  PSP: "rgb(201, 202, 78)",
  XOne: "rgb(226, 226, 164)",
};

let drawTreeMap = () => {
  let hierarchy = d3
    .hierarchy(urlData, (node) => node.children)
    .sum((node) => node.value)
    .sort((node1, node2) => node2.value - node1.value);

  let createTreeMap = d3.treemap().size([1000, 600]);
  createTreeMap(hierarchy);

  let tilesData = hierarchy.leaves();

  let tile = canvas
    .selectAll("g")
    .data(tilesData)
    .enter()
    .append("g")
    .attr("transform", (game) => {
      return "translate(" + game.x0 + ", " + game.y0 + ")";
    });

  tile
    .append("rect")
    .attr("class", "tile")
    .attr("fill", (game) => categoryColors[game.data.category])
    .attr("data-name", (game) => game.data.name)
    .attr("data-category", (game) => game.data.category)
    .attr("data-value", (game) => game.data.value)
    .attr("width", (game) => game.x1 - game.x0 - 2)
    .attr("height", (game) => game.y1 - game.y0 - 2)
    .on("mouseover", (game) => {
      let x = event.clientX + 20;
      let y = event.clientY;
      updateTooltipPosition(x, y);
      tooltip.transition().style("visibility", "visible");
      tooltip.attr("data-value", game.data.value);
      tooltip.html(
        `<strong>Name:</strong> ${game.data.name}<br>
        <strong>Category:</strong> ${game.data.category}<br>
        <strong>Value:</strong> ${game.data.value}`
      );
    })
    .on("mouseout", () => {
      tooltip.transition().style("visibility", "hidden");
    });

  tile
    .append("text")
    .attr("x", 5)
    .attr("y", 5)
    .style("font-size", "8px")
    .selectAll("tspan")
    .data((game) => game.data.name.split(/\s+/))
    .enter()
    .append("tspan")
    .text((d) => d)
    .attr("dy", "1em")
    .attr("x", 5);
};

let drawLegend = () => {
  const legendData = Object.keys(categoryColors).map((category) => {
    return {
      category: category,
      color: categoryColors[category],
    };
  });

  const legend = d3.select("#legend");

  const numColumns = 4;
  const legendItems = legend
    .selectAll("g")
    .data(legendData)
    .enter()
    .append("g")
    .attr("transform", (d, i) => {
      const col = i % numColumns;
      const row = Math.floor(i / numColumns);
      const x = col * 100;
      const y = row * 30;
      return "translate(" + x + ", " + y + ")";
    });

  legendItems
    .append("rect")
    .attr("class", "legend-item")
    .attr("width", 18)
    .attr("height", 18)
    .attr("fill", (d) => d.color);

  legendItems
    .append("text")
    .text((d) => d.category)
    .attr("x", 24)
    .attr("y", 14)
    .style("font-size", "12px");
};

d3.json(url).then((data, error) => {
  if (error) {
    console.log(error);
  } else {
    urlData = data;
    drawTreeMap();
    drawLegend();
  }
});
