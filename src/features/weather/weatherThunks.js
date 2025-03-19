
import { createAsyncThunk } from '@reduxjs/toolkit';

// OpenWeatherMap API key - in a real app, this would be in an environment variable
const API_KEY =  import.meta.env.VITE_OPENWEATHER_API_KEY;
; // Replace with your API key

// The best OpenWeather API for this use case is the "Current Weather Data" API
// It provides current weather conditions for any location which is perfect for to-do tasks

export const fetchWeatherByLocation = createAsyncThunk(
  'weather/fetchByLocation',
  async (location, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Weather data not available');
      }
      
      const data = await response.json();
      
      return {
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        location: data.name,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        coordinates: {
          lat: data.coord.lat,
          lon: data.coord.lon,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchWeatherByCoordinates = createAsyncThunk(
  'weather/fetchByCoordinates',
  async ({ lat, lon, locationName }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Weather data not available');
      }
      
      const data = await response.json();
      
      return {
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        location: data.name,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        coordinates: {
          lat: data.coord.lat,
          lon: data.coord.lon,
        },
        timestamp: new Date().toISOString(),
        locationName: locationName || data.name, // Store the location name for reference
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);