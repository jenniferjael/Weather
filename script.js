//GIVEN a weather dashboard with form inputs
var submitBtn = document.querySelector(".submitBtn");
var inputCity = document.querySelector("#inputCity");
var lastCity = document.querySelector(".lastCity");
var cityName = document.querySelector(".cityName");
var dateEl = document.querySelector(".date");
var iconEl = document.querySelector(".icon");
var temperature = document.querySelector(".temperature");
var humidity = document.querySelector(".humidity");
var windSpeed = document.querySelector(".windSpeed");
var uvIndex = document.querySelector(".uvIndex");
var forecastH = document.querySelector(".forecastH");
var dayOne = document.querySelector(".dayOne");
var tempOneDay = document.querySelector(".tempOneDay");
var humidityOneDay = document.querySelector(".humidityOneDay");
var uvContainer = document.querySelector("#uvContainer");

//WHEN I search for a city
//THEN I am presented with current and future conditions for that city and that city is added to the search history
//WHEN I view current weather conditions for that city
//THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
//WHEN I view the UV index
//THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
//WHEN I view future weather conditions for that city


function displayWeather(inputCity) {
  var apiKey = "d149a031b2e8b51c02db17717499e62b";
  var url = `https://api.openweathermap.org/data/2.5/weather?q=${inputCity}&units=imperial&appid=${apiKey}`;

  //fetch instead of ajax to get url and add the reponse to get name,temp,humidity,windspeed
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      //console.log(response);
      var date = new Date(response.dt * 1000);
      console.log(
        date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear()
      );
      var newDate =
        date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
      iconEl.innerHTML = `<img src="http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png"/>`;
      dateEl.textContent = "date:" + " " + newDate;
      cityName.textContent = response.name;
      temperature.textContent = "temp:" + " " + response.main.temp;
      humidity.textContent = "humidity:" + " " + response.main.humidity;
      windSpeed.textContent = "Wind Speed:" + " " + response.wind.speed;

      //getting uvIndex from a different API
      var lon = response.coord.lon;
      var lat = response.coord.lat;
      var uviUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;
      fetch(uviUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (response) {
          //console.log(response);
          uvContainer.textContent = response.current.uvi;
          var uvValue = response.current.uvi;
          if(uvValue >= 0 && uvValue < 3){
            uvContainer.addClass("green");
  
          }

          else if(uvValue >= 3 && uvValue < 6){
            uvContainer.addClass("yellow");

          }
          else if (uvValue >= 6 && uvValue < 8){
            uvContainer.addClass("orange");

          }
          else{
            uvContainer.addClass("red");
          }
        });

      // One call api to get weather forecast for 5 days
      // Added &units=imperial at the end of the URL so that the temperature would display in degrees Fahrenheit
      var forecast = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
      fetch(forecast)
        .then(function (response) {
          return response.json();
        })
        .then(function (response) {
          //console.log(response);
          // will empty the 5 day forecast before rendering the forecast of the next searched city
          $("#five-day-forecast").empty(); 

          // For loop will loop through the api and get us the data for 5 days
          // i starts at day 1 (i = 1), and has to be less than 6.
          for (var i = 1; i < 6; i++) {
            //console.log(response.daily[i].dt); // this will get you a timestamp date
            var date = new Date(response.daily[i].dt * 1000); // converts timestamp into an actual date
            console.log(date); // Date already converted

            // This will convert the date to MM/DD/YYYY format
            var formatDate =
              // getMonth property will get the Index of the month
              // then I'm adding 1 to the index in order to get the correct month number
              date.getMonth() +
              1 +
              "/" +
              date.getDate() +
              "/" +
              date.getFullYear();
            console.log(formatDate);

            var iconForecast = response.daily[i].weather[0].icon;
            console.log(iconForecast); // logs the weather icon id

            var iconForecastUrl = `https://openweathermap.org/img/wn/${iconForecast}@2x.png`;
            console.log(iconForecastUrl); // logs the weather icon image

            var tempForecast = response.daily[i].temp.day;
            console.log(tempForecast); // logs the temperature

            var humidityForecast = response.daily[i].humidity;
            console.log(humidityForecast); // logs the humidity
            
            // Appended 5-day forecast data to the div element with an id of five-day-data
            $("#five-day-forecast").append(`<div id=index${i} <p class="date">${formatDate}</p>
            <img src="${iconForecastUrl}"/>
            <p class="temp">${tempForecast}</p>
            <p class="humidity">${humidityForecast}</p></div>`);
          }
        });
    });
}

// When i click the submit button then,
submitBtn.addEventListener("click", function (event) {
  event.preventDefault();
  // I want to grab the value (the name of the city) and save it to var cityInput
  var cityInput = inputCity.value;
  console.log(cityInput);
  // Then i want to get my local storage and parse it (covert it to an array).
  var storage = JSON.parse(localStorage.getItem("city-storage"));
  // Now, i can push the value (name of the city) into my storage
  storage.push(cityInput);
  // Finally, I will save the new array into my storage as a string
  localStorage.setItem("city-storage", JSON.stringify(storage));

  displayWeather(inputCity.value);
  render();
});
function render(){
 $('#listCities').empty();
  var storage = JSON.parse(localStorage.getItem("city-storage"));
 for(var i = 0; i < storage.length; i++){
   console.log(storage[i]);
   var liTag = $('<li>');
    liTag.attr('id', i);
    $('#listCities').append(liTag);
    $('#' + i).text(storage[i]);
 }
}
var ulTag = $('#listCities');
ulTag.click(function (event) {
  var element = event.target;
  var indexEl = element.id
  var cityName = $('#'+ indexEl);
 var nameEl = cityName.text();
 displayWeather(nameEl);

  // var index = element.id; // will give us the id of the li element the user clicks on
  // console.log(index);
  // var megadeth = $('#' + index); // calling the id of the element and concatenating it with the index variable
  // var city = nmegadeth.text(); // will give us the text (the city name) of the targeted element
  // console.log(city);
  // displayCityWeather(city); // will run the function and give us the data of the city
});


// When I run the application, IF ther isn't a local storage (localstorage === null),
// then I want to creat one called city-storage.
if (localStorage.getItem("city-storage") === null) {
  localStorage.setItem("city-storage", JSON.stringify([]));
}

function deleteItems() {
  localStorage.clear();
  ulTag.empty();
  location.reload();
}

render();