import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const ForecastChart = ({ forecast, isCelsius }) => {
  const hours = forecast.map(item => {
    const date = new Date(item.dt_txt);
    return `${date.getHours()}:00`;
  });

  const temperatures = forecast.map(item => {
    return isCelsius ? item.main.temp : (item.main.temp * 9/5) + 32;
  });

  const rainChances = forecast.map(item => {
    return item.rain ? item.rain['3h'] || 0 : 0;
  });

  const data = {
    labels: hours,
    datasets: [
      {
        label: 'Temperatura',
        data: temperatures,
        borderColor: 'rgb(255, 99, 132)',  
        backgroundColor: 'rgba(255, 99, 132, 0.2)',  
        yAxisID: 'y',
        pointBackgroundColor: 'white',  
        pointBorderColor: 'white', 
        pointHoverBackgroundColor: 'white',  
        pointHoverBorderColor: 'white', 
      },
      {
        label: 'Probabilidad de lluvia (mm)',
        data: rainChances,
        borderColor: 'rgb(54, 162, 235)',  
        backgroundColor: 'rgba(54, 162, 235, 0.2)', 
        yAxisID: 'y1',
        pointBackgroundColor: 'white',
        pointBorderColor: 'white',
        pointHoverBackgroundColor: 'white',
        pointHoverBorderColor: 'white',
      },
    ],
  };

  const options = {
    scales: {
      x: {
        ticks: {
          color: 'white',  
        },
      },
      y: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: `Temperatura (${isCelsius ? '°C' : '°F'})`,
          color: 'white',  
        },
        ticks: {
          color: 'white',  
        },
      },
      y1: {
        type: 'linear',
        position: 'right',
        title: {
          display: true,
          text: 'Probabilidad de lluvia (mm)',
          color: 'white',  
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: 'white',  
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: 'white',  
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default ForecastChart;
