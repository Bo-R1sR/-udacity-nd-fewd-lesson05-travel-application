# Travel Application

This application lets you enter a travel destination with an optional postal code.
You have to specify the start and end date of the journey.

Once you press submit the app will give you the current weather if the start date is within one week or
 a weather forecast if the start date is more than seven days in the future. Additionally you get a change of viewing 
a picture of your target location.

As a bonus the app calculates the total travel length.

This software uses three different APIs.

First the api.geonames.org API to fetch the coordinates of your entered location.
Second the api.weatherbit.io to fetch the weather.
Third the pixabay.com/api to fetch a preview picture for your travel location.

## how to?

Simply start the node server available in /src/server/startServer.js and browse to localhost:8081
In the form fields enter all required values.
Press submit and wait a few seconds vor the api to react.

## technical details

This project uses webpack for creating a production or development environment.
Simply type npm run build-dev or npm run build-prod to update the code or let the development server run.

All files for production can be found in the dist-folder.