import React, { useState } from 'react';
import './App.css';

// import images as variables
import clearSkyImg from './assets/Clear Sky.png';
import fewCloudsImg from './assets/Few Clouds.png';
import scatteredCloudsImg from './assets/Scattered Clouds.png';
import brokenCloudsImg from './assets/Broken Clouds.png';
import rainImg from './assets/Rain.png';
import thunderstormImg from './assets/Thunderstorm.png';
import mistImg from './assets/Mist.png';
import snowImg from './assets/Snow.png';

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

  // input value of city
  const [input, setInput] = useState('');

  // fetched values
  const [cityName, setCityName] = useState('');
  const [weather, setWeather] = useState('');
  const [temp, setTemp] = useState('273.15');
  const [localTime, setLocalTime] = useState('');
  const [error, setError] = useState('');
  const [showWeather, setShowWeather] = useState(false); // control visibility

  let tempC = convertKelvinToCelsius(temp);
  let tempF = convertKelvinToFahrenheit(temp);
  
  const getWeather = () => {
    setError('');
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=${process.env.REACT_APP_API_KEY}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('City not found or API error');
        }
        return response.json();
      })
      .then(data => {
        setCityName(data.name);
        setWeather((data.weather[0].description).charAt(0).toUpperCase() + (data.weather[0].description).slice(1).toLowerCase());
        setTemp(data.main.temp);
        setLocalTime(convertOffsetToLocalTime(data.timezone));
        setShowWeather(true); // show weather info
      })
      .catch(err => {
        setError(err.message);
        setShowWeather(false); // hide weather info
      });
  }

  const getWeatherImage = () => {
    switch (weather) {
      case 'Clear sky': return clearSkyImg;
      case 'Few clouds': return fewCloudsImg;
      case 'Scattered clouds': return scatteredCloudsImg;
      case 'Broken clouds': return brokenCloudsImg;
      case 'Rain':
      case 'Shower rain': return rainImg;
      case 'Thunderstorm': return thunderstormImg;
      case 'Mist': return mistImg;
      case 'Snow': return snowImg;
      default: return null;
    }
  };

  return (
    <div className="App">
      <section id="weather-app">
        <div id='background'>
          {/* Show image based on weather */}
          {getWeatherImage() && <img src={getWeatherImage()} alt={weather} />}
        </div>
        <h1>Weather App</h1>
        <input id="city" type="text" placeholder="Enter a city's name here" onChange={(e) => setInput(e.target.value)} />
        <button id="get-weather" type='submit' onClick={getWeather}>Get Weather</button>
        {error && <p style={{color: 'red'}}>{error}</p>}
        {showWeather && (
          <div id='weather-infos'>
            <p className="city-name">City: {cityName}</p>
            <p className="weather">Weather: {weather}</p>
            <p className='temp'>Temperature (degree Celcius): {tempC}°C</p>
            <p className='temp'>Temperature (degree Fahrenheit): {tempF}°F</p>
            <p className="local-time">Local Time: {localTime}</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;