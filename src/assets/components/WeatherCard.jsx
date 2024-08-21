import React, { useState } from 'react';

const WeatherCard = ({ weather, temp, forecast }) => {
  const [isCelsius, setIsCelsius] = useState(true);

  const changeTemperature = () => {
    setIsCelsius(prevState => !prevState);
  };
  

  return (
    <article>
      <div className="weather-info">
        <h1>Clima</h1>
        <h2>{weather?.name}, {weather?.sys.country}</h2>
        <section>
          <div>
            <img
              src={weather && weather.weather && weather.weather[0] && `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
              alt={weather?.weather[0].description}
            />
          </div>
          <article className='info'>
            <h3>{weather?.weather[0].description}</h3>
            <ul>
              <li><span>Viento:</span><span>{weather?.wind.speed} m/s</span></li>
              <li><span>Nubes:</span><span>{weather?.clouds.all}%</span></li>
              <li><span>Humedad:</span><span>{weather?.main.humidity} %</span></li>
            </ul>
          </article>
        </section>
        <h2>{isCelsius ? `${temp.celsius}°C` : `${temp.fahrenheit}°F`}</h2>
        <button onClick={changeTemperature}>Cambiar a {isCelsius ? '°F' : '°C'}</button>
      </div>
      <div className="forecast">
        <h3>Pronóstico extendido:</h3>
        <ul>
          {forecast.map(day => (
            <li key={day.dt}>
              <strong>{new Date(day.dt_txt).toLocaleDateString()}</strong>
              <img
                src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                alt={day.weather[0].description}
              />
              <span>
                {isCelsius
                  ? `${(day.main.temp - 273.15).toFixed(1)}°C`
                  : `${((day.main.temp - 273.15) * 9/5 + 32).toFixed(1)}°F`}
                  
              </span>
              <span>{day.weather[0].description}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
};

export default WeatherCard;
