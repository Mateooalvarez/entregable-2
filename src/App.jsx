import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import WeatherCard from './assets/components/WeatherCard';

function App() {
  const [coords, setCoords] = useState();
  const [weather, setWeather] = useState(); 
  const [forecast, setForecast] = useState([]);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const success = (pos) => {
      setCoords({
        lat: pos.coords.latitude,
        lon: pos.coords.longitude
      });
    };

    const error = () => {
      setHasError(true);
      setIsLoading(false);
    };

    navigator.geolocation.getCurrentPosition(success, error);
  }, []);

  useEffect(() => {
    if (coords) {
      const API_KEY = '19b31a421a36259d849cdb0f494fa7c0';
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&units=metric&lang=es&appid=${API_KEY}`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&units=metric&lang=es&appid=${API_KEY}`;

      // Datos del clima actual
      axios.get(weatherUrl)
        .then(res => { 
          setWeather(res.data);
        })
        .catch(err => {
          setHasError(true);
        })
        .finally(() => setIsLoading(false));

      // Pronóstico cada 3 horas (incluye próximas horas y próximos días)
      axios.get(forecastUrl)
        .then(res => {
          const fullForecast = res.data.list;

          const dailyForecast = fullForecast.filter(reading =>
            reading.dt_txt.includes("12:00:00")
          );

          setForecast(dailyForecast);
          setHourlyForecast(fullForecast); // Pasamos todas las horas
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, [coords]);

  return (
    <div className="app">
      {isLoading ? (
        <div>
          <h1 style={{ color: 'white' }}>Cargando...</h1>
          <p style={{ color: '#ccc' }}>Por favor, activa la ubicación</p>
        </div>
      ) : hasError ? (
        <h1>Para obtener el clima de tu ciudad, por favor permite la ubicación.</h1>
      ) : (
        <WeatherCard
          weather={weather}
          forecast={forecast}
          hourlyForecast={hourlyForecast}
        />
      )}
    </div>
  );
}

export default App;
