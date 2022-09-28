import { makeCountryBarChart} from "./country_bar_chart";
import { thousands_separators} from "./date_util";

export const makeHorzBarGraph = (data, excludeChina) => {
   

    const countriesButton = document.getElementById("backToCountries")
    const tooltips = document.getElementsByClassName("tooltip");
    const graphTitle = document.getElementById("graphTitle");

    for (let index = 0; index < tooltips.length; index++) {
        tooltips[index].remove();
    }

    d3.selectAll("g").remove();
    countriesButton.setAttribute("class", "hide");
    
    
    graphTitle.innerHTML = "Global";

    

    let keysWithoutColumn = Object.keys(data).slice(0, -1);
    let valuesWithoutColumn = Object.values(data).slice(0, -1);

    for (let index = 0; index < valuesWithoutColumn.length; index++) {
      
        let adjustedTotalCases = valuesWithoutColumn[index].totalCases - (valuesWithoutColumn[index].totalRecoveries + valuesWithoutColumn[index].totalDeaths);
        Object.assign(valuesWithoutColumn[index], { "Country/Region": keysWithoutColumn[index], "casesMinusDeathsAndRecoveries": adjustedTotalCases});
    }

    valuesWithoutColumn.sort((a, b) => (a.totalCases < b.totalCases ? 1 : -1));

    valuesWithoutColumn = valuesWithoutColumn.slice(0, 50);
    keysWithoutColumn = keysWithoutColumn.slice(0, 50);

    
      
        var maxValue = d3.max(valuesWithoutColumn, function(d) {
            return +d.totalCases;
        })


    let series = d3.stack()
        .keys(["casesMinusDeathsAndRecoveries", "totalRecoveries", "totalDeaths"])
        (valuesWithoutColumn)
        .map(d =>
            (d.forEach((v, idx) => {
                v.key = d.key;
                v.idx = idx;
            }
            ), d)
        )


    var w = 1400;
    var h = 1800;
    let margin = ({ top: 30, right: 10, bottom: 10, left: 150 });

    var x_axisLength = 1200;
    var y_axisLength = 1800;
            
        var svg = d3.select("#horzBarChart")
                .attr("width", w)
                .attr("height", h)
        
        const chart = svg.append('g')

        var xScale = d3.scaleLinear()
            .domain([0, maxValue])
            .range([0, x_axisLength])

        var yScale = d3.scaleBand()
            .domain(valuesWithoutColumn.map((country) => country["Country/Region"]))
            .range([margin.top, y_axisLength - margin.bottom])
            .padding(0.1)

        let sumCases = 0;
        let sumAdjustedCases = 0;
        let sumDeaths = 0;
        let sumRecoveries = 0;
        for (let index = 0; index < valuesWithoutColumn.length; index++) {
            sumCases += valuesWithoutColumn[index].totalCases;
            sumAdjustedCases += valuesWithoutColumn[index].casesMinusDeathsAndRecoveries;
            sumDeaths += valuesWithoutColumn[index].totalDeaths;
            sumRecoveries += valuesWithoutColumn[index].totalRecoveries;
        }

        var tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("font-family", "'Open Sans', sans-serif")
            .style("color", "gray")
            .style("font-size", "14px")
            .style("z-index", "1")
            .style("visibility", "hidden");

        var totalCases = chart.append("text")
            .attr("class", "totalCases")
            .style("font-family", "'Open Sans', sans-serif")
            .style("color", "green")
            .style("font-size", "22px")
            .style("z-index", "10")
            .style("font-weight", "bold")
            .attr("x", () => {
                return x_axisLength - margin.right - 200
            })
            .attr("y", () => {
                return y_axisLength/4
            })
            .text(() => {
                return `Total Reported Cases: ${thousands_separators(sumCases)}`
            })

        var totalAdjustedCount = chart.append("text")
            .attr("class", "totalAdjustedCount")
            .style("font-family", "'Open Sans', sans-serif")
            .style("color", "black")
            .style("font-size", "18px")
            .style("z-index", "10")
            .attr("x", () => {
                return x_axisLength - margin.right - 200
            })
            .attr("y", () => {
                return y_axisLength / 4 + 40
            })
            .text(() => {
                return `Unresolved Reported Cases: ${thousands_separators(sumAdjustedCases)}`
            })

        var totalRecoveries = chart.append("text")
            .attr("class", "totalRecoveries")
            .style("font-family", "'Open Sans', sans-serif")
            .style("color", "black")
            .style("font-size", "18px")
            .style("z-index", "10")
            .attr("x", () => {
                return x_axisLength - margin.right - 200
            })
            .attr("y", () => {
                return y_axisLength / 4 + 60
            })
            .text(() => {
                return `Reported Recoveries: ${thousands_separators(sumRecoveries)}`
            })

        var totalDeaths = chart.append("text")
            .attr("class", "totalDeaths")
            .style("font-family", "'Open Sans', sans-serif")
            .style("color", "black")
            .style("font-size", "18px")
            .style("z-index", "10")
            .attr("x", () => {
                return x_axisLength - margin.right - 200
            })
            .attr("y", () => {
                return y_axisLength / 4 + 80
            })
            .text(() => {
                return `Reported Deaths: ${thousands_separators(sumDeaths)}`
            })

        chart.append("g")
            .selectAll("g")
            .data(series)
            .join("g")
            .selectAll("rect")
            .data(d => d)
            .join("rect")
                .attr("x", function(d) {
                    return xScale(d[0]) + margin.left
                })
                .attr("y", function(d) {
                    return yScale(d.data["Country/Region"])
                }) 
                .attr("width", function(d, i) {
                    return xScale(d[1]) - xScale(d[0])
                })
                .attr("height", yScale.bandwidth())
                .attr("fill", function(d) {
                    if (d.key === "totalDeaths") {
                        return "#bf212e"; 
                    } else if (d.key === "totalRecoveries") {
                        return "#27b376";
                    }  else {
                        return "#264b96"
                    }})
                .on("mouseover", function(d) {
                    let msg = "";
                    if (d.key === "casesMinusDeathsAndRecoveries") {
                        msg = "Unresolved Reported Cases";
                    } else if (d.key === "totalDeaths") {
                        msg = "Reported Deaths";
                    } else if (d.key === "totalRecoveries") {
                        msg = "Reported Recoveries"
                    }
                    return tooltip.style("visibility", "visible").text(`${msg}: ${d.data[d.key]}`)
                })
                .on("mousemove", function (d) {
                    let msg = "";
                    if (d.key === "casesMinusDeathsAndRecoveries") {
                        msg = "Unresolved Reported Cases";
                    } else if (d.key === "totalDeaths") {
                        msg = "Reported Deaths";
                    } else if (d.key === "totalRecoveries") {
                        msg = "Reported Recoveries"
                    }
                    return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px").text(`${msg}: ${thousands_separators(d.data[d.key])}`);
                })
                .on("mouseout", function (d) {
                    return tooltip.style("visibility", "hidden");
                })
                .on("click", function (d) {
                    tooltip.style("visibility", "hidden");
                    if (Object.keys(d.data["Province/State"][0]).length === 0) {
                        alert("No state, county, or state-level data currently available for " + d.data["Country/Region"])
                    } else {
                        makeCountryBarChart(d.data["Country/Region"], d.data["Province/State"]);
                    }
                })

            

    let xAxis = g => g
        .attr("transform", `translate(${margin.left},${margin.top})`)
        .call(d3.axisTop(xScale).ticks(w / 100, "s"))
        .call(g => g.selectAll(".domain").remove())

    svg.append("g")
        .call(xAxis);

    let yAxis = g => g
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale).tickSizeOuter(0))
        .call(g => g.selectAll(".domain").remove())

    svg.append("g")
        .call(yAxis);

}
