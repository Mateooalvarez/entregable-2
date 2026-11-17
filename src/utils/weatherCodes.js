export const getWeatherInfo = (code, isDay = 1) => {
  const mapping = {
    0: {
      description: isDay ? 'Cielo despejado' : 'Noche despejada',
      icon: isDay ? '01d' : '01n',
      effect: 'weather-sunny',
    },
    1: {
      description: 'Mayormente despejado',
      icon: isDay ? '02d' : '02n',
      effect: 'weather-sunny',
    },
    2: {
      description: 'Parcialmente nublado',
      icon: isDay ? '03d' : '03n',
      effect: 'weather-clouds',
    },
    3: {
      description: 'Nublado',
      icon: '04d',
      effect: 'weather-clouds',
    },
    45: {
      description: 'Niebla',
      icon: '50d',
      effect: 'weather-mist',
    },
    48: {
      description: 'Niebla con escarcha',
      icon: '50d',
      effect: 'weather-mist',
    },
    51: {
      description: 'Llovizna ligera',
      icon: '09d',
      effect: 'weather-rain',
    },
    53: {
      description: 'Llovizna moderada',
      icon: '09d',
      effect: 'weather-rain',
    },
    55: {
      description: 'Llovizna densa',
      icon: '09d',
      effect: 'weather-rain',
    },
    61: {
      description: 'Lluvia ligera',
      icon: '10d',
      effect: 'weather-rain',
    },
    63: {
      description: 'Lluvia moderada',
      icon: '10d',
      effect: 'weather-rain',
    },
    65: {
      description: 'Lluvia fuerte',
      icon: '10d',
      effect: 'weather-rain',
    },
    71: {
      description: 'Nevada ligera',
      icon: '13d',
      effect: 'weather-snow',
    },
    73: {
      description: 'Nevada moderada',
      icon: '13d',
      effect: 'weather-snow',
    },
    75: {
      description: 'Nevada fuerte',
      icon: '13d',
      effect: 'weather-snow',
    },
    80: {
      description: 'Chubascos de lluvia',
      icon: '09d',
      effect: 'weather-rain',
    },
    81: {
      description: 'Chubascos moderados',
      icon: '09d',
      effect: 'weather-rain',
    },
    82: {
      description: 'Chubascos violentos',
      icon: '09d',
      effect: 'weather-rain',
    },
    95: {
      description: 'Tormenta eléctrica',
      icon: '11d',
      effect: 'weather-storm',
    },
    96: {
      description: 'Tormenta con granizo leve',
      icon: '11d',
      effect: 'weather-storm',
    },
    99: {
      description: 'Tormenta con granizo fuerte',
      icon: '11d',
      effect: 'weather-storm',
    },
  };

  return (
    mapping[code] || {
      description: 'Condición variable',
      icon: '03d',
      effect: 'weather-clouds',
    }
  );
};