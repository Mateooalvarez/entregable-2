import React, { useState } from 'react';
import './styles/WeatherCard.css'

const WeatherCard = ({ weather, temp }) => {

  const [isCelsius, setIsCelsius] = useState(true)
  const [temperature, setTemperature] = useState(temp)

  const changeTemperature = () => {
    setIsCelsius(!isCelsius);
    if (isCelsius) {
      const fahrenheit = (temp.celsius * 9 / 5 + 32).toFixed(1);
      setTemperature({ ...temperature, fahrenheit });
    } else {
      const celsius = ((temp.fahrenheit - 32) * 5 / 9).toFixed(1);
      setTemperature({ ...temperature, celsius });
    }
  };

  return (
    <article>
      <h1>Clima</h1>
      <h2>{weather?.name}, {weather?.sys.country}</h2>
      <section>
        <div>
          <img
            src={weather && weather.weather && weather.weather[0] && `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
            alt=""
          />
        </div>
        <article className='info'>
          <h3>{weather?.weather[0].description}</h3>
          <ul>
            <li><span>Viento: </span><span>{weather?.wind.speed}m/s</span></li>
            <li><span>Nubes: </span><span>{weather?.clouds.all}%</span></li>
            <li><span>Humedad: </span><span></span>{weather?.main.humidity}hPa</li>
          </ul>
        </article>
      </section>
      <h2>{temp && isCelsius ? `${temp.celsius}°C` : `${temp.fahrenheit}°F`} </h2>
      <button className='button' onClick={changeTemperature}>Change to {isCelsius ? '°F' : '°C'}</button>
    </article>
  )
}
export default WeatherCard