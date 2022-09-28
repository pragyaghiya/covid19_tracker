import "./styles/index.scss";
import { getYesterdaysDate, getDate, getYesterdaysDateDefault, getTwoDaysAgoDate, getTwoDaysAgoDateDefault} from './scripts/date_util';
// import {makeBarChart} from './scripts/d3_bar_chart';
// import { makeHorzBarChart} from './scripts/stacked_horz_bar_chart';
// import { makeHorzBarGraph} from './scripts/horz_bar_graph';
import { generateData} from './scripts/data_manipulation';

function handleClick(checkbox) {

    const calendarInput = document.getElementById("calendarInput");
    let date = getDate(calendarInput.value);
    let yesterday = getYesterdaysDate();
    let twoDaysAgo = getTwoDaysAgoDate();
   
    if (((yesterday.split("/")[0] <= date.split("/")[0]) && (yesterday.split("/")[1]) < parseInt(date.split("/")[1])) || date < "1/22/20") {
        date = yesterday;
    }
    if (date.length === 0) {
        generateData(excludeChina);
    } else {
        generateData(excludeChina, date); 
    }
    
}

function handleCalendar(calendar) {
    let date = getDate(calendar.value);
   

    let yesterday = getYesterdaysDate();
    let twoDaysAgo = getTwoDaysAgoDate();
    // this conditional protects against buggy date renderings if the user forces the day with the arrow keys above yesterdays date
    if (((yesterday.split("/")[0] <= date.split("/")[0]) && (yesterday.split("/")[1]) < parseInt(date.split("/")[1])) || date < "1/22/20") {
        date = yesterday;
        alert("Valid dates are between 1/22/2020" + " and " + yesterday + "20.  Showing default: " + yesterday + "20.")
    }

    const graphTitle = document.getElementById("graphTitle");
   
}

window.addEventListener("DOMContentLoaded", () => {
    const card = document.createElement("div");
    card.classList.add("card", "center");
    document.body.append(card);


    const calendarInput = document.getElementById("calendarInput");
    calendarInput.defaultValue = getYesterdaysDateDefault();

    const countriesButton = document.getElementById("backToCountries")
    countriesButton.addEventListener("click", () => {
      
        window.location.search = "";

        let date = getDate(calendarInput.value);
        let yesterday = getYesterdaysDate()
        let twoDaysAgo = getTwoDaysAgoDate();
        if (((twoDaysAgo.split("/")[0] <= date.split("/")[0]) && (twoDaysAgo.split("/")[1]) < parseInt(date.split("/")[1])) || date < "1/22/20") {
            date = twoDaysAgo;
            calendarInput.value = getTwoDaysAgoDateDefault();
        }

    })


    calendarInput.addEventListener("change", () => {
        handleCalendar(calendarInput);
    })

    generateData();
});