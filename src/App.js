import React, { useState } from 'react';
import './App.css';

function convertOffsetToLocalTime(offsetInSeconds) {
  const offsetInHours = Math.floor(offsetInSeconds / 3600) - 1;
  const offsetInMinutes = Math.floor((offsetInSeconds % 3600) / 60);

  const utcNow = new Date();
  const localTime = new Date(utcNow.getTime() + offsetInHours * 60 * 60 * 1000 + offsetInMinutes * 60 * 1000);

  return localTime.toLocaleString();
}

function convertKelvinToCelsius(kelvin) {
  return Math.floor(kelvin - 273.15);
}

function convertKelvinToFahrenheit(kelvin) {
  return Math.floor((kelvin - 273.15) * 9/5 + 32);
}

function App() {

  const weatherDiv = document.getElementById('weather-infos');

  // input value of city
  const [input, setInput] = useState('');

  // fetched values
  const [cityName, setCityName] = useState('');
  const [weather, setWeather] = useState('');
  const [temp, setTemp] = useState('273.15');
  const [localTime, setLocalTime] = useState('');

  let tempC = convertKelvinToCelsius(temp);
  let tempF = convertKelvinToFahrenheit(temp);
  
  const getWeather = () => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=${process.env.REACT_APP_API_KEY}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setCityName(data.name);
        setWeather(data.weather[0].main);
        setTemp(data.main.temp);
        setLocalTime(convertOffsetToLocalTime(data.timezone));
      });
    weatherDiv.removeAttribute('hidden');
  }

  return (
    <div className="App">
      <section id="weather-app">
        <h1>Weather App</h1>
        <input id="city" type="text" placeholder="City" onChange={(e) => setInput(e.target.value)} />
        <button id="get-weather" type='submit' onClick={getWeather}>Get Weather</button>
        <div id='weather-infos' hidden>
          <p className="city-name">City: {cityName}</p>
          <p className="weather">Weather: {weather}</p>
          <p className='temp'>Temperature (degree Celcius): {tempC}°C</p>
          <p className='temp'>Temperature (degree Fahrenheit): {tempF}°F</p>
          <p className="local-time">Local Time: {localTime}</p>
        </div>
      </section>
    </div>
  );
}

export default App;
