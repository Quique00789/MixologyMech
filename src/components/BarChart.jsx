import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebaseConfig';

Chart.register(...registerables);

const BarChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const dbRef = ref(database, 'bebidas');
    
    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const rawData = snapshot.val();
        const groupedData = {};

        Object.keys(rawData).forEach((key) => {
          const item = rawData[key];
          if (groupedData[item.nombre]) {
            groupedData[item.nombre] += parseInt(item.cantidad, 10);
          } else {
            groupedData[item.nombre] = parseInt(item.cantidad, 10);
          }
        });

        const labels = Object.keys(groupedData);
        const consumptionData = Object.values(groupedData);

        const backgroundColors = labels.map((nombre) => {
          switch (nombre) {
            case 'Daiquiri':
              return 'rgba(75, 192, 192, 0.5)';
            case 'Gin Tonic':
              return 'rgba(153, 102, 255, 0.5)';
            case 'Black Russian':
              return 'rgba(255, 159, 64, 0.5)';
            case 'Cuba Libre':
              return 'rgba(226, 50, 50, 0.5)';
            case 'Margarita':
              return 'rgba(255, 206, 86, 0.5)';
            case 'Ice Tea':
              return 'rgba(54, 162, 235, 0.5)';
            default:
              return 'rgba(255, 255, 255, 0.75)';
          }
        });

        const borderColors = labels.map((nombre) => {
          switch (nombre) {
            case 'Daiquiri':
              return 'rgba(75, 192, 192, 1)';
            case 'Gin Tonic':
              return 'rgba(153, 102, 255, 1)';
            case 'Black Russian':
              return 'rgba(255, 159, 64, 1)';
            case 'Cuba Libre':
              return 'rgba(226, 50, 50, 1)';
            case 'Margarita':
              return 'rgba(255, 206, 86, 1)';
            case 'Ice Tea':
              return 'rgba(54, 162, 235, 1)';
            default:
              return 'rgba(255, 255, 255, 1)';
          }
        });

        if (chartRef.current) {
          chartRef.current.destroy();
        }

        const ctx = document.getElementById('barChart').getContext('2d');
        chartRef.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'Consumo por Bebida',
              data: consumptionData,
              backgroundColor: backgroundColors,
              borderColor: borderColors,
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true
              }
            },
            plugins: {
              legend: {
                display: false
              },
              title: {
                display: true,
                text: 'Consumo por Bebida'
              }
            }
          }
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return <canvas id="barChart"></canvas>;
};

export default BarChart;