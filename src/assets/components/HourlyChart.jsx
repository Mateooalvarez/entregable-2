import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const HourlyChart = ({ hourly }) => {
  const hours = hourly.map(hour => new Date(hour.dt * 1000).getHours() + 'h');
  const temperatures = hourly.map(hour => hour.main.temp);
  const rainChances = hourly.map(hour => hour.pop ? (hour.pop * 100).toFixed(0) : 0);
  const windSpeeds = hourly.map(hour => hour.wind.speed);
  const humidity = hourly.map(hour => hour.main.humidity);

  const data = {
    labels: hours,
    datasets: [
      {
        label: 'Temperatura (°C)',
        data: temperatures,
        fill: false,
        borderColor: 'rgba(0, 172, 230, 1)',
        tension: 0.4
      },
      {
        label: 'Probabilidad de lluvia (%)',
        data: rainChances,
        fill: false,
        borderColor: 'rgba(0, 200, 100, 1)',
        borderDash: [5, 5],
        tension: 0.3
      },
      {
        label: 'Viento (km/h)',
        data: windSpeeds.map(speed => (speed * 3.6).toFixed(1)),
        fill: false,
        borderColor: 'rgba(255, 165, 0, 1)',
        tension: 0.3
      },
      {
        label: 'Humedad (%)',
        data: humidity,
        fill: false,
        borderColor: 'rgba(153, 102, 255, 1)',
        tension: 0.3
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: 'white' } },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: { ticks: { color: 'white' }, grid: { color: 'rgba(255,255,255,0.1)' } },
      y: { ticks: { color: 'white' }, grid: { color: 'rgba(255,255,255,0.1)' } }
    }
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '1000px',
      backgroundColor: 'rgba(0,0,0,0.5)',
      borderRadius: '1rem',
      padding: '1rem',
      marginTop: '2rem'
    }}>
      <h3 style={{ color: 'white', textAlign: 'center', marginBottom: '1rem' }}>
        Pronóstico por hora
      </h3>
      <Line data={data} options={options} />
    </div>
  );
};

export default HourlyChart;
