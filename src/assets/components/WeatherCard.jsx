import React from 'react';
import HourlyChart from './HourlyChart';

const WeatherCard = ({ weather, forecast, hourlyForecast }) => {
  if (!weather || !forecast || !hourlyForecast) return null;

  const currentTemp = Math.round(weather.main.temp);
  const feelsLike = Math.round(weather.main.feels_like);
  const humidity = weather.main.humidity;
  const wind = (weather.wind.speed * 3.6).toFixed(1);
  const currentWeather = weather.weather?.[0];

  // Detectar el tipo de clima usando los códigos de OpenWeather.
  const conditionId = Number(currentWeather?.id);
  let weatherEffect = 'weather-clouds';

  if (conditionId >= 200 && conditionId < 300) {
    weatherEffect = 'weather-storm';
  } else if (conditionId >= 300 && conditionId < 600) {
    weatherEffect = 'weather-rain';
  } else if (conditionId >= 600 && conditionId < 700) {
    weatherEffect = 'weather-snow';
  } else if (conditionId >= 700 && conditionId < 800) {
    weatherEffect = 'weather-mist';
  } else if (conditionId === 800) {
    weatherEffect = 'weather-sunny';
  } else if (conditionId > 800) {
    weatherEffect = 'weather-clouds';
  }

  const weatherIcon = (icon) =>
    `https://openweathermap.org/img/wn/${icon}@2x.png`;

  const hourLabel = (timestamp) =>
    new Date(timestamp * 1000)
      .toLocaleTimeString('es-AR', {
        hour: '2-digit',
        hour12: true,
      })
      .replace(':00', '');

  const dayLabel = (timestamp) =>
    new Date(timestamp * 1000)
      .toLocaleDateString('es-AR', {
        weekday: 'short',
        day: 'numeric',
      })
      .replace('.', '');

  // Partículas decorativas del fondo.
  const particles = Array.from({ length: 48 }, (_, index) => {
    const left = (index * 37) % 100;
    const delay = -((index * 13) % 35) / 10;
    const duration =
      weatherEffect === 'weather-storm'
        ? 0.75 + (index % 5) * 0.12
        : weatherEffect === 'weather-rain'
          ? 1.1 + (index % 6) * 0.18
          : weatherEffect === 'weather-snow'
            ? 4 + (index % 5)
            : 3 + (index % 5);

    return (
      <span
        className="weather-particle"
        key={index}
        style={{
          left: `${left}%`,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
        }}
      />
    );
  });

  /*
   * El pronóstico diario de OpenWeather puede llegar como:
   * - una lista ya agrupada por día, o
   * - una lista de intervalos de 3 horas (forecast estándar).
   *
   * En el segundo caso, agrupamos por fecha local y elegimos el
   * intervalo más cercano al mediodía para representar cada día.
   * También evitamos duplicar "Hoy" y ordenamos por fecha ascendente.
   */
  const dailyForecast = (() => {
    if (!Array.isArray(forecast)) return [];

    const groups = new Map();

    forecast.forEach((item) => {
      if (!item?.dt) return;

      const date = new Date(item.dt * 1000);
      const key = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(item);
    });

    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    return Array.from(groups.entries())
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .map(([key, items]) => {
        // Si ya llega un elemento por día, se conserva.
        if (items.length === 1) return { ...items[0], _dateKey: key };

        // Elegir el pronóstico más cercano a las 12:00 locales.
        const representative = items.reduce((best, item) => {
          const hour = new Date(item.dt * 1000).getHours();
          const bestHour = new Date(best.dt * 1000).getHours();

          return Math.abs(hour - 12) < Math.abs(bestHour - 12)
            ? item
            : best;
        });

        return { ...representative, _dateKey: key };
      })
      .filter((day) => day._dateKey >= todayKey)
      .slice(0, 5);
  })();

  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  return (
    <main className="weather-dashboard">
      <header className="weather-header">
        <div className="weather-brand">
          <span className="weather-brand-icon">☁</span>
          <span>Clima</span>
        </div>

        <span className="weather-location">
          <span className="location-dot" />
          {weather.name}
          {weather.sys?.country ? `, ${weather.sys.country}` : ''}
        </span>
      </header>

      {/* Clima actual con fondo dinámico */}
      <section className={`weather-hero ${weatherEffect}`}>
        <div className="weather-effects" aria-hidden="true">
          {particles}
        </div>

        <div className="weather-hero-content">
          <span className="weather-eyebrow">CLIMA ACTUAL</span>
          <h1>{weather.name}</h1>

          <div className="weather-temperature">
            {currentTemp}
            <span>°</span>
          </div>

          <p className="weather-description">
            {currentWeather?.description || 'Estado del clima'}
          </p>

          <div className="weather-minmax">
            <span>Se siente como {feelsLike}°</span>
            <span className="weather-minmax-divider">•</span>
            <span>Humedad {humidity}%</span>
          </div>
        </div>

        <div className="weather-hero-illustration">
          {currentWeather?.icon && (
            <img
              src={weatherIcon(currentWeather.icon)}
              alt={currentWeather.description || 'Clima actual'}
            />
          )}

          <div className="weather-orbit weather-orbit-one" />
          <div className="weather-orbit weather-orbit-two" />
        </div>

        <div className="weather-hero-footer">
          <span>Ahora en tu ubicación</span>
          <span className="weather-live-dot" />
        </div>
      </section>

      {/* Pronóstico por hora */}
      <section className="weather-hourly-panel">
        <div className="weather-section-heading">
          <div>
            <span className="weather-eyebrow">PRÓXIMAS HORAS</span>
            <h2>Pronóstico por hora</h2>
          </div>
          <span className="weather-heading-symbol">◷</span>
        </div>

        <div className="hourly-weather-list">
          {hourlyForecast.slice(0, 6).map((hour, index) => (
            <article
              className={`hourly-weather-item ${
                index === 0 ? 'hourly-weather-active' : ''
              }`}
              key={hour.dt || index}
            >
              <span className="hourly-weather-time">
                {index === 0 ? 'Ahora' : hourLabel(hour.dt)}
              </span>

              {hour.weather?.[0]?.icon && (
                <img
                  src={weatherIcon(hour.weather[0].icon)}
                  alt={hour.weather[0].description || 'Clima'}
                />
              )}

              <strong>{Math.round(hour.main.temp)}°</strong>
            </article>
          ))}
        </div>
      </section>

      {/* Detalles meteorológicos */}
      <section className="weather-details-grid">
        <article className="weather-detail-card">
          <div className="weather-detail-top">
            <span className="weather-detail-icon">💧</span>
            <span className="weather-detail-label">HUMEDAD</span>
          </div>
          <strong>{humidity}%</strong>
          <p>Humedad actual</p>
          <div className="weather-detail-track">
            <span style={{ width: `${humidity}%` }} />
          </div>
        </article>

        <article className="weather-detail-card">
          <div className="weather-detail-top">
            <span className="weather-detail-icon">〰</span>
            <span className="weather-detail-label">VIENTO</span>
          </div>
          <strong>
            {wind} <small>km/h</small>
          </strong>
          <p>Velocidad del viento</p>
          <div className="weather-detail-track">
            <span
              style={{
                width: `${Math.min((Number(wind) / 60) * 100, 100)}%`,
              }}
            />
          </div>
        </article>

        <article className="weather-detail-card">
          <div className="weather-detail-top">
            <span className="weather-detail-icon">🌡</span>
            <span className="weather-detail-label">SENSACIÓN</span>
          </div>
          <strong>{feelsLike}°</strong>
          <p>Sensación térmica</p>
          <div className="weather-detail-track">
            <span
              style={{
                width: `${Math.min(
                  Math.max(((feelsLike + 10) / 50) * 100, 0),
                  100
                )}%`,
              }}
            />
          </div>
        </article>
      </section>

      {/* Gráfico meteorológico */}
      <section className="weather-chart-panel">
        <div className="weather-section-heading">
          <div>
            <span className="weather-eyebrow">TENDENCIA</span>
            <h2>Evolución del clima</h2>
          </div>
        </div>

        <HourlyChart hourly={hourlyForecast.slice(0, 12)} />
      </section>

      {/* Pronóstico de los próximos días */}
      <section className="weather-forecast-panel">
        <div className="weather-section-heading">
          <div>
            <span className="weather-eyebrow">PLANIFICÁ TU DÍA</span>
            <h2>Próximos días</h2>
          </div>
          <span className="weather-heading-symbol">▦</span>
        </div>

        <div className="weather-daily-list">
          {dailyForecast.map((day, index) => {
            const date = new Date(day.dt * 1000);
            const dateKey = `${date.getFullYear()}-${String(
              date.getMonth() + 1
            ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            const isToday = dateKey === todayKey;

            return (
              <article
                className="daily-weather-card"
                key={dateKey}
              >
                <div className="daily-weather-day">
                  <strong>{isToday ? 'Hoy' : dayLabel(day.dt)}</strong>
                  <span>
                    {day.weather?.[0]?.description || 'Pronóstico'}
                  </span>
                </div>

                {day.weather?.[0]?.icon && (
                  <img
                    src={weatherIcon(day.weather[0].icon)}
                    alt={day.weather[0].description || 'Clima'}
                  />
                )}

                <strong className="daily-weather-temp">
                  {Math.round(day.main.temp)}°
                </strong>

                <div className="daily-weather-extra">
                  <span>
                    💧 {Math.round((day.pop || 0) * 100)}%
                  </span>
                  <span>{day.main.humidity}% humedad</span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <footer className="weather-footer">
        <span>Datos meteorológicos de OpenWeather</span>
        <a
          href="https://openweathermap.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver OpenWeather ↗
        </a>
      </footer>
    </main>
  );
};

export default WeatherCard;
