import React, { useEffect, useState, useCallback } from 'react';
import './App.css';
import axios from 'axios';
import WeatherCard from './assets/components/WeatherCard';
import { getWeatherInfo } from './utils/weatherCodes';

function App() {
  const [coords, setCoords] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [cityName, setCityName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const requestGps = useCallback(() => {
    setIsLoading(true);
    setHasError(false);

    const success = (pos) => {
      setCoords({
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
      });
      setCityName('');
    };

    const error = () => {
      setHasError(true);
      setIsLoading(false);
    };

    navigator.geolocation.getCurrentPosition(success, error, {
      enableHighAccuracy: true,
      timeout: 10000,
    });
  }, []);

  useEffect(() => {
    requestGps();
  }, [requestGps]);

  const fetchWeather = useCallback(async (lat, lon, forcedCityName = '') => {
    try {
      setIsLoading(true);

      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,surface_pressure&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto&forecast_days=7`;

      let finalName = forcedCityName;

      if (!finalName) {
        try {
          const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=es`;
          const geoRes = await axios.get(nominatimUrl);
          const addr = geoRes.data?.address || {};

          const detectedTown =
            addr.village ||
            addr.town ||
            addr.hamlet ||
            addr.suburb ||
            addr.city ||
            addr.municipality ||
            addr.county ||
            'Tu ubicación';

          const detectedState = addr.state ? `, ${addr.state}` : '';
          finalName = `${detectedTown}${detectedState}`;
        } catch {
          finalName = 'Tu ubicación';
        }
      }

      setCityName(finalName);

      const weatherRes = await axios.get(weatherUrl);
      const raw = weatherRes.data;

      const currentInfo = getWeatherInfo(raw.current.weather_code, raw.current.is_day);

      const currentFormatted = {
        name: finalName.split(',')[0],
        temp: Math.round(raw.current.temperature_2m),
        feelsLike: Math.round(raw.current.apparent_temperature),
        humidity: raw.current.relative_humidity_2m,
        wind: raw.current.wind_speed_10m.toFixed(1),
        pressure: Math.round(raw.current.surface_pressure),
        description: currentInfo.description,
        icon: currentInfo.icon,
        effect: currentInfo.effect,
        sunrise: raw.daily.sunrise[0],
        sunset: raw.daily.sunset[0],
        rain: raw.current.precipitation,
      };

      const now = new Date();
      const localYear = now.getFullYear();
      const localMonth = String(now.getMonth() + 1).padStart(2, '0');
      const localDay = String(now.getDate()).padStart(2, '0');
      const localHour = String(now.getHours()).padStart(2, '0');
      const localPrefix = `${localYear}-${localMonth}-${localDay}T${localHour}`;
      const todayDateStr = `${localYear}-${localMonth}-${localDay}`;

      const hourlyList = raw.hourly.time.map((timeStr, i) => {
        const info = getWeatherInfo(raw.hourly.weather_code[i], 1);
        return {
          time: timeStr,
          temp: Math.round(raw.hourly.temperature_2m[i]),
          feelsLike: Math.round(raw.hourly.apparent_temperature[i]),
          pop: raw.hourly.precipitation_probability[i],
          rain: raw.hourly.precipitation[i],
          wind: raw.hourly.wind_speed_10m[i].toFixed(1),
          humidity: raw.hourly.relative_humidity_2m[i],
          description: info.description,
          icon: info.icon,
        };
      });

      const nextHours = hourlyList
        .filter((h) => h.time >= localPrefix)
        .slice(0, 8);

      const dailyList = raw.daily.time.map((dateStr, i) => {
        const info = getWeatherInfo(raw.daily.weather_code[i], 1);
        let dayHours = hourlyList.filter((h) => h.time.startsWith(dateStr));

        if (dateStr === todayDateStr) {
          dayHours = dayHours.filter((h) => h.time >= localPrefix);
        }

        return {
          date: dateStr,
          minTemp: Math.round(raw.daily.temperature_2m_min[i]),
          maxTemp: Math.round(raw.daily.temperature_2m_max[i]),
          pop: raw.daily.precipitation_probability_max[i] || 0,
          rain: raw.daily.precipitation_sum[i] || 0,
          windMax: raw.daily.wind_speed_10m_max[i]?.toFixed(1) || 0,
          sunrise: raw.daily.sunrise[i],
          sunset: raw.daily.sunset[i],
          description: info.description,
          icon: info.icon,
          effect: info.effect,
          hours: dayHours,
        };
      });

      setWeatherData({
        current: currentFormatted,
        nextHours,
        daily: dailyList,
      });

      setHasError(false);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (coords) {
      fetchWeather(coords.lat, coords.lon, cityName);
    }
  }, [coords, fetchWeather]);

  const handleSelectCity = (lat, lon, label) => {
    setCoords({ lat, lon });
    setCityName(label);
  };

  return (
    <div className="app">
      {isLoading ? (
        <div>
          <h1 style={{ color: 'white' }}>Cargando pronóstico...</h1>
          <p style={{ color: '#ccc' }}>Obteniendo datos climáticos</p>
        </div>
      ) : hasError ? (
        <div>
          <h1>No pudimos obtener la ubicación.</h1>
          <p style={{ color: '#ccc' }}>Probá buscando una ciudad en la barra superior.</p>
        </div>
      ) : (
        <WeatherCard
          data={weatherData}
          cityName={cityName}
          currentCoords={coords}
          onSelectCity={handleSelectCity}
          onCurrentLocation={requestGps}
        />
      )}
    </div>
  );
}

export default App;