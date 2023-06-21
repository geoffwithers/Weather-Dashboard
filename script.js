// Global variables
var searchHistory = [];
    if (localStorage.getItem('city')) {
        searchHistory = JSON.parse(localStorage.getItem('city'))
    }
var weatherApiRoomUrl = 'https://api.openweathermap.org'
var weatherApiKey = '8b51c69ac57300c69947dc2afe72a71e';

// DOM element references

var searchBtn = document.getElementById('search-btn');
var searchText = document.getElementById('input');
var currentWeather = document.getElementById('current-container');
var forecastWeather = document.getElementById('forecast-container');
var searchHistoryContainer = document.getElementById('history');


searchBtn.addEventListener('click', searchCity)
function searchCity() {
    getWeatherData(searchText.value)
    getWeatherForecast(searchText.value)
}

function renderSearchHistory() {
    searchHistoryContainer.innerHTML = '';
    for (let i = 0; i < searchHistory.length; i++) {
        searchHistoryContainer.innerHTML += `<button class="btn">${searchHistory[i]}</button>`
    }
    var btn = document.querySelectorAll('.btn')
    for (let i = 0; i < btn.length; i++) {
        btn[i].addEventListener('click', btnSearch)
        
    }
}

renderSearchHistory()

function btnSearch() {
    getWeatherData(this.textContent)
    getWeatherForecast(this.textContent)
}

getWeatherData(searchHistory[searchHistory.length - 1])
getWeatherForecast(searchHistory[searchHistory.length - 1])





function getWeatherData(cityName) {
    var url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${weatherApiKey}&units=imperial`
    fetch(url)
    .then(function(response){
        return response.json();
    })
    .then(function(data) {
        console.log(data)
        if (searchHistory.includes(data.name) === false && data.name) {
            searchHistory.push(data.name)
            localStorage.setItem('city', JSON.stringify(searchHistory))
            renderSearchHistory() 
        }
        
    currentWeather.innerHTML = 
        `<h2>${data.name} ${dayjs.unix(data.dt).format('(MM/DD/YYYY)')}<img src='https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png'></h2>
        <p>Temp: ${data.main.temp} F</p>
        <p>Wind: ${data.wind.speed} MPH</p>
        <p>Humidity: ${data.main.humidity} %</p>`
    })
};

function getWeatherForecast(cityName) {
    var url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${weatherApiKey}&units=imperial`
    fetch(url)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data)
        forecastWeather.innerHTML = ""
        for (let i = 3; i < data.list.length; i=i+8) {
            forecastWeather.innerHTML = forecastWeather.innerHTML + `
            <div>
            <h3>${dayjs.unix(data.list[i].dt).format('MM/DD/YYYY')}</h3>
            <span role="img" aria-label="weather emoji"><img src='https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png'></span>
            <p>Temp: ${data.list[i].main.temp} F</p>
            <p>Wind: ${data.list[i].wind.speed}</p>
            <p>Humidity: ${data.list[i].main.humidity} %</p>
        </div>`
            
        }
    })
};

