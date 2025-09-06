import React, { useState } from 'react';
import './App.css';

// import images as variables
import clearSkyImg from './assets/Clear Sky.png';
import fewCloudsImg from './assets/Few Clouds.png';
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
        setWeather(data.weather[0].main);
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
      case 'Clear': return clearSkyImg;
      case 'Clouds': return fewCloudsImg;
      case 'Squall':
      case 'Broken clouds': return brokenCloudsImg;
      case 'Rain':
      case 'Drizzle':
      case 'Shower rain': return rainImg;
      case 'Tornado':
      case 'Thunderstorm': return thunderstormImg;
      case 'Smoke':
      case 'Haze':
      case 'Dust':
      case 'Fog':
      case 'Sand':
      case 'Mist': return mistImg;
      case 'Snow': return snowImg;
      default: return clearSkyImg;
    }
  };

  return (
    <div className="App">
      <section>
        <div id='background'>
          {/* Show image based on weather */}
          {getWeatherImage() && <img src={getWeatherImage()} alt={weather} />}
        </div>
        <div id="weather-app">
          <nav>
            <ul>
              <li><h1>Weather App</h1></li>
              <li><p className='temp'>{tempC}°C</p></li>
              <li><p className='temp'>{tempF}°F</p></li>
            </ul>
          </nav>
          <input id="city" type="text" placeholder="Enter a city's name here" onChange={(e) => setInput(e.target.value)} />
          <br />
          <button id="get-weather" type='submit' onClick={getWeather}>Get Weather</button>
          {error && <p style={{color: 'red'}}>{error}</p>}
          {showWeather && (
            <div id='weather-infos'>
              <p className="city-name">City: {cityName}</p>
              <p className="weather">Weather: {weather}</p>
              <p className="local-time">Local Time: {localTime}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default App;