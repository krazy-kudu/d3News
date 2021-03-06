// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 40, left: 50},
    width = 520 - margin.left - margin.right,
    height = 520 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#scatter")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")")

// Add the grey background that makes ggplot2 famous
svg
  .append("rect")
    .attr("x",0)
    .attr("y",0)
    .attr("height", height)
    .attr("width", height)
    .style("fill", "EBEBEB")

//Read the data
d3.csv("./data.csv").then(function(csv) {
  console.log(csv)
  const data = csv
  console.log(data)
  // Add X axis
  var x = d3.scaleLinear()
    .domain([8, 23])
    .range([ 0, width ])
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(-height*1.3).ticks(10))
    .select(".domain").remove()

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([8, 28])
    .range([ height, 0])
    .nice()
  svg.append("g")
    .call(d3.axisLeft(y).tickSize(-width*1.3).ticks(7))
    .select(".domain").remove()

  // Customization
  svg.selectAll(".tick line").attr("stroke", "white")

  // Add X axis label:
  svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width/2 + margin.left)
      .attr("y", height + margin.top + 20)
      .text("poverty (%)");

  // Y axis label:
  svg.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -margin.top - height/2 + 20)
      .text("Smokes (%)")

  // Color scale: give me a specie name, I return a color
  // var color = d3.scaleOrdinal()
  //   .domain(["setosa", "versicolor", "virginica" ])
  //   .range([ "#F8766D", "#00BA38", "#619CFF"])

  const tooltip = d3.select("#scatter")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")

  const mouseover = function(d) {
    tooltip
      .style("opacity", 1)
  }

  const mousemove = function(d) {
    tooltip
      .html("State: " + d.state + "<br>Poverty%: " + d.poverty + "<br>Smokes%: " + d.smokes)
      .style("left", (d3.mouse(this)[0]+90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", (d3.mouse(this)[1]) + "px")
  }
  const mouseleave = function(d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
  }
  // Add dots
  svg.append("g")
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.poverty); } )
      .attr("cy", function (d) { return y(d.smokes); } )
      .attr("r", 15)
      .attr("opacity", 0.5)
      .on("mouseover", mouseover )
      .on("mousemove", mousemove )
      .on("mouseleave", mouseleave )
  
   // Add abbr
  svg.selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .text(stateAbbr => {
      return stateAbbr.abbr;
    })
    .attr("cx", function(stateAbbr) {
      return stateAbbr.poverty;
    })
    .attr("cy", function(stateAbbr) {
      return stateAbbr.smokes;
    });  
    
  //   .attr("x", (function(dataPoint) {
  //   return dataPoint.poverty; 
  // }))
  //   .attr("y", (function(dataPoint) {
  //   return dataPoint.smokes; 
  // }))
})
