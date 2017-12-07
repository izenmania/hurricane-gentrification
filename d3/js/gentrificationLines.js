var gentrificationLines = function() {
	var height = 600;
	var width = 400;
	var margin = {top: 20, right: 20, bottom: 20, left: 40};
	var pointRad = 5;
	var svg = null;
	var g = null;

	var showLegend = false;
	var selector = "#detail";

	var figh = height-margin.top-margin.bottom;
	var figw = width-margin.left-margin.right;

	var colors = {"income": "green", "home_value": "magenta", "college": "orange"};
	var lines = ["income", "home_value", "college"];
	var color = d3.scaleOrdinal()
		.range(["green", "magenta", "orange"])
		.domain(lines);

	// Keep track of which visualization
	// we are on and which was the last
	// index activated. When user scrolls
	// quickly, we want to call all the
	// activate functions that they pass.
	var lastIndex = -1;
	var activeIndex = 0;

	var activateFunctions = [];


	var x = d3.scaleOrdinal()
		.range([margin.left, margin.left+figw])
		.domain([2000, 2010]);
	var y = d3.scaleLinear()
		.range([margin.top+figh, margin.top])
		.domain([0, 100]);

	var xAxis = d3.axisBottom()
		.scale(x);
	var yAxis = d3.axisLeft()
		.scale(y)
		.ticks(5);

	var tract = {};
	var tract_ = function(_) {
		var that = this;
		if(!arguments.length) return tract;
		tract = _;
		return that;
	}


	var showLegend_ = function(_) {
		var that = this;
		if(!arguments.length) return showLegend;
		showLegend = _;
		return that;
	}

	var selector_ = function(_) {
		var that = this;
		if(!arguments.length) return selector;
		selector = _;
		return that;
	}

	var height_ = function(_) {
		var that = this;
		if(!arguments.length) return height;
		height = _;

		figh = height-margin.top-margin.bottom;
		y.range([margin.top+figh, margin.top]);

		return that;
	}


	var width_ = function(_) {
		var that = this;
		if(!arguments.length) return width;
		width = _;

		figw = width-margin.left-margin.right;
		x.range([margin.left, margin.left+figw]);

		return that;
	}


	// var chart = function(selection) {
	// 	selection.each(function(tract) {
	// 		console.log(tract);
	// 		svg = d3.select(this).selectAll("svg")
	// 			.data([tract]);

	// 		var svge = svg.enter().append("svg");
	// 		svg = svg.merge(svge)

	// 		svg
	// 			.attr("width", width)
	// 			.attr("height", height);
	// 		svg.append("g");
	// 		setupVis(tract);
	// 	});
	// };

	var prettyLineText = function(line) {
		var text = "";
		switch(line) {
			case "income":
				text = "Median Household Income";
				break;
			case "home_value":
				text = "Median Home Value";
				break;
			case "college":
				text =  "Percent College Educated";
				break;
		}

		return text;
	}

	var plot_ = function() {
		// console.log(tract);
		d3.select(selector).selectAll("svg").remove();

		svg = d3.select(selector).append("svg")
			.attr("height", height+(showLegend*150))
			.attr("width", width);

		svg.append("rect")
			.attr("id", "incThreshRect")
			.attr("class", "step1")
			.attr("x", x(2000))
			.attr("y", y(40))
			.attr("height", y(0)-y(40))
			.attr("width", x(2010)-x(2000))
			.attr("fill", "#DDDDDD");
		svg.append("rect")
			.attr("id", "incThreshRect2")
			.attr("class", "step1")
			.attr("x", x(2000))
			.attr("y", y(100))
			.attr("height", y(40)-y(100))
			.attr("width", x(2010)-x(2000))
			.attr("fill", "#EEEEEE");

		// svg.append("line")
		// 	.attr("id", "incThresh")
		// 	.attr("class", "step1")
		// 	.attr("x1", x(2000))
		// 	.attr("y1", y(40))
		// 	.attr("x2", x(2010))
		// 	.attr("y2", y(40))
		// 	.style("stroke-width", 2)
		// 	.style("stroke", color("income"))
		// 	.style("stroke-dasharray", ("3, 3"))
		// 	.style("opacity", 0.5);

		svg.append("circle")
			.attr("id", "inc2000")
			.attr("class", "step2")
			.attr("cx", x(2000))
			.attr("cy", y(tract.med_income_00_pctile))
			.attr("r", pointRad)
			.style("fill", color("income"))
			.style("opacity", 1);

		svg.append("circle")
			.attr("id", "inc2010")
			.attr("class", "step3")
			.attr("cx", x(2010))
			.attr("cy", y(tract.med_income_10_pctile))
			.attr("r", pointRad)
			.style("fill", color("income"))
			.style("opacity", 1);

		svg.append("line")
			.attr("id", "incLine")
			.attr("class", "step3")
			.attr("x1", x(2000))
			.attr("y1", y(tract.med_income_00_pctile))
			.attr("x2", x(2010))
			.attr("y2", y(tract.med_income_10_pctile))
			.style("stroke-width", 3)
			.style("stroke", color("income"))
			.style("opacity", 1);

		svg.append("circle")
			.attr("id", "hv2000")
			.attr("class", "step4")
			.attr("cx", x(2000))
			.attr("cy", y(tract.med_home_value_00_pctile))
			.attr("r", pointRad)
			.style("fill", color("home_value"))
			.style("opacity", 1);

		svg.append("line")
			.attr("id", "hvThresh")
			.attr("class", "step5")
			.attr("x1", x(2000))
			.attr("y1", y(tract.med_home_value_00_pctile))
			.attr("x2", x(2010))
			.attr("y2", y(tract.med_home_value_ref_pctile))
			.style("stroke-width", 3)
			.style("stroke", color("home_value"))
			.style("stroke-dasharray", ("3, 3"))
			.style("opacity", 0.5);

		svg.append("circle")
			.attr("id", "hv2010")
			.attr("class", "step6")
			.attr("cx", x(2010))
			.attr("cy", y(tract.med_home_value_10_pctile))
			.attr("r", pointRad)
			.style("fill", color("home_value"))
			.style("opacity", 1);

		svg.append("line")
			.attr("id", "hvLine")
			.attr("class", "step6")
			.attr("x1", x(2000))
			.attr("y1", y(tract.med_home_value_00_pctile))
			.attr("x2", x(2010))
			.attr("y2", y(tract.med_home_value_10_pctile))
			.style("stroke-width", 3)
			.style("stroke", color("home_value"))
			.style("opacity", 1);


		svg.append("circle")
			.attr("id", "college2000")
			.attr("class", "step7")
			.attr("cx", x(2000))
			.attr("cy", y(tract.pct_college_00_pctile))
			.attr("r", pointRad)
			.style("fill", color("college"))
			.style("opacity", 1);

		svg.append("line")
			.attr("id", "collegeThresh")
			.attr("class", "step8")
			.attr("x1", x(2000))
			.attr("y1", y(tract.pct_college_00_pctile))
			.attr("x2", x(2010))
			.attr("y2", y(tract.pct_college_ref_pctile))
			.style("stroke-width", 3)
			.style("stroke", color("college"))
			.style("stroke-dasharray", ("3, 3"))
			.style("opacity", 0.5);

		svg.append("circle")
			.attr("id", "college2010")
			.attr("class", "step9")
			.attr("cx", x(2010))
			.attr("cy", y(tract.pct_college_10_pctile))
			.attr("r", pointRad)
			.style("fill", color("college"))
			.style("opacity", 1);

		svg.append("line")
			.attr("id", "collegeLine")
			.attr("class", "step9")
			.attr("x1", x(2000))
			.attr("y1", y(tract.pct_college_00_pctile))
			.attr("x2", x(2010))
			.attr("y2", y(tract.pct_college_10_pctile))
			.style("stroke-width", 3)
			.style("stroke", color("college"))
			.style("opacity", 1);

		svg.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(0, "+(margin.top+figh)+")")
			.call(xAxis);

		svg.append("text")
			.text("Census Year")
			.style("text-anchor", "middle")
			.style("font-weight", "bold")
			.attr("transform", "translate("+(margin.left+width/2)+", "+(margin.top+figh+margin.bottom*2)+")");


		svg.append("g")
			.attr("class", "axis")
			.attr("transform", "translate("+(margin.left)+", 0)")
			.call(yAxis);

		svg.append("text")
			.text("Percentile")
			.style("text-anchor", "middle")
			.style("font-weight", "bold")
			.attr("transform", "translate(10, "+(height/2+margin.top)+"), rotate(-90)")
			.attr("trans");

		if(showLegend) {
			var legend = svg.append("g")
				.attr("transform", "translate("+(width/4)+", "+(height+50)+")");

			// legend.append("text").text("TESTING");
			var lBoxSize = 20;
			for(var i = 0; i < lines.length; i++) {
				legend.append("rect")
					.attr("width", lBoxSize)
					.attr("height", lBoxSize)
					.attr("x", 0)
					.attr("y", i*(lBoxSize+5))
					.style("fill", color(lines[i]));
				

				legend.append("text")
					.text(prettyLineText(lines[i]))
					.attr("x", lBoxSize+10)
					.attr("y", i*(lBoxSize+5)+lBoxSize-7)
					.style("fill", color(lines[i]));
			}
		}
	}

	var public = {
		"plot": plot_,
		"tract": tract_,
		"legend": showLegend_,
		"selector": selector_,
		"height": height_,
		"width": width_
	}

	return public;
}