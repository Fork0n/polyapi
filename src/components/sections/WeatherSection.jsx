import React, { useState } from 'react';
import { motion } from 'framer-motion';

const API_KEY = '550a0cf7456470fbbab8eb22153a2cce';

function WeatherSection({ setLoading, showSnackbar }) {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);

    const getWeather = async () => {
        if (!city.trim()) {
            showSnackbar('Please enter a city name');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
            );
            if (!response.ok) throw new Error('City not found');
            const data = await response.json();
            setWeatherData(data);
            showSnackbar('Weather data loaded! ☀️');
        } catch (error) {
            showSnackbar('Could not fetch weather data');
            setWeatherData(null);
        } finally {
            setLoading(false);
        }
    };

    const getWeatherIcon = (weather) => {
        const icons = {
            'Clear': '☀️',
            'Clouds': '☁️',
            'Rain': '🌧️',
            'Snow': '❄️',
            'Thunderstorm': '⛈️',
            'Drizzle': '🌦️',
            'Mist': '🌫️',
            'Fog': '🌫️'
        };
        return icons[weather] || '🌤️';
    };

    return (
        <motion.div
            key="weather"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
        >
            <div className="content-card elevated glass-effect">
                <motion.h2
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    🌤️ Weather Dashboard
                </motion.h2>
                <div className="input-group">
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && getWeather()}
                        placeholder="Enter city name..."
                        className="text-field modern-input"
                    />
                    <motion.button
                        className="cta-button filled shimmer-button"
                        onClick={getWeather}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span>Get Weather</span>
                    </motion.button>
                </div>

                {weatherData && (
                    <motion.div
                        className="weather-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="weather-main">
                            <motion.div
                                className="weather-icon"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200 }}
                            >
                                {getWeatherIcon(weatherData.weather[0].main)}
                            </motion.div>
                            <div>
                                <motion.div
                                    className="weather-temp"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    {Math.round(weatherData.main.temp)}°C
                                </motion.div>
                                <div style={{ fontSize: '20px', color: 'var(--md-sys-color-on-surface-variant)' }}>
                                    {weatherData.name}, {weatherData.sys.country}
                                </div>
                                <div style={{ fontSize: '16px', color: 'var(--md-sys-color-on-surface-variant)', textTransform: 'capitalize' }}>
                                    {weatherData.weather[0].description}
                                </div>
                            </div>
                        </div>
                        <div className="weather-info">
                            {[
                                { label: 'Feels Like', value: `${Math.round(weatherData.main.feels_like)}°C` },
                                { label: 'Humidity', value: `${weatherData.main.humidity}%` },
                                { label: 'Wind Speed', value: `${weatherData.wind.speed} m/s` },
                                { label: 'Pressure', value: `${weatherData.main.pressure} hPa` }
                            ].map((item, index) => (
                                <motion.div
                                    key={item.label}
                                    className="weather-item"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + index * 0.1 }}
                                >
                                    <span className="weather-label">{item.label}</span>
                                    <span className="weather-value">{item.value}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}

export default WeatherSection;