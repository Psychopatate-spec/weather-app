# Warm Winds
================

A simple weather app built with React, using the OpenWeatherMap API.

## Table of Contents

* [Folder Structure](#folder-structure)
* [Functionalities](#functionalities)
* [Getting Started](#getting-started)
* [API Keys](#api-keys)
* [Built With](#built-with)

## Folder Structure
---------------

* `public/`: Public assets, such as the favicon and index.html
* `src/`: Source code for the app
	+ `assets/`: Images and icons
	+ `App.css`: Global CSS styles for the app
	+ `App.js`: Main app component
	+ `index.js`: Entry point for the app

## Functionalities
-------------

* Cute Calcifer character presenting the weather
* Display current weather conditions for a given location
* Display 5-day weather forecast for a given location
* Allow user to search for weather by city name or zip code
* Store user's location preferences in local storage

* (Easter Egg: Try typing "Calcifer" in the search bar!)

## Getting Started
-------------

1. Clone the repository: `git clone https://github.com/Psychopatate-Spec/weather-app.git`
2. Install dependencies: `npm install`
3. Create a new file called `.env` in the root directory and add your OpenWeatherMap API key: `REACT_APP_API_KEY=your-api-key`
4. Start the app: `npm start`

## API Keys
---------

This app uses the OpenWeatherMap API to fetch weather data. You will need to obtain an API key from [OpenWeatherMap](https://openweathermap.org/api) and add it to your `.env` file.

## Built With
------------

* React
* OpenWeatherMap API
* CSS