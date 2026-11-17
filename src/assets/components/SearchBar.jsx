import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const SearchBar = ({ onSelectCity, onCurrentLocation, currentCityName, currentCoords }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('clima_favoritos');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          query.trim()
        )}&count=5&language=es&format=json`;
        const res = await axios.get(url);
        setResults(res.data.results || []);
        setIsOpen(true);
      } catch {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (item) => {
    const cityLabel = item.admin1
      ? `${item.name}, ${item.admin1}`
      : `${item.name}, ${item.country || ''}`;

    onSelectCity(item.latitude, item.longitude, cityLabel);
    setQuery('');
    setIsOpen(false);
  };

  const isFavorite = favorites.some((f) => f.name === currentCityName);

  const toggleFavorite = () => {
    if (!currentCityName || !currentCoords) return;

    let updated;
    if (isFavorite) {
      updated = favorites.filter((f) => f.name !== currentCityName);
    } else {
      updated = [
        ...favorites,
        {
          name: currentCityName,
          lat: currentCoords.lat,
          lon: currentCoords.lon,
        },
      ];
    }

    setFavorites(updated);
    localStorage.setItem('clima_favoritos', JSON.stringify(updated));
  };

  const removeFavorite = (e, name) => {
    e.stopPropagation();
    const updated = favorites.filter((f) => f.name !== name);
    setFavorites(updated);
    localStorage.setItem('clima_favoritos', JSON.stringify(updated));
  };

  return (
    <div className="search-bar-wrapper" ref={searchRef}>
      <div className="search-input-row">
        <div className="search-field">
          <span className="search-lens-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar ciudad o pueblo..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
          />
          {query && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setQuery('')}
            >
              ✕
            </button>
          )}
        </div>

        <button
          type="button"
          className="search-action-btn"
          onClick={onCurrentLocation}
          title="Mi ubicación actual"
        >
          📍 Mi lugar
        </button>

        <button
          type="button"
          className={`search-action-btn search-fav-btn ${
            isFavorite ? 'fav-active' : ''
          }`}
          onClick={toggleFavorite}
          title={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
        >
          {isFavorite ? '★ Guardado' : '☆ Favorito'}
        </button>
      </div>

      {isOpen && results.length > 0 && (
        <ul className="search-dropdown">
          {results.map((item) => (
            <li
              key={`${item.id}-${item.latitude}`}
              onClick={() => handleSelect(item)}
            >
              <span className="search-item-name">{item.name}</span>
              <span className="search-item-sub">
                {item.admin1 ? `${item.admin1}, ` : ''}
                {item.country || ''}
              </span>
            </li>
          ))}
        </ul>
      )}

      {favorites.length > 0 && (
        <div className="favorites-pills-row">
          <span className="favorites-label">Favoritos:</span>
          {favorites.map((fav) => (
            <span
              key={fav.name}
              className={`fav-pill ${fav.name === currentCityName ? 'fav-pill-active' : ''}`}
              onClick={() => onSelectCity(fav.lat, fav.lon, fav.name)}
            >
              ★ {fav.name}
              <button
                type="button"
                className="fav-pill-remove"
                onClick={(e) => removeFavorite(e, fav.name)}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;