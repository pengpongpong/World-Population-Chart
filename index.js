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
   .style("cursor", "crosshair")
   .style("fill", "#295D8A")
}

let mousemove = function(e) {
  tooltip
    .html(
      `Year:\u00A0\u00A0 <strong>${e.toElement.__data__[0]}</strong><br> 
      Count: <strong>${(e.toElement.__data__[1]/10000000000).toFixed(3)}</strong> billion`
      )
    .style("left", `${e.pageX + 15}px`)
    .style("top", `${e.pageY}px`)
}

let mouseleave = function(d) {
  tooltip
    .style("opacity", 0)
  d3.select(this)
    .style("stroke", "none")
    .style("fill", "steelblue")
  }

// svg chart
const svg = d3.select("#chart")
      .append("svg")
      .attr("viewbox", [0, 0, width, height])
      .attr("width", "100%")
      .attr("height", height)

svg.append("g")
  .selectAll("rect")
  .data(data)
  .join("rect")
      .attr("width", x.bandwidth())
      .attr("height", d => y(d3.min(data, d => d[1]/10000000000)) - y(d[1]/10000000000 + 0.1))
      .attr("x", d => x(d[0]))
      .attr("y", d => y(d[1]/10000000000))
      .attr("fill", "steelblue")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)

// x-axis label without outer tick
svg.append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .attr("font-weight", "bold")
    .call(d3.axisBottom(x)
    .tickFormat((d, i) => {if(i%2 === 0){return d}})
    .tickSizeOuter(0));

// y-axis label without outer tick
svg.append("g")
    .attr("transform", `translate(${margin.left}, 0)`)
    .attr("font-weight", "bold")
    .call(d3.axisLeft(y).tickSizeOuter(0))

// y-axis title
svg.append("text")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("font-weight", "bold")
    .attr("y", 10)
    .attr("x", 5)
    .text("World Population Count in Billion")