async function handleInputFormSubmission(event) {
    // default object
    let formTransferData = {
        postalCode: "10247",
        location: "Berlin",
        startDate: "2021-02-17",
        endDate: "2021-02-19"
    };

    // prevent form from submitting
    event.preventDefault();

    // reset values
    document.getElementById("locationResult").style.display = "none";
    document.getElementById('locationImage').src = "";
    document.getElementById("weatherResult").style.display = "none";
    document.getElementById('weatherImage').src = "";
    document.getElementById("weatherForecastResult").style.display = "none";

    // get form values
    formTransferData.postalCode = document.getElementById("postalCode").value;
    formTransferData.location = document.getElementById("location").value;
    formTransferData.startDate = document.getElementById("startDate").value;
    formTransferData.endDate = document.getElementById("endDate").value;


    if (formTransferData.location === "") {
        alert("ERROR: location date must be entered!");
        return;
    }
    if (formTransferData.startDate === "") {
        alert("ERROR: start date must be entered!");
        return;
    }
    if (formTransferData.endDate === "") {
        alert("ERROR: end date must be entered!");
        return;
    }

    // convert input to date object
    formTransferData.endDate = new Date(formTransferData.endDate);
    formTransferData.startDate = new Date(formTransferData.startDate);

    // create date object for today and in seven days
    let d = new Date();
    let today = new Date(d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate());
    let todayPlus7 = new Date(d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + (d.getDate() + 7));

    // error handling to check entered values before executing code
    if (formTransferData.endDate < formTransferData.startDate) {
        alert("ERROR: end date must be later than start date!");
        return;
    }
    if (formTransferData.startDate < today) {
        alert("ERROR: start date can not be in the past!");
        return;
    }

    let returnValue = calculateTravelDurationInDays(formTransferData.startDate, formTransferData.endDate);
    let stringDay = returnValue[1];
    let travelDurationInDays = returnValue[0];

    //default picture if search is not successful
    let webformatURL = "https://cdn.pixabay.com/photo/2016/01/27/17/05/map-of-the-world-1164919_960_720.jpg";

    let tags = "travel world map";

    // request picture for entered location
    let responsePicture = await postRequest("http://localhost:8081/fetchPicture", {location: formTransferData.location});

    let numberPictures = responsePicture.hits.length

    // if picture is returned, overwrite default picture
    if (numberPictures !== 0) {
        // extract the url and the meta tags
        let select = Math.floor((Math.random() * numberPictures - 1) + 1);
        webformatURL = responsePicture.hits[select].webformatURL;
        tags = responsePicture.hits[select].tags;
    }

    // request coordinates for entered location
    let responseCoordinates = await postRequest("http://localhost:8081/fetchCoordinatesFromLocation", {
        postalCode: formTransferData.postalCode,
        location: formTransferData.location
    });

    // extract latitude and longitude
    let lat = responseCoordinates.postalCodes[0].lat;
    let lng = responseCoordinates.postalCodes[0].lng;
    let countryCode = responseCoordinates.postalCodes[0].countryCode;

    // initialize object to receive weather data
    let responseWeather;

    // if submitted start date is more than seven days in the future
    if (formTransferData.startDate > todayPlus7) {
        responseWeather = await postRequest("http://localhost:8081/fetchForecastWeather", {
            lat: lat,
            lng: lng,
            days: travelDurationInDays
        });

        // create output with help of a loop
        let output = `<div id="weatherForecastText">The weather forecast for ${formTransferData.location} is:</div>`;

        // only 16 maximum days in forecast
        if (travelDurationInDays > 15) {
            travelDurationInDays = 15;
        }

        // create forecast display
        for (let i = 0; i < travelDurationInDays; i++) {
            output += `
            <div class="currentForecastWeather">
                <div class="weatherForecastDate">${responseWeather.data[i].datetime.substring(5, 10)}</div>
                <div class="temperatureForecast">${responseWeather.data[i].temp}°C</div>
                <img alt="${responseWeather.data[i].weather.description}" class="weatherForecastImage" src="https://www.weatherbit.io/static/img/icons/${responseWeather.data[i].weather.icon}.png">
            </div>`;
        }

        document.getElementById('weatherForecastResult').innerHTML = output;
        document.getElementById("weatherForecastResult").style.display = "block";

        // if submitted start date is within seven days
    } else {
        responseWeather = await postRequest("http://localhost:8081/fetchCurrentWeather", {lat: lat, lng: lng});

        let temperature = responseWeather.data[0].temp;
        let description = responseWeather.data[0].weather.description;
        let icon = responseWeather.data[0].weather.icon;
        let iconPath = `https://www.weatherbit.io/static/img/icons/${icon}.png`;

        document.getElementById('weatherText').innerHTML = `The current weather in ${formTransferData.location} is:`;
        document.getElementById('weatherDescription').innerHTML = description;
        document.getElementById('temperature').innerHTML = `${temperature}°C`;
        document.getElementById('weatherImage').src = iconPath;
        document.getElementById('weatherImage').alt = description;
        document.getElementById("weatherResult").style.display = "block";
    }

    document.getElementById('locationText').innerHTML = `Here is a small foretaste of what you could see during your ${travelDurationInDays} ${stringDay} trip to ${formTransferData.location}:`;
    document.getElementById('locationImage').src = webformatURL;
    document.getElementById('locationImage').alt = tags;
    document.getElementById("locationResult").style.display = "block";
}

// funtion to send a post request to the node server
async function postRequest(url, data) {
    const request = await fetch(url, {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    try {
        return await request.json();
    } catch (error) {
        console.log("There was an error during postRequest: " + error);
        return error;
    }
}

// calculate travel duration in days
function calculateTravelDurationInDays(startDate, endDate) {
    let travelDurationInDays = (endDate - startDate) / 1000 / 3600 / 24;
    let stringDay;
    if (travelDurationInDays <= 1) {
        stringDay = "day";
    } else {
        stringDay = "days";
    }
    return [travelDurationInDays, stringDay];
}

export {
    handleInputFormSubmission,
    calculateTravelDurationInDays
}