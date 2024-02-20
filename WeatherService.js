// WeatherService.js
import axios from 'axios';

const API_KEY = '316fb254286ef0f186a7b5fd70fb9bdd';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

const fetchWeather = async (city) => {
  try {
    const response = await axios.get(`${BASE_URL}?q=${city}&appid=${API_KEY}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { fetchWeather };
