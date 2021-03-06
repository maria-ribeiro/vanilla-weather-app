let weatherApiKey = "cef6ae7836ecd17a2e06e0819975713e";
let isCelsius = true;

// Date 
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

let shortDays = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat"
];

let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

function updateTheme(current, sunrise, sunset) {
  let container = document.querySelector(".container");
    if (current < sunset && current >= sunrise ) {
    container.classList.add("light");
    container.classList.remove("dark");
  } else {
    container.classList.add("dark");
    container.classList.remove("light")
  }
}

function nowDateTime() {
  let now = new Date();
  let day = now.getDay();
  let longDay = days[day];
  let date = now.getDate();
  let month = now.getMonth();
  let longMonth = months[month];
  let hours = now.getHours();
  let minutes = now.getMinutes();
  if (minutes<10) {
    minutes = `0${minutes}`;
  }
  return `${longDay}, ${date} ${longMonth}<br/>${hours}:${minutes}`;
}

function getWeekDay(unixTimestamp) {
  let now = new Date(unixTimestamp * 1000);
  let day = now.getDay();
  return shortDays[day];
}

// Skycons Weather Icons 
var skycons = new Skycons({"color": "white"});

let mapSkycons = {
  "01d": Skycons.CLEAR_DAY,
  "01n": Skycons.CLEAR_NIGHT,
  "02d": Skycons.PARTLY_CLOUDY_DAY,
  "02n": Skycons.PARTLY_CLOUDY_NIGHT,
  "03d": Skycons.CLOUDY,
  "03n": Skycons.CLOUDY,
  "04d": Skycons.CLOUDY,
  "04n": Skycons.CLOUDY,
  "09d": Skycons.SHOWERS_DAY,
  "09n": Skycons.SHOWERS_NIGHT,
  "10d": Skycons.RAIN,
  "10n": Skycons.RAIN,
  "11d": Skycons.THUNDER,
  "11n": Skycons.THUNDER,
  "13d": Skycons.SNOW,
  "13n": Skycons.SNOW,
  "50d": Skycons.FOG,
  "50n": Skycons.FOG
}


// Get Weather - Open Weather Map API
function getWeather(location, unit){
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?${location}&units=${unit}&appid=${weatherApiKey}`;
  coordinates = axios
    .get(apiUrl)
    .then(response => {
      console.log(response.data);
      let temperature = Math.round(response.data.main.temp);
      let temperatureElement = document.querySelector("#current-temp");
      temperatureElement.innerHTML = temperature;
      let cityName = document.querySelector("#city-name");
      cityName.innerHTML = response.data.name;
      let dateTime = document.querySelector("#date-time");
      dateTime.innerHTML = nowDateTime();
      let weatherDescription = document.querySelector("#weather-description");
      weatherDescription.innerHTML = response.data.weather[0].description;
      let windSpeed = document.querySelector("#wind-speed");
      if (unit === "metric") {
        windSpeed.innerHTML = Math.round(response.data.wind.speed * 3.6) + "km/h";
      } else {
        windSpeed.innerHTML = Math.round(response.data.wind.speed * 1.609344) + "km/h";
      }
      let humidity = document.querySelector("#humidity");
      humidity.innerHTML = response.data.main.humidity + "%";
      let sunrise = response.data.sys.sunrise;
      let sunset = response.data.sys.sunset;
      let current = response.data.dt;
      updateTheme(current, sunrise, sunset);
      skycons.remove("weather-icon");
      skycons.add("weather-icon", mapSkycons[response.data.weather[0].icon]);
      skycons.play();
      let latitude = response.data.coord.lat;
      let longitude = response.data.coord.lon;
      return { latitude, longitude };
    });

  coordinates.then(coords => {
      apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.latitude}&lon=${coords.longitude}&units=${unit}&exclude=hourly,minutely&appid=${weatherApiKey}`;
      axios
        .get(apiUrl)
        .then(response => {
          let minTemperature = document.querySelector("#min-temperature");
          minTemperature.innerHTML = Math.round(response.data.daily[0].temp.min);
          let maxTemperature = document.querySelector("#max-temperature");
          maxTemperature.innerHTML = Math.round(response.data.daily[0].temp.max);
          for(var i=1; i<6; i++){
            let date = document.querySelector(`#day-${i}`);
            date.innerHTML = getWeekDay(response.data.daily[i].dt);
            let minTemperature = document.querySelector(`#day-${i}-min`);
            minTemperature.innerHTML = Math.round(response.data.daily[i].temp.min);
            let maxTemperature = document.querySelector(`#day-${i}-max`);
            maxTemperature.innerHTML = Math.round(response.data.daily[i].temp.max);
            skycons.remove(`weather-icon-${i}`);
            skycons.add(`weather-icon-${i}`, mapSkycons[response.data.daily[i].weather[0].icon]);
            skycons.play();
          }})
    .catch(err => console.log(err));
    });
}

function updateWeather(location) {
  if (isCelsius) {
    getWeather(location, "metric");
  } else {
    getWeather(location, "imperial");
  }
}

function updateCityWeather(event){
  event.preventDefault();
  let cityInput = document.querySelector("#city-input").value;
  console.log(cityInput);
  updateWeather(`q=${cityInput}`);
}

function updateCoordWeather(position){
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  updateWeather(`lat=${latitude}&lon=${longitude}`);
}


// User Geolocation
function toUserLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(updateCoordWeather);
}

// Celsius <--> Fahrenheit
function changeToFahrenheit(event){
  event.preventDefault();
  if (isCelsius){
    let temperatures = document.querySelectorAll(".temperature");
    temperatures.forEach(temp => {
      temp.innerHTML = Math.round(temp.innerHTML * 9/5 + 32);
    })
    fahren.classList.remove("active");
    celsius.classList.add("active");
    isCelsius = false;
  }
}

function changeToCelsius(event){
  event.preventDefault();
  if (!isCelsius){
    let temperatures = document.querySelectorAll(".temperature");
    temperatures.forEach(temp => {
      temp.innerHTML = Math.round((temp.innerHTML - 32) * 5/9);
    })
    celsius.classList.remove("active");
    fahren.classList.add("active");
    isCelsius = true;
  }
}

let locationButton = document.querySelector("#location");
locationButton.addEventListener("click", toUserLocation);

let cityForm = document.querySelector("#city-form");
cityForm.addEventListener("submit", updateCityWeather);

let fahren = document.querySelector("#fahrenheit");
fahren.addEventListener("click", changeToFahrenheit);

let celsius = document.querySelector("#celsius");
celsius.addEventListener("click", changeToCelsius);

updateWeather("q=lisbon");