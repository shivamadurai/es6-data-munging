var initStackedBarChart = {
    draw: (config) => {
        me = this,
        domEle = config.element,
        stackKey = config.key,
        data = config.data,
        margin = {top: 20, right: 20, bottom: 30, left: 50},
        parseDate = d3.timeParse("%Y"),
        width = 700 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        xScale = d3.scaleBand().range([0, width]).padding(0.5),
        yScale = d3.scaleLinear().range([height, 0]),
        color = d3.scaleOrdinal(d3.schemeCategory20),
        xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y")),
        yAxis =  d3.axisLeft(yScale),
        svg = d3.select("#"+domEle).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var stack = d3.stack()
            .keys(stackKey)
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetNone);

        var layers= stack(data);
            data.sort(function(a, b) { return a.year - b.year; });
            xScale.domain(data.map(d => parseDate(d.year)));
            yScale.domain([0, d3.max(layers[layers.length - 1], d => (d[0] + d[1]))]).nice();

        var layer = svg.selectAll(".layer")
            .data(layers)
            .enter().append("g")
            .attr("class", "layer")
            .style("fill", (d, i) => { return color(i); });

          layer.selectAll("rect")
            .data((d) => { return d; })
            .enter().append("rect")
            .attr("x", d => xScale(parseDate(d.data.year)))
            .attr("y", d => yScale(d[1]))
            .attr("height", d => yScale(d[0]) - yScale(d[1]))
            .attr("width", xScale.bandwidth());

        svg.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + (height+5) + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "axis axis--y")
            .attr("transform", "translate(0,0)")
            .call(yAxis);
    }
};

$.getJSON( "crimes.json", (data) => {
    var resultData = [],
        key = ["theftBelow500", "theftAbove500"];

    _.each(data, (value, key) => {
        resultData.push({
            "year": key,
            "theftBelow500": value.theftBelow500,
            "theftAbove500": value.theftAbove500
        });
    });

    initStackedBarChart.draw({
        data: resultData,
        key: key,
        element: 'stacked-bar'
    });
});
