// API Key 
let weatherApiKey = "cef6ae7836ecd17a2e06e0819975713e";

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

function nowDateTime () {
  let now = new Date();
  let day = now.getDay();
  let longDay = days[day];
  let date = now.getDate();
  let month = now.getMonth();
  let longMonth = months[month];
  let hours = now.getHours();
  let minutes = now.getMinutes();
  return `${longDay}, ${date} ${longMonth} <br/> ${hours}:${minutes}`;
}

function getTime(unixTimestamp) {
  let now = new Date(unixTimestamp * 1000);
  let hours = now.getHours();
  let minutes = now.getMinutes();
  return `${hours}:${minutes}`;
}

function getDate(unixTimestamp) {
  let now = new Date(unixTimestamp * 1000);
  let date = now.getDate();
  let month = now.getMonth() + 1;
  return `${date}/${month}`;
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
      let temperature = Math.round(response.data.main.temp);
      let temperatureElement = document.querySelector("#current-temp");
      temperatureElement.innerHTML = temperature;
      let cityName = document.querySelector("#city-name");
      cityName.innerHTML = response.data.name;
      let dateTime = document.querySelector("#date-time");
      dateTime.innerHTML = nowDateTime();
      let weatherDescription = document.querySelector("#weather-description");
      weatherDescription.innerHTML = response.data.weather[0].description;
      let sunrise = document.querySelector("#sunrise");
      sunrise.innerHTML= getTime(response.data.sys.sunrise);
      let sunset = document.querySelector("#sunset");
      sunset.innerHTML = getTime(response.data.sys.sunset);
      let windSpeed = document.querySelector("#wind-speed");
      windSpeed.innerHTML = Math.round(response.data.wind.speed * 3.6);
      let humidity = document.querySelector("#humidity");
      humidity.innerHTML = response.data.main.humidity;
      let latitude = response.data.coord.lat;
      let longitude = response.data.coord.lon;
      skycons.remove("weather-icon");
      skycons.add("weather-icon", mapSkycons[response.data.weather[0].icon]);
      skycons.play();
      return { latitude, longitude };
    });

    coordinates.then(coords => {
      apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.latitude}&lon=${coords.longitude}&units=${unit}&exclude=hourly,minutely&appid=${weatherApiKey}`;
      axios
        .get(apiUrl)
        .then(response => {
          console.log(response.data);
          let minTemperature = document.querySelector("#min-temperature");
          minTemperature.innerHTML = Math.round(response.data.daily[0].temp.min);
          let maxTemperature = document.querySelector("#max-temperature");
          maxTemperature.innerHTML = Math.round(response.data.daily[0].temp.max);
          for(var i=1; i<6; i++){
            let date = document.querySelector(`#day-${i}`);
            date.innerHTML = getDate(response.data.daily[i].dt);
            let minTemperature = document.querySelector(`#day-${i}-min`);
            minTemperature.innerHTML = Math.round(response.data.daily[i].temp.min);
            let maxTemperature = document.querySelector(`#day-${i}-max`);
            maxTemperature.innerHTML = Math.round(response.data.daily[i].temp.max);
            skycons.remove(`weather-icon-${i}`);
            skycons.add(`weather-icon-${i}`, mapSkycons[response.data.daily[i].weather[0].icon]);
            skycons.play();
          }          
    })
    .catch(err => console.log(err));


    });

}


function updateWeather(location) {
  let currentScale = document.querySelector(".scale");
  if (currentScale.innerHTML === "°C") {
    getWeather(location, "metric");
  } else {
    getWeather(location, "imperial");
  }
}

function updateCityWeather(event){
  event.preventDefault();
  let cityInput = document.querySelector("#city-input").value;
  updateWeather(`q=${cityInput}`);
}

function updateCoordWeather(position){
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  updateWeather(`lat=${latitude}&long=${longitude}`);
}


// User Geolocation
function toUserLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(updateCoordWeather);
}

// Celsius <--> Fahrenheit
function celsiusToFahrenheit(celsius){
  return Math.round(celsius * 9/5 + 32);
}

function fahrenheitToCelsius(fahren){
  return Math.round((fahren - 32) * 5/9);
}

function changeToFahrenheit(){
  let temperatures = document.querySelectorAll(".temperature");
  temperatures.forEach(temp => {
    temp.innerHTML = celsiusToFahrenheit(temp.innerHTML);
  })
  let scales = document.querySelectorAll(".scale");
  scales.forEach(scale => {
    scale.innerHTML = "°F";
  })
}

function changeToCelsius(){
  let temperatures = document.querySelectorAll(".temperature");
  temperatures.forEach(temp => {
    temp.innerHTML = fahrenheitToCelsius(temp.innerHTML);
  })
  let scales = document.querySelectorAll(".scale");
  scales.forEach(scale => {
    scale.innerHTML = "°C";
  })
}

function changeScale(event){
  event.preventDefault();
  let currentScale = document.querySelector(".scale");
  if (currentScale.innerHTML === "°C") {
    changeToFahrenheit();
    let scaleF = document.querySelector("#fahrenheit");
    scaleF.classList.remove("unselected");
    let scaleC = document.querySelector("#celsius");
    scaleC.classList.add("unselected");
  } else {
    changeToCelsius();
    let scaleF = document.querySelector("#fahrenheit");
    scaleF.classList.add("unselected");
    let scaleC = document.querySelector("#celsius");
    scaleC.classList.remove("unselected");
  }
}


// Event Listeners
let locationButton = document.querySelector("#location");
locationButton.addEventListener("click", toUserLocation);

let cityForm = document.querySelector("#city-form");
cityForm.addEventListener("submit", updateCityWeather);

let fahren = document.querySelector("#fahrenheit");
fahren.addEventListener("click", changeScale);

let celsius = document.querySelector("#celsius");
celsius.addEventListener("click", changeScale);


updateWeather("q=lisbon");