import {generateData} from './data_manipulation';
import { getDate, thousands_separators} from './date_util';

export const makeCountryBarChart = (countryName, countryData) => {
    let countryArr = countryData;
    const calendarInput = document.getElementById("calendarInput");
    const countriesButton = document.getElementById("backToCountries")
    const chinaCheckbox = document.getElementById("chinaCheckbox"); 
    const chinaCheckboxLabel = document.getElementById("chinaCheckboxLabel"); 
    const countryDateInput = document.getElementById("calendarInputCountry");
    const graphTitle = document.getElementById("graphTitle");
    const checkboxOutline = document.getElementsByClassName("toggle");

    const tooltips = document.getElementsByClassName("tooltip");
    for (let index = 0; index < tooltips.length; index++) {
        tooltips[index].remove();
    }

   
    if (checkboxOutline[0]) {
        checkboxOutline[0].setAttribute("class", "hide");
    }
    chinaCheckbox.setAttribute("class", "hide");
    chinaCheckboxLabel.setAttribute("class", "hide");
    countriesButton.setAttribute("class", "show");
    graphTitle.innerHTML = countryName;
 
        d3.selectAll("g").remove();

        let filteredCountryArr = countryArr.filter(provinceState => provinceState.provinceStateCases > 10);
        
        filteredCountryArr.sort((a, b) => (a.provinceStateCases < b.provinceStateCases ? 1 : -1));

        for (let index = 0; index < filteredCountryArr.length; index++) {
            let adjustedTotalCases = filteredCountryArr[index].provinceStateCases - (filteredCountryArr[index].provinceStateDeaths + filteredCountryArr[index].provinceStateRecoveries);
            Object.assign(filteredCountryArr[index], { "provinceStateAdjustedCases": adjustedTotalCases});       
        }

        let series = d3.stack()
            .keys(["provinceStateAdjustedCases", "provinceStateRecoveries","provinceStateDeaths"])
            (filteredCountryArr)
            .map(d =>
                (d.forEach((v, idx) => {
                    v.key = d.key;
                    v.idx = idx;
                }
                ), d)
            )


        var maxValue = d3.max(filteredCountryArr, function (d) {
            return +d.provinceStateCases;
        });

        var w = 1400;
        var h = 1200;
        let margin = ({ top: 30, right: 10, bottom: 10, left: 150 });

        var x_axisLength = 1200;
        var y_axisLength = 1200;

        var xScale = d3.scaleLinear()
            .domain([0, maxValue])
            .range([0, x_axisLength])

        var yScale = d3.scaleBand()
            .domain(filteredCountryArr.map((provinceState) => provinceState["provinceState"]))
            .range([margin.top, y_axisLength - margin.bottom])
            .padding(0.1)


        
        let sumCases = 0;
        let sumAdjustedCases = 0;
        let sumDeaths = 0;
        let sumRecoveries = 0;
        for (let index = 0; index < filteredCountryArr.length; index++) {
            sumCases += filteredCountryArr[index].provinceStateCases;
            sumAdjustedCases += filteredCountryArr[index].provinceStateAdjustedCases;
            sumDeaths += filteredCountryArr[index].provinceStateDeaths;
            sumRecoveries += filteredCountryArr[index].provinceStateRecoveries;
        }

    
 
        var svg = d3.select("#horzBarChart")
            .attr("width", w)
            .attr("height", h)

        const chart = svg.append('g');

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
            return y_axisLength / 4
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

        var tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("font-family", "'Open Sans', sans-serif")
            .style("color", "gray")
            .style("font-size", "14px")
            .style("z-index", "10")
            .style("visibility", "hidden");

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
                    return yScale(d.data.provinceState)
                })
                .attr("width", function(d) {
                    return xScale(d[1]) - xScale(d[0]); 
                })
                .attr("height", yScale.bandwidth())
            .attr("fill", function (d) {
                if (d.key === "provinceStateDeaths") {
                    return "#bf212e";
                } else if (d.key === "provinceStateRecoveries") {
                    return "#27b376";
                } else {
                    return "#264b96"
                }
            })
            .on("mouseover", function (d) {
                let msg = "";
                if (d.key === "provinceStateAdjustedCases") {
                    msg = "Unresolved Reported Cases";
                } else if (d.key === "provinceStateDeaths") {
                    msg = "Reported Deaths";
                } else if (d.key === "provinceStateRecoveries") {
                    msg = "Reported Recoveries"
                }
                return tooltip.style("visibility", "visible").text(`${msg}: ${d.data[d.key]}`)
            })
            .on("mousemove", function (d) {
                let msg = "";
                if (d.key === "provinceStateAdjustedCases") {
                    msg = "Unresolved Reported Cases";
                } else if (d.key === "provinceStateDeaths") {
                    msg = "Reported Deaths";
                } else if (d.key === "provinceStateRecoveries") {
                    msg = "Reported Recoveries"
                }
                return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px").text(`${msg}: ${thousands_separators(d.data[d.key])}`);
            })
            .on("mouseout", function (d) {
                return tooltip.style("visibility", "hidden");
            })
            .on("click", function (d) {
                window.location.search = "";

                tooltip.style("visibility", "hidden");
                generateData(excludeChina, getDate(calendarInput.value));
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