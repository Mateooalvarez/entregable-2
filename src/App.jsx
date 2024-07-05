import React, { useEffect, useState } from 'react';
import './App.css';
import WeatherCard from './assets/components/WeatherCard';
import axios from '/axios';

function App() {
  const [coords, setCoords] = useState();
  const [weather, setWeather] = useState(); 
  const [temp, setTemp] = useState({ celsius: '', fahrenheit: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
 
  useEffect(() => {
    setTimeout(() => {
      setShowMessage(true);
    }, 3000);

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
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}`;
   
      axios.get(url)
        .then(res => { 
          setWeather(res.data);
          const celsius = (res.data.main.temp - 273.15).toFixed(1);
          const fahrenheit =  (celsius * 9/5 + 32).toFixed(1);
          setTemp({ celsius, fahrenheit });
        })
        .catch(err => {
          console.log(err);
          setHasError(true);
        })
        .finally(() => setIsLoading(false));
    }
  }, [coords]);

  console.log(weather);
  
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
            setTemp={setTemp}
            showMessage={showMessage}
          />
        )
      )}
    </div>
  );
}

export default App;
