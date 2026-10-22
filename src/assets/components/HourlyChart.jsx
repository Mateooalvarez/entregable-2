
import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const HourlyChart = ({ hourly }) => {
  const hours = hourly.map((hour) =>
    new Date(hour.dt * 1000).toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  );

  const temperatures = hourly.map((hour) => hour.main.temp);
  const rainChances = hourly.map((hour) =>
    hour.pop !== undefined ? Math.round(hour.pop * 100) : 0
  );
  const windSpeeds = hourly.map((hour) =>
    Number((hour.wind.speed * 3.6).toFixed(1))
  );
  const humidity = hourly.map((hour) => hour.main.humidity);

  const data = {
    labels: hours,
    datasets: [
      {
        label: 'Temperatura (°C)',
        data: temperatures,
        borderColor: '#58a0ff',
        backgroundColor: 'rgba(64, 139, 255, 0.13)',
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#58a0ff',
        pointRadius: 3,
        pointHoverRadius: 6,
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        yAxisID: 'y',
      },
      {
        label: 'Lluvia (%)',
        data: rainChances,
        borderColor: '#45d5e8',
        backgroundColor: '#45d5e8',
        pointBackgroundColor: '#45d5e8',
        pointRadius: 2,
        pointHoverRadius: 5,
        borderWidth: 2,
        borderDash: [5, 5],
        tension: 0.35,
        yAxisID: 'y1',
      },
      {
        label: 'Viento (km/h)',
        data: windSpeeds,
        borderColor: '#ffbd69',
        backgroundColor: '#ffbd69',
        pointBackgroundColor: '#ffbd69',
        pointRadius: 2,
        pointHoverRadius: 5,
        borderWidth: 2,
        tension: 0.35,
        yAxisID: 'y1',
      },
      {
        label: 'Humedad (%)',
        data: humidity,
        borderColor: '#bd91ff',
        backgroundColor: '#bd91ff',
        pointBackgroundColor: '#bd91ff',
        pointRadius: 2,
        pointHoverRadius: 5,
        borderWidth: 2,
        tension: 0.35,
        yAxisID: 'y1',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#a9bddf',
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 7,
          boxHeight: 7,
          padding: 16,
          font: {
            size: 10,
            family: 'Inter, system-ui, sans-serif',
          },
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: '#142b52',
        titleColor: '#ffffff',
        bodyColor: '#dce8ff',
        borderColor: 'rgba(157, 188, 240, 0.2)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12,
        displayColors: true,
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#8fa8cf',
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 8,
          font: {
            size: 10,
          },
        },
        grid: {
          color: 'rgba(157, 188, 240, 0.07)',
          drawTicks: false,
        },
        border: {
          display: false,
        },
      },
      y: {
        type: 'linear',
        position: 'left',
        ticks: {
          color: '#8fa8cf',
          maxTicksLimit: 6,
          font: {
            size: 10,
          },
          callback: (value) => `${value}°`,
        },
        grid: {
          color: 'rgba(157, 188, 240, 0.09)',
          drawTicks: false,
        },
        border: {
          display: false,
        },
      },
      y1: {
        type: 'linear',
        position: 'right',
        min: 0,
        max: 100,
        ticks: {
          color: '#8fa8cf',
          maxTicksLimit: 6,
          font: {
            size: 10,
          },
          callback: (value) => `${value}`,
        },
        grid: {
          drawOnChartArea: false,
        },
        border: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="hourly-chart">
      <div className="hourly-chart-heading">
        <div>
          <span className="weather-eyebrow">LAS PRÓXIMAS HORAS</span>
          <h3>Variación meteorológica</h3>
        </div>
        <span className="hourly-chart-badge">12 h</span>
      </div>

      <div className="hourly-chart-canvas">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default HourlyChart;
