import { getYesterdaysDate, getYesterdaysDateDefault, getTwoDaysAgoDate} from './date_util';
import {makeHorzBarGraph} from './horz_bar_graph';
import { makeCountryBarChart} from './country_bar_chart';

export const generateData = (excludeChina = false, date = getYesterdaysDate(), countryName = "") => {
    let blacklist = ["Cape Verde", "Cruise Ship", "Kosovo", "Diamond Princess", "Belize", "Laos", "Libya", "West Bank and Gaza", "Guinea-Bissau", "Mali", "Saint Kitts and Nevis"]

    let dataMaster = {};
    d3.csv('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv')
        .then(data => { 
            data.forEach(row => {      
                let rowCountryRegion = row['Country/Region'];
                let provinceState = row["Province/State"];

                if (blacklist.includes(rowCountryRegion)) {
                } else {
                    if (dataMaster[rowCountryRegion]) {
                        if (provinceState !== "") {
                            let provinceStateObj = new Object();
                            Object.assign(provinceStateObj, { provinceState: provinceState, provinceStateCases: parseInt(row[date]) });
                            dataMaster[rowCountryRegion]["Province/State"].push(provinceStateObj);
                        }
                        dataMaster[rowCountryRegion]["Province/State"][provinceState]
                        dataMaster[rowCountryRegion].totalCases += parseInt(row[date])
                    } else {
                        let provinceStateObj = new Object();
                        if (provinceState !== "") {
                            Object.assign(provinceStateObj, {provinceState: provinceState, provinceStateCases: parseInt(row[date])});
                        }

                        dataMaster[rowCountryRegion] = { 
                            "Province/State": [provinceStateObj], 
                            totalCases: parseInt(row[date]), 
                            totalDeaths: undefined, 
                            totalRecoveries: undefined 
                        };
                    }
                }
            })
        })
    .then(
        () => { 
            d3.csv('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv')
                .then(data => {
                    data.forEach(row => {
                        let rowCountryRegion = row['Country/Region'];
                        let provinceState = row["Province/State"];

                        if (blacklist.includes(rowCountryRegion)) {
                        } else {
                            if (dataMaster[rowCountryRegion].totalDeaths) {
                                dataMaster[rowCountryRegion].totalDeaths += parseInt(row[date])
                            } else { 
                                dataMaster[rowCountryRegion].totalDeaths = parseInt(row[date]) 
                            }


                            if (provinceState !== "") {
                                let provinceStateArr = dataMaster[rowCountryRegion]["Province/State"];
                                for (let index = 0; index < provinceStateArr.length; index++) {
                                    if (provinceStateArr[index].provinceState === provinceState) {
                                        let provinceStateObj = provinceStateArr[index];
                                        Object.assign(provinceStateObj, { provinceStateDeaths: parseInt(row[date]) });
                                    }
                                }
                            }
                        }
                    })
                })
        }
    )
    .then(() => { 
        d3.csv('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv')
            .then(data => {
                data.forEach(row => {
                    let rowCountryRegion = row['Country/Region'];
                    let provinceState = row["Province/State"];

                    if (blacklist.includes(rowCountryRegion)) {
                    } else {
                        if (dataMaster[rowCountryRegion].totalRecoveries) {
                            dataMaster[rowCountryRegion].totalRecoveries += parseInt(row[date])
                        } else {
                            dataMaster[rowCountryRegion].totalRecoveries = parseInt(row[date]) 
                        };

                        if (provinceState !== "") {
                            let provinceStateArr = dataMaster[rowCountryRegion]["Province/State"];
                            for (let index = 0; index < provinceStateArr.length; index++) {
                                if (provinceStateArr[index].provinceState === provinceState) {
                                    let provinceStateObj = provinceStateArr[index];
                                    Object.assign(provinceStateObj, { provinceStateRecoveries: parseInt(row[date]) });
                                }
                            }
                        }
                    }
                })

                let title = document.getElementById("asOfTitle")
                
                title.innerHTML = `As of ${date}`;

                let paramCountry = window.location.search.slice(window.location.search.indexOf("=") + 1);

            })
        }
    )
}






