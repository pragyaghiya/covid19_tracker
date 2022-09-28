export const getYesterdaysDate = () => {
    var dateObj = new Date();                          
    dateObj.setDate(dateObj.getDate() - 1);

    let day = dateObj.getDate();
    let month = dateObj.getMonth() + 1;
    let year = (dateObj.getYear() + 1900).toString().slice(2, 4);
    return month + "/" + day + "/" + year;
}

export const getTwoDaysAgoDate = () => {
    var dateObj = new Date();
                          
    dateObj.setDate(dateObj.getDate() - 2);

    let day = dateObj.getDate();
    let month = dateObj.getMonth() + 1;
    let year = (dateObj.getYear() + 1900).toString().slice(2, 4);
    return month + "/" + day + "/" + year;
}

export const getYesterdaysDateDefault = () => {
    var dateObj = new Date();                           
    dateObj.setDate(dateObj.getDate() - 1);

    let day = dateObj.getDate();
    let month = dateObj.getMonth() + 1;
    if (day.toString().length === 1) {
        day = "0" + day;
    }
    if (month.toString().length === 1) {
        month = "0" + month;
    }

    let year = (dateObj.getYear() + 1900).toString();
    return year + "-" + month + "-" + day;
}

export const getTwoDaysAgoDateDefault = () => {
    var dateObj = new Date();                           
    dateObj.setDate(dateObj.getDate() - 2);

    let day = dateObj.getDate();
    let month = dateObj.getMonth() + 1;
    if (day.toString().length === 1) {
        day = "0" + day;
    }
    if (month.toString().length === 1) {
        month = "0" + month;
    }

    let year = (dateObj.getYear() + 1900).toString();
    return year + "-" + month + "-" + day;
}

export const getDate = (date = null) => {

    if (date.length === 0) {
        return getYesterdaysDate();
    }

    if (date) {
        let month = date.slice(5, 7);
        if (month.length === 2) {
            month = month[1];
        }
        let day = date.slice(8, 10);
        if (day.length === 2 && day[0] === "0") {
            day = day[1];
        }
        let year = date.slice(2, 4);
        return month + "/" + day + "/" + year;
    } else {
        getYesterdaysDate()
    }
}

export const thousands_separators = (num) => {
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
}