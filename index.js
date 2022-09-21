import { data } from "./worldpop.js"

const margin = {
top: 20,
right: 0, 
bottom: 30, 
left: 40
};

const width = 1000;
const height = 500;

// x = [margin.left, width - margin.right];
// y = [height - margin.bottom, margin.top];

// y axis
const y = d3.scaleLinear()
        .domain([d3.min(data, d => d[1]/10000000000 - 0.1), d3.max(data, d => d[1]/10000000000)])
        .range([height - margin.bottom, margin.top]);

// x axis
const x = d3.scaleBand()
        .domain(data.map(d => d[0]))
        .range([margin.left, width])
        .padding(0.2)


// custom tooltip
let tooltip = d3.select("#chart")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "#d3d3d3")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("position", "absolute")
        .style("box-shadow", "0 0 4px 2px #d3d3d3")

// tooltip events
let mouseover = function(d) {
  tooltip
    .style("opacity", 1)
  d3.select(this)
   .style("stroke", "black")
   .style("opacity", 1)
   .style("cursor", "crosshair")
   .style("fill", "#295D8A")
}

let mousemove = function(e) {
  tooltip
    .html((e.toElement.__data__[1]/10000000000).toFixed(3) + " billion")
    .style("left", `${e.offsetX+40}px`)
    .style("top", `${e.offsetY-7}px`)
}

let mouseleave = function(d) {
  tooltip
    .style("opacity", 0)
  d3.select(this)
    .style("stroke", "none")
    .style("opacity", 1)
    .style("fill", "steelblue")
  }

// svg chart
const svg = d3.select("#chart")
      .append("svg")
      .attr("viewbox", [0, 0, width, height])
      .attr("width", width)
      .attr("height", height)

svg.append("g")
      .attr("fill", "steelblue")
  .selectAll("rect")
  .data(data)
  .join("rect")
      .attr("width", x.bandwidth())
      .attr("height", d => y(d3.min(data, d => d[1]/10000000000)) - y(d[1]/10000000000 + 0.1))
      .attr("x", d => x(d[0]))
      .attr("y", d => y(d[1]/10000000000))
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)

// x-axis label with outer tick
// svg.append("g")
//   .attr("transform", `translate(0, ${height - margin.bottom})`)
//   .attr("font-weight", "bold")
//   .call(d3.axisBottom(x));

// x-axis label without outer tick
const xAxis = g => g
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .attr("font-weight", "bold")
        .call(d3.axisBottom(x).tickSizeOuter(0));
svg.append("g").call(xAxis);

// y-axis label with outer tick
// svg.append("g")
//   .attr("transform", `translate(${margin.left}, 0)`)
//   .attr("font-weight", "bold")
//   .call(d3.axisLeft(y));

// y-axis label without outer tick
const yAxis = g => g
        .attr("transform", `translate(${margin.left}, 0)`)
        .attr("font-weight", "bold")
        .call(d3.axisLeft(y).tickSizeOuter(0))
svg.append("g").call(yAxis);

// y-axis title
const yTitle = g => g.append("text")
              .attr("font-family", "sans-serif")
              .attr("font-size", 10)
              .attr("font-weight", "bold")
              .attr("y", 10)
              .text("World Population Count in Billion")
              
svg.call(yTitle);