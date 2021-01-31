//GIVEN a weather dashboard with form inputs
var submitBtn = document.querySelector(".submitBtn");
var inputCity = document.querySelector("#inputCity");
var lastCity = document.querySelector(".lastCity");
var cityName = document.querySelector(".cityName");
var date = document.querySelector(".date");
var icon = document.querySelector(".icon");
var temperature = document.querySelector(".temperature");
var humidity = document.querySelector(".humidity");
var windSpeed = document.querySelector(".windSpeed");
var uvIndex = document.querySelector(".uvIndex");
var forecastH = document.querySelector(".forecastH")

//WHEN I search for a city
//THEN I am presented with current and future conditions for that city and that city is added to the search history
//WHEN I view current weather conditions for that city
//THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
//WHEN I view the UV index
//THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
//WHEN I view future weather conditions for that city

submitBtn.addEventListener("click", function () {
  displayWeather(inputCity.value);
});

function displayWeather(inputCity) {
  var apiKey = "d149a031b2e8b51c02db17717499e62b";
  var url = `https://api.openweathermap.org/data/2.5/weather?q=${inputCity}&units=imperial&appid=${apiKey}`;

 //fetch instead of ajax to get url and add the reponse to get name,temp,humidity,windspeed
  fetch(url).then(function (response) {
    return response.json();
  }).then(function (response) {
    console.log(response);
    cityName.textContent = response.name
    temperature.textContent = "temp:"+" "+response.main.temp
    humidity.textContent = "humidity:"+" "+response.main.humidity
    windSpeed.textContent = "Wind Speed:"+" "+response.wind.speed
    
    //getting uvIndex from a different API
    var lon = response.coord.lon
    var lat = response.coord.lat
    var uviUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    fetch(uviUrl).then(function (response) {
        return response.json();
      }).then(function (response) {
        console.log(response);
       uvIndex.textContent = "UV Index:"+ " "+response.current.uvi
       
  });
 
  
})
}


//THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
//WHEN I click on a city in the search history
//THEN I am again presented with current and future conditions for that city
//WHEN I open the weather dashboard
//THEN I am presented with the last searched city forecast
