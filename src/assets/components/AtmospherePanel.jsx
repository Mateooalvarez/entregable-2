import React from 'react';

const getMoonPhase = (date = new Date()) => {
  const d0 = new Date(Date.UTC(2000, 0, 6, 18, 14));
  const diffDays = (date.getTime() - d0.getTime()) / (1000 * 60 * 60 * 24);
  const cycle = 29.53058867;
  const phaseVal = ((diffDays % cycle) + cycle) % cycle;
  const phaseNormalized = phaseVal / cycle;
  const illumination = Math.round(
    ((1 - Math.cos(phaseNormalized * 2 * Math.PI)) / 2) * 100
  );

  let phaseName = 'Luna Nueva';
  let icon = '🌑';

  if (phaseVal < 1.84) {
    phaseName = 'Luna Nueva';
    icon = '🌑';
  } else if (phaseVal < 5.53) {
    phaseName = 'Creciente Iluminante';
    icon = '🌒';
  } else if (phaseVal < 9.23) {
    phaseName = 'Cuarto Creciente';
    icon = '🌓';
  } else if (phaseVal < 12.92) {
    phaseName = 'Gibosa Creciente';
    icon = '🌔';
  } else if (phaseVal < 16.61) {
    phaseName = 'Luna Llena';
    icon = '🌕';
  } else if (phaseVal < 20.3) {
    phaseName = 'Gibosa Menguante';
    icon = '🌖';
  } else if (phaseVal < 23.99) {
    phaseName = 'Cuarto Menguante';
    icon = '🌗';
  } else if (phaseVal < 27.69) {
    phaseName = 'Creciente Menguante';
    icon = '🌘';
  } else {
    phaseName = 'Luna Nueva';
    icon = '🌑';
  }

  return { phaseName, icon, illumination };
};

const AtmospherePanel = ({ current }) => {
  if (!current) return null;

  const formatIsoTime = (isoString) => {
    if (!isoString) return '--:--';
    const d = new Date(isoString);
    return d.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const sunriseTime = formatIsoTime(current.sunrise);
  const sunsetTime = formatIsoTime(current.sunset);

  const now = Date.now();
  const sunriseMs = current.sunrise ? new Date(current.sunrise).getTime() : 0;
  const sunsetMs = current.sunset ? new Date(current.sunset).getTime() : 0;

  let sunProgress = 0;
  let sunStatus = 'Noche';

  if (sunriseMs && sunsetMs) {
    if (now < sunriseMs) {
      sunProgress = 0;
      const diffMinutes = Math.round((sunriseMs - now) / 60000);
      const hours = Math.floor(diffMinutes / 60);
      const mins = diffMinutes % 60;
      sunStatus = `Amanece en ${hours > 0 ? `${hours}h ` : ''}${mins}m`;
    } else if (now >= sunriseMs && now <= sunsetMs) {
      sunProgress = Math.min(
        Math.max(((now - sunriseMs) / (sunsetMs - sunriseMs)) * 100, 0),
        100
      );
      const diffMinutes = Math.round((sunsetMs - now) / 60000);
      const hours = Math.floor(diffMinutes / 60);
      const mins = diffMinutes % 60;
      sunStatus = `Quedan ${hours > 0 ? `${hours}h ` : ''}${mins}m de sol`;
    } else {
      sunProgress = 100;
      sunStatus = 'El sol ya se ocultó';
    }
  }

  const moon = getMoonPhase(new Date());

  const pressure = current.pressure;
  const pressureState =
    pressure > 1020
      ? 'Alta (tiempo estable)'
      : pressure >= 1005
      ? 'Normal y estable'
      : 'Baja (inestable)';

  return (
    <div className="atmosphere-container">
      <div className="astronomy-cards-grid">
        <article className="solar-card">
          <div className="solar-card-header">
            <div className="solar-header-text">
              <span className="weather-eyebrow">ASTRONOMÍA</span>
              <h3>Ciclo Solar</h3>
            </div>
            <span className="solar-status-pill">{sunStatus}</span>
          </div>

          <div className="solar-track-wrapper">
            <div className="solar-track">
              <div
                className="solar-track-fill"
                style={{ width: `${sunProgress}%` }}
              />
              <div
                className="solar-sun-indicator"
                style={{ left: `${sunProgress}%` }}
              >
                ☀️
              </div>
            </div>
          </div>

          <div className="solar-times">
            <div className="solar-time-block">
              <span className="solar-icon">🌅</span>
              <div>
                <small>Amanecer</small>
                <strong>{sunriseTime}</strong>
              </div>
            </div>

            <div className="solar-time-block solar-time-right">
              <div>
                <small>Atardecer</small>
                <strong>{sunsetTime}</strong>
              </div>
              <span className="solar-icon">🌇</span>
            </div>
          </div>
        </article>

        <article className="solar-card lunar-card">
          <div className="solar-card-header">
            <div className="solar-header-text">
              <span className="weather-eyebrow">ASTRONOMÍA</span>
              <h3>Ciclo Lunar</h3>
            </div>
            <span className="lunar-status-pill">{moon.phaseName}</span>
          </div>

          <div className="lunar-content">
            <span className="lunar-icon-display">{moon.icon}</span>
            <div className="lunar-info">
              <strong>{moon.illumination}% iluminada</strong>
              <p>Fase lunar observada hoy en tu zona</p>
            </div>
          </div>

          <div className="lunar-track">
            <div
              className="lunar-track-fill"
              style={{ width: `${moon.illumination}%` }}
            />
          </div>
        </article>
      </div>

      <div className="atmosphere-subgrid">
        <article className="atmosphere-item-card">
          <div className="atmosphere-item-top">
            <span className="atmosphere-icon">🧭</span>
            <span className="atmosphere-label">PRESIÓN</span>
          </div>
          <strong>{pressure} <small>hPa</small></strong>
          <p>{pressureState}</p>
        </article>

        <article className="atmosphere-item-card">
          <div className="atmosphere-item-top">
            <span className="atmosphere-icon">💧</span>
            <span className="atmosphere-label">LLUVIA ACTUAL</span>
          </div>
          <strong>{current.rain ? current.rain.toFixed(1) : '0.0'} <small>mm</small></strong>
          <p>{current.rain > 0 ? 'Precipitaciones activas' : 'Sin lluvia en este momento'}</p>
        </article>

        <article className="atmosphere-item-card">
          <div className="atmosphere-item-top">
            <span className="atmosphere-icon">💨</span>
            <span className="atmosphere-label">VIENTO</span>
          </div>
          <strong>{current.wind} <small>km/h</small></strong>
          <p>Condición del aire</p>
        </article>
      </div>
    </div>
  );
};

export default AtmospherePanel;