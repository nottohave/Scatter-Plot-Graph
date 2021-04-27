// import js file
let url="https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
// retrieve data and send back with data
let req = new XMLHttpRequest();

// create data, values, height scale, xscale, x axis scale and y axis scale for inversion
let values = []
let heightScale
let xScale
let yScale
let xAxisScale

// declare width and height and padding to create the canvas dimension
let width = 800;
let height = 650;
let padding = 50;
// declare svg with d3 select
let svg = d3.select("svg");
// set width and height of svg canvas using svg
let drawCanvas = function() {
  svg.attr("width", width)
  svg.attr("height", height)
}

let generateScales = function() {
    xScale = d3.scaleLinear()
               .domain([d3.min(values, (dataPoint) => dataPoint['Year']) - 1, d3.max(values, (dataPoint) => dataPoint['Year'])])
               .range([padding, width - padding]) // output is 50, 600

    yScale = d3.scaleLinear()
               .domain([d3.min(values, (dataPoint) => new Date(dataPoint['Seconds'] * 1000)), d3.max(values, (dataPoint) => new Date(dataPoint['Seconds'] * 1000))])
               .range([height - padding, padding]) // output for y is 600, 50
}


// draw the dots
let dataCircle = function() {
  //define div for tooltip
  let div = d3.select("body")
                  .append("div")
                  .attr("id", "tooltip")

  svg.selectAll("circle")
     .data(values)
     .enter()
     .append("circle")
     .attr("class", "dot")
     .attr("data-xvalue", (dataPoint) => {
       return dataPoint['Year']
     })
     .attr("data-yvalue", (dataPoint) => {
       return new Date(dataPoint['Seconds'] * 1000)
     })
     .attr("cx", (dataPoint) => {
       return xScale(dataPoint['Year'])
     })
     .attr("cy", (dataPoint) => {
       return yScale(dataPoint['Seconds'] * 1000)
     })
     .attr("r", 6)
     .style("fill", function(dataPoint) {
       if (dataPoint['Doping'] === "") {
         return "purple";
       } else {
         return "steelblue";
       }
     })
     .on("mouseover", function(values, dataPoint) {
       div.transition()
          .style("visibility", "visible")
          .attr("data-year", dataPoint["Year"])
       div.html(
            "Name: " + dataPoint["Name"] + "&ensp;" +
            " Time: " + dataPoint["Time"] + "&ensp;" +
            " Year: " + dataPoint["Year"] + "<br>" +
            ( (dataPoint["Doping"] === "") ? "" : "Doping allegation: " + dataPoint["Doping"] ) )

      // set tooltip info using circle cordinate
      div.style("left", d3.select(this).attr("cx") + "px")
         .style("top", d3.select(this).attr("cy") + "px")
      })
     .on("mouseout", function(values, dataPoint) {
       div.transition()
              .style("visibility", "hidden")
     });
}
// generate x and y axis
let generateAxis = function() {
  let xAxis = d3.axisBottom(xScale)
                 .tickFormat(d3.format('d'))
  let yAxis = d3.axisLeft(yScale)
                .tickFormat(d3.timeFormat('%M:%S'))

  svg.append("g")
     .call(yAxis)
     .attr("id", "y-axis")
     .attr("transform", "translate(" + (padding) +  ",0)")

  svg.append("g")
     .call(xAxis)
     .attr("id", "x-axis")
     .attr("transform", "translate(0, " + (height - padding) + ")")  //push down the x-axis

// legend text box to explain dots color
  var legendBox = svg.append("g").attr("id", "legend")
  var labels = legendBox
     .append("rect")
     .attr("x", (x) => width - 20)
     .attr("width", (width) => width = 18)
     .attr("height", (height) => height = 18)
     .style("fill", "purple")
     .attr("transform", "translate(" + -20 +", " + 380 + ")")

    legendBox
      .append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", "0.35em")
      .style("text-anchor", "end")
      .text((values) => "Biker without drug allegation")
      .attr("transform", "translate(" + -20 +", " + 380 + ")")

      //Biker with drug allegation legend box
  var allegationBox = svg.append("g").attr("id", "legend");
  var allegationLabels = allegationBox
     .append("rect")
     .attr("x", (x) => width - 20)
     .attr("width", (width) => width = 18)
     .attr("height", (height) => height = 18)
     .style("fill", "steelblue")
     .attr("transform", "translate(" + -20 +", " + 360 + ")")

    allegationBox
     .append("text")
     .attr("x", width - 24)
     .attr("y", 9)
     .attr("dy", "0.35em")
     .style("text-anchor", "end")
     .text((values) => "Biker with drug allegation")
     .attr("transform", "translate(" + -20 +", " + 360 + ")")
}

req.open("GET", url, true);
req.send();
req.onload = function() {
  values = JSON.parse(req.responseText);
  drawCanvas();
  generateScales();
  dataCircle();
  generateAxis();
}
