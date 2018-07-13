var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
    },
    width = 480 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    svg;

function draw(config) {
    var data = config.data;

    var x = d3.scaleTime().range([0, width]),
        y = d3.scaleLinear().range([height, 0]);
        z = d3.scaleOrdinal(d3.schemeCategory10),
        color = d3.scaleOrdinal(d3.schemeCategory20),
        xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y"));

    // define the line
    var valueline = d3.line()
        .curve(d3.curveBasis)
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.arrested); });
    // define the line
    var valueline2 = d3.line()
        .curve(d3.curveBasis)
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.notArrested); });


    svg = d3.select("#"+config.element).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");


    data.sort(function(a, b){
        return a.year - b.year;
    });

console.log(data);

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.year; }));
  y.domain([0, d3.max(data, function(d) {
	  return (Math.max(d.arrested, d.notArrested) + 5000); })]);
  z.domain(data.map(function(c) { return c.year; }));


  // Add the valueline path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueline);
  // Add the valueline path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueline2);
  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));
  }

$.getJSON( "assaults.json", (data) => {
    var resultData = [],
        key = ["arrested", "notArrested"];

    _.each(data, (value, key) => {
        resultData.push({
            "year": key,
            "arrested": value.arrested,
            "notArrested": value.notArrested
        });
    });

    draw({
        data: resultData,
        key: key,
        element: 'multiline-bar'
    });
});
