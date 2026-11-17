import React, { useState } from 'react';
import AtmospherePanel from './AtmospherePanel';
import SearchBar from './SearchBar';
import RadarMap from './RadarMap';

const WeatherCard = ({
  data,
  cityName,
  currentCoords,
  onSelectCity,
  onCurrentLocation,
}) => {
  const [expandedDay, setExpandedDay] = useState(null);

  if (!data) return null;

  const { current, nextHours, daily } = data;

  const weatherIcon = (icon) =>
    `https://openweathermap.org/img/wn/${icon}@2x.png`;

  const formatHour = (isoStr) => {
    const d = new Date(isoStr);
    return d.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const formatDayName = (dateStr) => {
    const [year, month, day] = dateStr.split('-');
    const d = new Date(year, month - 1, day);
    return d.toLocaleDateString('es-AR', {
      weekday: 'short',
      day: 'numeric',
    }).replace('.', '');
  };

  const formatFullDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-');
    const d = new Date(year, month - 1, day);
    return d.toLocaleDateString('es-AR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  const todayStr = new Date().toISOString().slice(0, 10);

  const getSmartInsight = () => {
    const nextRain = nextHours.find((h) => h.pop >= 35 || h.rain > 0.2);
    if (nextRain) {
      return {
        icon: '☔',
        text: `Probabilidad de lluvia (${nextRain.pop}%) cerca de las ${formatHour(nextRain.time)} hs. ¡Tené a mano un paraguas!`,
      };
    }

    if (Number(current.wind) >= 35) {
      return {
        icon: '💨',
        text: `Vientos considerables con ráfagas de ${current.wind} km/h. Precaución en la calle.`,
      };
    }

    if (current.temp >= 30) {
      return {
        icon: '🌡️',
        text: `Tarde calurosa (${current.temp}°). Recordá mantenerte hidratado.`,
      };
    }

    if (current.temp <= 10) {
      return {
        icon: '🧥',
        text: `Ambiente bastante fresco (${current.temp}°). Abrigarse bien para salir.`,
      };
    }

    return {
      icon: '☀️',
      text: `Condiciones agradables y cielo favorable para actividades al aire libre.`,
    };
  };

  const insight = getSmartInsight();

  const particles = Array.from({ length: 48 }, (_, index) => {
    const left = (index * 37) % 100;
    const delay = -((index * 13) % 35) / 10;
    const duration =
      current.effect === 'weather-storm'
        ? 0.75 + (index % 5) * 0.12
        : current.effect === 'weather-rain'
          ? 1.1 + (index % 6) * 0.18
          : current.effect === 'weather-snow'
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

  const toggleDay = (key) => {
    setExpandedDay((prev) => (prev === key ? null : key));
  };

  return (
    <main className="weather-dashboard">
      <header className="weather-header">
        <div className="weather-brand">
          <span className="weather-brand-icon">☁</span>
          <span>Clima</span>
        </div>

        <span className="weather-location">
          <span className="location-dot" />
          {cityName || current.name}
        </span>
      </header>

      <SearchBar
        onSelectCity={onSelectCity}
        onCurrentLocation={onCurrentLocation}
        currentCityName={cityName || current.name}
        currentCoords={currentCoords}
      />

      <section className={`weather-hero ${current.effect}`}>
        <div className="weather-effects" aria-hidden="true">
          {particles}
        </div>

        <div className="weather-hero-content">
          <span className="weather-eyebrow">CLIMA ACTUAL</span>
          <h1>{current.name}</h1>

          <div className="weather-temperature">
            {current.temp}
            <span>°</span>
          </div>

          <p className="weather-description">{current.description}</p>

          <div className="weather-minmax">
            <span>Se siente como {current.feelsLike}°</span>
            <span className="weather-minmax-divider">•</span>
            <span>Humedad {current.humidity}%</span>
          </div>

          <div className="weather-smart-insight">
            <span className="insight-badge">{insight.icon} Consejo</span>
            <p>{insight.text}</p>
          </div>
        </div>

        <div className="weather-hero-illustration">
          <img
            src={weatherIcon(current.icon)}
            alt={current.description}
          />
          <div className="weather-orbit weather-orbit-one" />
          <div className="weather-orbit weather-orbit-two" />
        </div>

        <div className="weather-hero-footer">
          <span>Actualizado en tiempo real</span>
          <span className="weather-live-dot" />
        </div>
      </section>

      <section className="weather-hourly-panel">
        <div className="weather-section-heading">
          <div>
            <span className="weather-eyebrow">PRÓXIMAS HORAS (CADA 1 HORA)</span>
            <h2>Evolución horaria</h2>
          </div>
          <span className="weather-heading-symbol">◷</span>
        </div>

        <div className="hourly-weather-list">
          {nextHours.map((hour, index) => (
            <article
              className={`hourly-weather-item ${
                index === 0 ? 'hourly-weather-active' : ''
              }`}
              key={hour.time}
            >
              <span className="hourly-weather-time">
                {index === 0 ? 'Ahora' : formatHour(hour.time)}
              </span>

              <img
                src={weatherIcon(hour.icon)}
                alt={hour.description}
              />

              <strong>{hour.temp}°</strong>
              <small style={{ color: '#4dd5ff', fontSize: '0.68rem' }}>
                {hour.pop > 0 ? `💧 ${hour.pop}%` : '☀️ 0%'}
              </small>
            </article>
          ))}
        </div>
      </section>

      <section className="weather-details-grid">
        <article className="weather-detail-card">
          <div className="weather-detail-top">
            <span className="weather-detail-icon">💧</span>
            <span className="weather-detail-label">HUMEDAD</span>
          </div>
          <strong>{current.humidity}%</strong>
          <p>Humedad relativa</p>
          <div className="weather-detail-track">
            <span style={{ width: `${current.humidity}%` }} />
          </div>
        </article>

        <article className="weather-detail-card">
          <div className="weather-detail-top">
            <span className="weather-detail-icon">〰</span>
            <span className="weather-detail-label">VIENTO</span>
          </div>
          <strong>
            {current.wind} <small>km/h</small>
          </strong>
          <p>Velocidad del viento</p>
          <div className="weather-detail-track">
            <span
              style={{
                width: `${Math.min((Number(current.wind) / 60) * 100, 100)}%`,
              }}
            />
          </div>
        </article>

        <article className="weather-detail-card">
          <div className="weather-detail-top">
            <span className="weather-detail-icon">🌡</span>
            <span className="weather-detail-label">SENSACIÓN</span>
          </div>
          <strong>{current.feelsLike}°</strong>
          <p>Sensación térmica</p>
          <div className="weather-detail-track">
            <span
              style={{
                width: `${Math.min(
                  Math.max(((current.feelsLike + 10) / 50) * 100, 0),
                  100
                )}%`,
              }}
            />
          </div>
        </article>
      </section>

      <RadarMap coords={currentCoords} cityName={cityName || current.name} />

      <section className="weather-chart-panel">
        <div className="weather-section-heading">
          <div>
            <span className="weather-eyebrow">CONDICIONES</span>
            <h2>Atmósfera y Astronomía</h2>
          </div>
          <span className="weather-heading-symbol">🌌</span>
        </div>

        <AtmospherePanel current={current} />
      </section>

      <section className="weather-forecast-panel">
        <div className="weather-section-heading">
          <div>
            <span className="weather-eyebrow">PRONÓSTICO EXTENDIDO</span>
            <h2>Próximos 7 días</h2>
          </div>
          <span className="weather-heading-symbol">▦</span>
        </div>

        <div className="weather-daily-list">
          {daily.map((day) => {
            const isToday = day.date === todayStr;
            const isExpanded = expandedDay === day.date;

            return (
              <div key={day.date} className="daily-weather-group">
                <article
                  className={`daily-weather-card ${isExpanded ? 'daily-card-expanded' : ''}`}
                  onClick={() => toggleDay(day.date)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="daily-weather-day">
                    <strong>{isToday ? 'Hoy' : formatDayName(day.date)}</strong>
                    <span>{day.description}</span>
                  </div>

                  <img
                    src={weatherIcon(day.icon)}
                    alt={day.description}
                  />

                  <div className="daily-weather-temp-range">
                    <span className="daily-temp-max">{day.maxTemp}°</span>
                    <div className="daily-temp-bar">
                      <span
                        className="daily-temp-fill"
                        style={{
                          left: `${Math.max(day.minTemp * 2.2, 5)}%`,
                          width: `${Math.max((day.maxTemp - day.minTemp) * 7.5, 22)}%`,
                        }}
                      />
                    </div>
                    <span className="daily-temp-min">{day.minTemp}°</span>
                  </div>

                  <div className="daily-weather-extra">
                    <span>💧 {day.pop}%</span>
                    <span>🌧️ {day.rain.toFixed(1)} mm</span>
                  </div>

                  <span className={`daily-expand-chevron ${isExpanded ? 'chevron-rotated' : ''}`}>
                    ▾
                  </span>
                </article>

                {isExpanded && (
                  <div className="daily-expanded-details">
                    <div className="daily-expanded-summary">
                      <span className="expanded-date-title">{formatFullDate(day.date)}</span>
                      <div className="expanded-badges">
                        <span>💧 Lluvia acumulada: {day.rain.toFixed(1)} mm</span>
                        <span>〰 Viento máx: {day.windMax} km/h</span>
                        <span>☔ Prob. máx: {day.pop}%</span>
                      </div>
                    </div>

                    <div className="expanded-hours-scroll">
                      {day.hours.map((slot) => (
                        <div className="expanded-hour-card" key={slot.time}>
                          <span className="expanded-hour-time">{formatHour(slot.time)}</span>
                          <img
                            src={weatherIcon(slot.icon)}
                            alt={slot.description}
                          />
                          <strong className="expanded-hour-temp">{slot.temp}°</strong>
                          <small className="expanded-hour-feels">ST {slot.feelsLike}°</small>
                          <span className="expanded-hour-pop">
                            {slot.pop > 0 ? `💧 ${slot.pop}%` : '☀️ 0%'}
                          </span>
                          <span className="expanded-hour-rain">
                            🌧️ {slot.rain.toFixed(1)} mm
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <footer className="weather-footer">
        <span>Datos meteorológicos de Open-Meteo y RainViewer</span>
        <a
          href="https://open-meteo.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver Open-Meteo ↗
        </a>
      </footer>
    </main>
  );
};

export default WeatherCard;