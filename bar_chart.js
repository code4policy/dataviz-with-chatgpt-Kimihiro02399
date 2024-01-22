// Set the dimensions and margins of the graph
var margin = { top: 30, right: 50, bottom: 70, left: 180 }, // Adjusted right margin
    width = 960 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// Append the svg object to the body of the page
var svg = d3.select("#chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Parse the Data
d3.csv("boston_311_2023_by_reason.csv").then(function(data) {
    
    // Sort the data and convert 'Count' to number
    data.forEach(function(d) {
        d.Count = +d.Count; // Convert 'Count' to a number
    });
    
    data.sort(function(a, b) {
        return b.Count - a.Count; // Correct sorting order (largest to smallest)
    });

    // Slice the top 10 reasons
    var top_reasons = data.slice(0, 10);

    // X axis
    var x = d3.scaleLinear()
        .domain([0, d3.max(top_reasons, function(d) { return d.Count; }) * 1.05]) // Add 5% padding
        .range([0, width]);
    
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
            .style("text-anchor", "end");

    // Y axis
    var y = d3.scaleBand()
        .range([0, height])
        .domain(top_reasons.map(function(d) { return d.reason; }))
        .padding(.1);
    
    svg.append("g")
      .call(d3.axisLeft(y));

    // Bars
    svg.selectAll("myRect")
      .data(top_reasons)
      .enter()
      .append("rect")
      .attr("x", x(0))
      .attr("y", function(d) { return y(d.reason); })
      .attr("width", function(d) { return x(d.Count); }) // Use the number value for 'Count'
      .attr("height", y.bandwidth())
      .attr("fill", "#69b3a2");
});
