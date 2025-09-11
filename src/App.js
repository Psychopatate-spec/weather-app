/*************************************************************************************************************************/
  // Imports


import React, { useState } from 'react';
import './App.css';
import Speechbubble from './Speechbubble.jsx';

// import images and sfx as variables
import clearSkyImg from './assets/Clear Sky.png';
import fewCloudsImg from './assets/Few Clouds.png';
import brokenCloudsImg from './assets/Broken Clouds.png';
import rainImg from './assets/Rain.png';
import thunderstormImg from './assets/Thunderstorm.png';
import mistImg from './assets/Mist.png';
import snowImg from './assets/Snow.png';
import calcifer from './assets/Calcifer.png';
import sunglasses from './assets/Sunglasses.png';
import keyboardClickSound from './assets/sfx/keyboard-click.mp3';
import mouseClickSound from './assets/sfx/mouse-click.mp3';

// Initialize audio elements
const keyboardClick = new Audio(keyboardClickSound);
const mouseClick = new Audio(mouseClickSound);


/*************************************************************************************************************************/
  // Functions for basic conversions


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



/*************************************************************************************************************************/
  // Variables and Functions for the weather App



function App() {

  // input value of city
  const [input, setInput] = useState('');

  // fetched values
  const [weather, setWeather] = useState('');
  const [temp, setTemp] = useState(293.15); // default to number
  const [localTime, setLocalTime] = useState('');
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [calciferMessage, setCalciferMessage] = useState('');
  const [isBubbleVisible, setIsBubbleVisible] = useState(false);
  const [error, setError] = useState(' ');

  let tempC = convertKelvinToCelsius(temp);
  let tempF = convertKelvinToFahrenheit(temp);

  
  const getWeather = () => {
    // Reset and play the click sound
    mouseClick.currentTime = 0;
    mouseClick.play().catch(e => console.log('Audio play failed:', e));
    setError('');
    // Hide bubble before making the API call
    setIsBubbleVisible(false);
    
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=${process.env.REACT_APP_API_KEY}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('City not found or API error');
        }
        return response.json();
      })
      .then(data => {
        setWeather(data.weather[0].main);
        setTemp(data.main.temp);
        setLocalTime(convertOffsetToLocalTime(data.timezone));
        // Small delay to ensure state updates before showing bubble
        setTimeout(() => {
          getCalciferMessage();
        }, 100);
      })
      .catch(err => {
        setError(err.message);
        // Show error message in bubble
        setTimeout(() => {
          setCalciferMessage("Hein ? Where is it ?");
          setIsBubbleVisible(true);
        }, 100);
      });
  }

  const fetchCities = async (search) => {
    if (search.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=5&appid=${process.env.REACT_APP_API_KEY}`
      );
      const data = await res.json();
      if (data.length === 0) {
        setSuggestions([{name: 'No results', country: ''}]);
      } else {
        setSuggestions(data);
      }
    } catch (err) {
      console.error("Error fetching cities:", err);
      setSuggestions([{ name: "Error fetching cities", country: "" }]);
    }
  };

  // Return a message string instead of setting state
  const getWeatherMessage = () => {
    if (error === 'City not found or API error') {
      return "Never heard about it!";
    } else if (weather === 'Clouds') {
      return "It's cloudy outside!";
    } else if (weather === 'Squall' || weather === 'Broken clouds' || weather === 'Broken Clouds') {
      return "The sky is gray today...";
    } else if (weather === 'Rain' || weather === 'Drizzle' || weather === 'Shower rain' || weather === 'Shower Rain') {
      return "It's raining outside!";
    } else if (weather === 'Tornado' || weather === 'Thunderstorm') {
      return "It's stormy outside!";
    } else if (
      weather === 'Smoke' || weather === 'Haze' || weather === 'Dust' ||
      weather === 'Fog' || weather === 'Sand' || weather === 'Mist'
    ) {
      return "It's foggy outside!";
    } else if (weather === 'Snow') {
      return "It's snowing outside!";
    } else if (weather === 'Clear') {
      return "It's crystal clear outside!";
    } else {
      return "How may I help you?";
    }
  }

  const getCalciferMessage = () => {
    const randomInt = Math.floor(Math.random() * 2);
    let message = "";
    
    if (error === 'City not found or API error') {
      message = "Hein ? Where is it ?";
    } else if (weather === 'Clear') {
      if (temp > 293.15) {
        message = randomInt === 0 
          ? "Take off your sunglasses and your shirt!" 
          : "Perfect beach weather, don't you think?";
      } else {
        message = randomInt === 0 
          ? "Perfect weather for a walk!" 
          : "Ahhh... I'm feeling great in this clear weather!";
      }
    } else if (temp > 293.15) {
      message = randomInt === 0 
        ? "Wouhou ! Take off your shirts !" 
        : "It's so hot, I'm burning up!";
    } else if (temp < 273.15) {
      message = randomInt === 0 
        ? "Brr... It's freezing cold !" 
        : "I wish I could wear a scarf...";
    } else if (temp <= 283.15) {
      message = randomInt === 0 
        ? "It's kinda cold no ?" 
        : "I'm shivering !";
    } else {
      // Default message for any other case
      message = randomInt === 0 
        ? "The weather is interesting today!" 
        : "What a day for some weather!";
    }
    
    setCalciferMessage(message);
    setIsBubbleVisible(true);
  }

  const getWeatherImage = () => {
    switch (weather) {
      case 'Clear': return clearSkyImg;
      case 'Clouds': return fewCloudsImg;
      case 'Squall':
      case 'Broken clouds':
      case 'Broken Clouds': return brokenCloudsImg;
      case 'Rain':
      case 'Drizzle':
      case 'Shower rain':
      case 'Shower Rain': return rainImg;
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



/*************************************************************************************************************************/
  // Return the JSX code



  return (
    <div className="App">
      <section>
        <div id="weather-app">
          <nav>
            <ul>
              <li><h1>Weather App</h1></li>
              <li><p className='temp'>{tempC}°C</p></li>
              <li><p className='temp'>{tempF}°F</p></li>
            </ul>
          </nav>
          <input 
            id="city" 
            type="text" 
            list='cities'
            value={query}
            placeholder="Enter a city's name here... " 
            onChange={(e) => {
              // Reset and play the keyboard click sound
              keyboardClick.currentTime = 0;
              keyboardClick.play().catch(e => console.log('Audio play failed:', e));
              setInput(e.target.value);
              setQuery(e.target.value);
              fetchCities(e.target.value);
            }} 
          />
          <datalist id="cities">
            {suggestions.map((city, index) => (
              <option
                key={index}
                value={`${city.name}, ${city.country}${
                  city.state ? " (" + city.state + ")" : ""
                }`}
              />
            ))}
          </datalist>
          <br />
          <button id="get-weather" type='submit' onClick={getWeather}>Get Weather</button>
          {error && <p id="error">{error}</p>}
            <div id="calcifer">
              <img id="calcifer-img" src={calcifer} alt='Calcifer' />
              {/* Show sunglasses if it's clear and above 20 degrees */}
              {(weather === 'Clear' && tempC >= 20) && <img id="sunglasses-img" src={sunglasses} alt='Sunglasses' />}
              <Speechbubble text={calciferMessage} visible={isBubbleVisible}/>
            </div>
            <div id='weather-infos'>
              <p className="weather-message">{getWeatherMessage()}</p>
              {/*<p className="local-time">Local Time: {localTime}</p>*/}
            </div>
        </div>
        <div id='background'>
          {/* Show image based on weather */}
          {getWeatherImage() && <img src={getWeatherImage()} alt={weather} />}
        </div>
      </section>
    </div>
  );
}

export default App;