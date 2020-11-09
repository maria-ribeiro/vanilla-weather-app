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
      let temperatureElement = document.querySelector("#current-temp");
      temperatureElement.innerHTML = temperature;
      let cityName = document.querySelector("#city-name");
      cityName.innerHTML =  response.data.name;
      let dateTime = document.querySelector("#date-time");
      dateTime.innerHTML = nowDateTime();
    });
}

function updateTemperature(location) {
  let currentScale = document.querySelector(".scale");
  if (currentScale.innerHTML === "°C") {
    getTemperature(location, "metric");
  } else {
    getTemperature(location, "imperial");
  }
}

function updateCityTemperature(event){
  event.preventDefault();
  let cityInput = document.querySelector("#city-input").value;
  updateTemperature(`q=${cityInput}`);
}

function updateCoordTemperature(position){
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  updateTemperature(`lat=${latitude}&lon=${longitude}`);
}


// User Geolocation
function toUserLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(updateCoordTemperature);
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
cityForm.addEventListener("submit", updateCityTemperature);

let fahren = document.querySelector("#fahrenheit");
fahren.addEventListener("click", changeScale);

let celsius = document.querySelector("#celsius");
celsius.addEventListener("click", changeScale);


updateTemperature("q=Lisbon", "metric");