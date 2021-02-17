const fetch = require('node-fetch');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path')

const app = express();
module.exports = app;
app.use(express.static('dist'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

// specify start page
app.get('/', function (req, res) {
    res.sendFile('dist/index.html');
})

// specify post endpoints
app.post('/fetchCoordinatesFromLocation', fetchCoordinatesFromLocation);
app.post('/fetchForecastWeather', fetchForecastWeather);
app.post('/fetchCurrentWeather', fetchCurrentWeather);
app.post('/fetchPicture', fetchPicture);

// fetch data from api to convert location into coordinates
async function fetchCoordinatesFromLocation(req, res) {
    try {
        let postalCode = encodeURIComponent(req.body.postalCode);
        let location = encodeURIComponent(req.body.location);
        let response = await fetch(`http://api.geonames.org/postalCodeSearchJSON?postalcode=${postalCode}&placename=${location}&maxRows=1&username=XXXX`);
        let data = await response.json();
        res.status(200).send(data);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}

// fetch data from api to get current weather
async function fetchCurrentWeather(req, res) {
    try {
        let lat = req.body.lat;
        let lng = req.body.lng;
        let response = await fetch(`https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lng}&key=XXXX`);
        let data = await response.json();
        res.status(200).send(data);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}

// fetch data from api to get weather forecast
async function fetchForecastWeather(req, res) {
    try {
        let lat = req.body.lat;
        let lng = req.body.lng;
        let days = req.body.days;
        let response = await fetch(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&days=${days}&key=XXXX`);
        let data = await response.json();
        res.status(200).send(data);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}

// fetch data from api to get picture of location
async function fetchPicture(req, res) {
    try {
        let location = encodeURIComponent(req.body.location);
        let response = await fetch(`https://pixabay.com/api/?key=XXXX&q=${location}&per_page=25&image_type=photo`);
        let data = await response.json();
        res.status(200).send(data);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}

