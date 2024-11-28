// Import necessary modules
import React, { useState, useEffect } from "react"; // React hooks for managing state and lifecycle
import axios from "axios"; // Library for making HTTP requests
import "./App.css"; // Importing styles

// API key for OpenWeatherMap (replace with your own if needed)
const API_KEY = "09cd62ed0f7883beb3411ae0f43235f2";

function App() {
  // State variables
  const [weather, setWeather] = useState(null); // Stores current weather data
  const [city, setCity] = useState("Toronto"); // Default city is set to Toronto
  const [forecast, setForecast] = useState([]); // Stores 5-day forecast data
  const [inputCity, setInputCity] = useState(""); // Stores user input for city search

  // Fetch weather and forecast data when the `city` state changes
  useEffect(() => {
    fetchWeather(city); // Fetch current weather for the selected city
    fetchForecast(city); // Fetch 5-day forecast for the selected city
  }, [city]);

  // Function to fetch current weather data from OpenWeatherMap API
  const fetchWeather = async (city) => {
    try {
      const response = await axios.get(
        `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeather(response.data); // Update the weather state with the API response
    } catch (error) {
      console.error("Error fetching weather data:", error); // Log any errors
    }
  };

  // Function to fetch 5-day forecast data from OpenWeatherMap API
  const fetchForecast = async (city) => {
    try {
      const response = await axios.get(
        `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      // Filter the forecast to show daily weather at 12:00 PM
      const dailyForecast = response.data.list.filter((reading) =>
        reading.dt_txt.includes("12:00:00")
      );
      setForecast(dailyForecast); // Update the forecast state with the filtered data
    } catch (error) {
      console.error("Error fetching forecast data:", error); // Log any errors
    }
  };

  // Handle search button click and update the city
  const handleSearch = () => {
    if (inputCity) {
      setCity(inputCity); // Set the new city for fetching weather data
      setInputCity(""); // Clear the input field
    }
  };

  // Render the app's UI
  return (
    <div className="app">
      {/* Search bar for entering city */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter city"
          value={inputCity}
          onChange={(e) => setInputCity(e.target.value)} // Update input state as user types
        />
        <button onClick={handleSearch}>Search</button> {/* Trigger search on click */}
      </div>

      {/* Current weather display */}
      {weather && (
        <div className="current-weather">
          {/* Display day of the week and date */}
          <h1>{new Date().toLocaleDateString("en-US", { weekday: "long" })}</h1>
          <h2>{new Date().toLocaleDateString()}</h2>
          {/* Display city name and country */}
          <h3>
            {weather.name} - {weather.sys.country}
          </h3>
          {/* Display temperature */}
          <div className="temperature">{Math.round(weather.main.temp)}°C</div>
          {/* Display weather description */}
          <div className="weather-desc">{weather.weather[0].description}</div>
          {/* Display weather icon */}
          <img
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="weather-icon"
          />
        </div>
      )}

      {/* 5-day forecast display */}
      {forecast.length > 0 && (
        <div className="forecast-container">
          <h2>5-Day Forecast</h2>
          <div className="forecast-grid">
            {/* Map through forecast data to display each day's weather */}
            {forecast.map((day) => (
              <div key={day.dt} className="forecast-card">
                {/* Display date */}
                <p>{new Date(day.dt * 1000).toLocaleDateString()}</p>
                {/* Display weather icon */}
                <img
                  src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                  alt="forecast-icon"
                />
                {/* Display temperature */}
                <p>{Math.round(day.main.temp)}°C</p>
                {/* Display weather description */}
                <p>{day.weather[0].description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Export the component for use in other parts of the application
export default App;
