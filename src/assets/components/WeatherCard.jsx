import React from 'react';
import HourlyChart from './HourlyChart';

const WeatherCard = ({ weather, forecast, hourlyForecast }) => {
  if (!weather || !forecast || !hourlyForecast) return null;

  return (
    <div className="weather-container">
      <article className="weather-info">
        <section>
          <div>
            <h2>{weather.name}</h2>
            <p>Temperatura: {Math.round(weather.main.temp)}°C</p>
            <p>Sensación térmica: {Math.round(weather.main.feels_like)}°C</p>
            <p>Humedad: {weather.main.humidity}%</p>
            <p>Viento: {(weather.wind.speed * 3.6).toFixed(1)} km/h</p>
          </div>
        </section>

        <HourlyChart hourly={hourlyForecast.slice(0, 12)} />
      </article>

      <aside className="forecast">
        <h3>Próximos días</h3>
        <ul>
          {forecast.map((day, index) => (
            <li key={index}>
              <strong>
                {new Date(day.dt * 1000).toLocaleDateString('es-AR', {
                  weekday: 'short',
                })}
              </strong>
              <img
                src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                alt={day.weather[0].description}
              />
              <span>{Math.round(day.main.temp)}°C</span>

              {day.rain || day.pop ? (
                <>
                  {day.rain && (
                    <span>🌧️ {day.rain['3h'] ?? day.rain} mm</span>
                  )}
                  {day.pop !== undefined && (
                    <span>💧 Probabilidad: {Math.round(day.pop * 100)}%</span>
                  )}
                </>
              ) : (
                <span>Sin lluvia</span>
              )}

              <span>Humedad: {day.main.humidity}%</span>
              <span>Viento: {(day.wind.speed * 3.6).toFixed(1)} km/h</span>
            </li>
          ))}
        </ul>
      </aside>

      {/* Botón de pronóstico original */}
      <div className="original-forecast-button">
        <a
          href="https://openweathermap.org/city"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="animated-button">Ver Mas En OpenWeather</button>
        </a>
      </div>
    </div>
  );
};

export default WeatherCard;
