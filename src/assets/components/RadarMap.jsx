import React, { useState } from 'react';

const RadarMap = ({ coords, cityName }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [mapKey, setMapKey] = useState(0);

  if (!coords) return null;

  const lat = Number(coords.lat).toFixed(4);
  const lon = Number(coords.lon).toFixed(4);

  const radarUrl = `https://www.rainviewer.com/map.html?loc=${lat},${lon},8&oFa=1&oC=1&oU=1&oCS=1&oF=1&oAP=1&c=1&o=90&lm=1&layer=radar&sm=1&sn=1`;

  const handleRecenter = () => {
    setMapKey((prev) => prev + 1);
  };

  const displayName = cityName ? cityName.split(',')[0] : 'mi lugar';

  return (
    <section className="weather-radar-panel">
      <div className="weather-section-heading">
        <div>
          <span className="weather-eyebrow">MONITOREO DE TORMENTAS</span>
          <h2>Radar Meteorológico</h2>
        </div>

        <div className="radar-actions">
          <button
            type="button"
            className="radar-btn radar-recenter-btn"
            onClick={handleRecenter}
            title={`Recentrar mapa en ${displayName}`}
          >
            🎯 Centrar en {displayName}
          </button>

          <button
            type="button"
            className="radar-btn"
            onClick={() => setIsVisible(!isVisible)}
          >
            {isVisible ? 'Ocultar mapa' : 'Mostrar mapa'}
          </button>
        </div>
      </div>

      {isVisible && (
        <div className="radar-frame-wrapper">
          <iframe
            key={mapKey}
            src={radarUrl}
            title={`Radar meteorológico en ${displayName}`}
            className="radar-iframe"
            loading="lazy"
            allowFullScreen
          />
        </div>
      )}
    </section>
  );
};

export default RadarMap;