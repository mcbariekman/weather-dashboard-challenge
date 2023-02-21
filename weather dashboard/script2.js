

// Using OpenWeatherMap API key to search the weather forecast
var API_KEY = "b47ecfaa7e6abc766a968ff6b7634428"; 

// Using search history for local storage
var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

// Using current weather data to from the API for a given city to pull the geographical data
function getWeather(city) {
    var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + API_KEY +"&units=imperial";
    $.ajax({
        url: queryURL,
        method: "GET",
    })
    .then(function (response) {
        console.log(response);
        renderCurrentWeather(response);
        getForecast(city);
    })
    .catch(function (error) {
        console.log(error);
        alert("Error: " + error.responseJSON.message);
    });
}


// The forecast data is retrieved from OpenWeatherMap API
function getForecast(city) {
    var queryURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&appid=" +
    API_KEY +
    "&units=imperial";
    $.ajax({
        url: queryURL,
        method: "GET",
    })
    .then(function (response) {
        console.log(response);
        renderForecast(response);
    })
    .catch(function (error) {
        console.log(error);
        alert("Error: " + error.responseJSON.message);
    });
}

// Rendering the temp, humidity, wind for the city onto the wepage
function renderCurrentWeather(data) {
    var city = data.name;
    var date = moment.unix(data.dt).format("MMMM D, YYYY");
    var icon =
    "http://openweathermap.org/img/w/" +
    data.weather[0].icon +
    ".png";
    var temp = Math.round(data.main.temp) + " °F";
    var humidity = data.main.humidity + " %";
    var wind = Math.round(data.wind.speed) + " mph";
    var currentWeatherHTML = `
    <div class="card">
    <div class="card-body">
    <h5>${city} <img src="${icon}" alt="${data.weather[0].description}" /></h5>
    <p>Current Date: ${date}</p>
    <p>Temperature: ${temp}</p>
    <p>Humidity: ${humidity}</p>
    <p>Wind Speed: ${wind}</p>
    </div>
    </div>
    `;
    $("#current-weather").html(currentWeatherHTML);
}

// Rendering the forecast for the city onto the webpage
function renderForecast(data) {
    var forecastHTML = "";
    for (var i = 0; i < data.list.length; i++) {
        if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
            var date = moment.unix(data.list[i].dt).format("MMMM D, YYYY");
            var icon =
            "http://openweathermap.org/img/w/" +
            data.list[i].weather[0].icon +
            ".png";
            var temp = Math.round(data.list[i].main.temp) + " °F";
            var humidity = data.list[i].main.humidity +" %";
            var wind = Math.round(data.list[i].wind.speed) + " mph";
            forecastHTML += `
                <div class="card">
                <div class="card-body">
                <h5>${date} <img src="${icon}" alt="${data.list[i].weather[0].description}" /></h5>
                <p>Temperature: ${temp}</p>
                <p>Humidity: ${humidity}</p>
                <p>Wind Speed: ${wind}</p>
                </div>
            </div>
        `;
        }
    }
    $("#forecast").html(forecastHTML);
}

// Define a function that renders the search history on the page.
function renderSearchHistory() {
    var searchHistoryHTML = "";
    for (var i = 0; i < searchHistory.length; i++) {
        searchHistoryHTML += `
            <button type="button" class="list-group-item list-group-item-action">${searchHistory[i]}</button>
        `;
    }
    $("#search-history").html(searchHistoryHTML);
}

// Render the search history when the page loads.
renderSearchHistory();

// Listen for the submit event on the search form and call the searchWeather function.
$("form").submit(function (event) {
    event.preventDefault();
    searchWeather();
});

// Listen for click events on the search history buttons and call the getWeather function with the city name as the argument.
$("#search-history").on("click", ".list-group-item", function () {
    var city = $(this).text();
    getWeather(city);
});

// Define a function that handles the search form submission.
function searchWeather() {
    var city = $("#city-input").val().trim();
    if (city !== "") {
        getWeather(city);
        searchHistory.push(city);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        renderSearchHistory();
        $("#city-input").val("");
        }
};
//event listner for the search buton
$("#search-btn").on("click", function() {
    searchWeather();
});


