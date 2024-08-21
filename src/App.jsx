import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import WeatherCard from './assets/components/WeatherCard';

function App() {
  const [coords, setCoords] = useState();
  const [weather, setWeather] = useState(); 
  const [temp, setTemp] = useState({ celsius: '', fahrenheit: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [forecast, setForecast] = useState([]); // Estado para guardar el pronóstico extendido

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
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${API_KEY}`;

      axios.get(weatherUrl)
        .then(res => { 
          setWeather(res.data);
          const celsius = (res.data.main.temp - 273.15).toFixed(1);
          const fahrenheit =  (celsius * 9/5 + 32).toFixed(1);
          setTemp({ celsius, fahrenheit });
        })
        .catch(err => {
          setHasError(true);
        })
        .finally(() => setIsLoading(false));

      axios.get(forecastUrl)
        .then(res => {
          // Filtra para obtener pronósticos de 3 días a la misma hora (12:00 PM)
          const dailyForecast = res.data.list.filter(reading => reading.dt_txt.includes("12:00:00"));
          setForecast(dailyForecast);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, [coords]);

  return (
    <div className='app'>
      {isLoading ? (
        <div>
          <h1 style={{ color: 'white' }}>loading...</h1>
          <p style={{ color: '#ccc' }}>Por favor, activa la ubicación</p>
        </div>
      ) : (
        hasError ? (
          <h1>Para obtener el clima de tu ciudad, por favor permite la ubicación.</h1>
        ) : (
          <WeatherCard
            weather={weather}
            temp={temp}
            forecast={forecast}  // Pasar el pronóstico extendido al componente
          />
        )
      )}
    </div>
  );
}

export default App;
