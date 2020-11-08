// API Key 
let apiKey = "cef6ae7836ecd17a2e06e0819975713e";

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


// Get Weather - Open Weather Map API
function getTemperature(location, unit){
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?${location}&units=${unit}&appid=${apiKey}`;
  axios
    .get(apiUrl)
    .then(response => {
      let temperature = Math.round(response.data.main.temp);
      let temperatureElement = document.querySelector("#current-degrees");
      temperatureElement.innerHTML = temperature;
      let cityName = document.querySelector("#city-name");
      cityName.innerHTML =  response.data.name;
      let dateTime = document.querySelector("#date-time");
      dateTime.innerHTML = nowDateTime();
    });
}

function updateCityLocation(event){
  event.preventDefault();
  let cityInput = document.querySelector("#city-input").value;
  let currentTemp = document.querySelector("#current-temp");
  if (currentTemp.innerHTML.slice(-1) === "C") {
    getTemperature(`q=${cityInput}`, "metric");
  } else {
    getTemperature(`q=${cityInput}`, "imperial");
  }
}

function updateCoordLocation(position){
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let currentTemp = document.querySelector("#current-temp");
  if (currentTemp.innerHTML.slice(-1) === "C") {
    getTemperature(`lat=${latitude}&lon=${longitude}`, "metric");
  } else {
    getTemperature(`lat=${latitude}&lon=${longitude}`, "imperial");
  }
}

// User Location
function toUserLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(updateCoordLocation);
}

// Celsius <--> Fahrenheit
function celsiusToFahrenheit(celsius){
  return Math.round(celsius * 9/5 + 32);
}

function fahrenheitToCelsius(fahren){
  return Math.round((fahren - 32) * 5/9);
}

function changeToFahrenheit(tempId, degreesId){
  let currentTemp = document.querySelector("#" + tempId);
  let currentDegrees = document.querySelector("#" + degreesId);
  let fahrenDegrees = celsiusToFahrenheit(currentDegrees.innerHTML);
  currentTemp.innerHTML = `<span id="${degreesId}">${fahrenDegrees}</span>°F`;
}

function changeToCelsius(tempId, degreesId){
  let currentTemp = document.querySelector("#" + tempId);
  let currentDegrees = document.querySelector("#" + degreesId);
  let celsiusDegrees = fahrenheitToCelsius(currentDegrees.innerHTML);
  currentTemp.innerHTML = `<span id="${degreesId}">${celsiusDegrees}</span>°C`;
}

function changeScale(event){
  event.preventDefault();
  let currentTemp = document.querySelector("#current-temp");
  if (currentTemp.innerHTML.slice(-1) === "C") {
    changeToFahrenheit("current-temp", "current-degrees");
    for (var i=1; i<=5; i++) {
      changeToFahrenheit(`day-${i}-max`, `day-${i}-max-deg`);
      changeToFahrenheit(`day-${i}-min`, `day-${i}-min-deg`);
    }
    let scaleF = document.querySelector("#fahrenheit");
    scaleF.classList.remove("unselected");
    let scaleC = document.querySelector("#celsius");
    scaleC.classList.add("unselected");
  } else {
    changeToCelsius("current-temp", "current-degrees");
    for (var i=1; i<=5; i++) {
      changeToCelsius(`day-${i}-max`, `day-${i}-max-deg`);
      changeToCelsius(`day-${i}-min`, `day-${i}-min-deg`);
    }
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
cityForm.addEventListener("submit", updateCityLocation);

let fahren = document.querySelector("#fahrenheit");
fahren.addEventListener("click", changeScale);

let celsius = document.querySelector("#celsius");
celsius.addEventListener("click", changeScale);


 
getTemperature("q=Lisbon", "metric");