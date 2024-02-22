import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { fetchWeather } from './WeatherService';
import NetInfo from "@react-native-community/netinfo";

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for internet connection when the component mounts
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (!state.isConnected) {
        setError('No internet connection');
      } else {
        setError(null);
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const getWeather = async () => {
    try {
      // Check for internet connection before making the API call
      const isConnected = await NetInfo.fetch().then((state) => state.isConnected);
      if (!isConnected) {
        setError('No internet connection');
        return;
      }

      // Check if the city input is empty
      if (!city) {
        setError('Please input the city name');
        return;
      }

      const data = await fetchWeather(city);
      console.log('API Response:', data);

      // Check if the API response contains data
      if (!data || !data.name) {
        setError('City not found or the country does not exist');
        setWeather(null);
        return;
      }

      setWeather(data);
      setError(null);
    } catch (err) {
      // Check if the error is an AxiosError with status code 404
      if (err.isAxiosError && err.response && err.response.status === 404) {
        // Handle the 404 error (e.g., log or do nothing)
        console.log('City not found or country does not exist');
        setWeather(null);
        setError('City not found or the country does not exist');
      } else {
        // Handle other errors
        console.error('API Error:', err);
        setWeather(null);
        setError('An error occurred while fetching data');
      }
    }
  };

  return (
    <ImageBackground
      source={{ uri: isDarkMode ? 'https://cdn.dribbble.com/users/925716/screenshots/3333720/attachments/722376/after_noon.png' : 'https://cdn.dribbble.com/users/925716/screenshots/3333720/attachments/722375/night.png' }}
      style={[styles.container, isDarkMode && styles.darkContainer]}
    >
      {/* Header with Search Bar */}
      <View style={styles.header}>
        <TextInput
          style={styles.input}
          placeholder="Enter city name"
          value={city}
          onChangeText={(text) => setCity(text)}
          placeholderTextColor={isDarkMode ? '#999' : 'white'}
        />
        <Button title="Search" onPress={getWeather} color={isDarkMode ? '#333' : 'white'} />
      </View>

      {/* Display Weather Information */}
      {weather && (
        <View style={[styles.weatherContainer, isDarkMode && styles.darkWeatherContainer]}>
          <Text style={styles.city}>{weather.name}</Text>
          <Text style={styles.temperature}>{Math.round(weather.main.temp)}°C</Text>
          <Text style={styles.description}>{weather.weather[0].description}</Text>
          <View style={styles.iconContainer}>
            <FontAwesome5 name={getIconName(weather.weather[0].icon)} size={50} />
            <Text style={styles.temperatureRange}>
              H:{Math.round(weather.main.temp_max)}° L:{Math.round(weather.main.temp_min)}°
            </Text>
          </View>
        </View>
      )}

      {/* Display Error Message */}
      {error && <Text style={styles.error}>{error}</Text>}

      {/* Light/Dark Mode Toggle */}
      <TouchableOpacity style={styles.toggleButton} onPress={toggleDarkMode}>
        {isDarkMode ? (
          <FontAwesome5 name="moon" size={20} color="#333" />
        ) : (
          <FontAwesome5 name="sun" size={20} color="#333" />
        )}
      </TouchableOpacity>
    </ImageBackground>
  );
};

const getIconName = (iconCode) => {
  const iconMap = {
    '01d': 'sun',
    '01n': 'moon',
    '02d': 'cloud',
    '02n': 'cloud',
    '03d': 'cloud',
    '03n': 'cloud',
    '04d': 'cloud',
    '04n': 'cloud',
    '09d': 'cloud-rain',
    '09n': 'cloud-rain',
    '10d': 'cloud-drizzle',
    '10n': 'cloud-drizzle',
    '11d': 'cloud-lightning',
    '11n': 'cloud-lightning',
    '13d': 'cloud-snow',
    '13n': 'cloud-snow',
    '50d': 'cloud',
    '50n': 'cloud',
  };

  return iconMap[iconCode] || 'help-circle';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'white',
    borderBottomWidth: 1,
    flex: 1,
    marginRight: 10,
    color: '#333',
    paddingLeft: 10, // Added left padding
  },
  weatherContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(144, 128, 205, 0.8)',
    borderRadius: 10,
    padding: 20,
  },
  darkWeatherContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Dark mode background color
  },
  city: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  temperature: {
    fontSize: 60,
    fontWeight: '100',
    color: '#333',
  },
  description: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#555',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  temperatureRange: {
    marginLeft: 10,
    color: '#555',
  },
  error: {
    color: '#ffffff',
    marginTop: 10,
  },
  toggleButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 10,
    borderRadius: 10,
  },
});

export default WeatherApp;
