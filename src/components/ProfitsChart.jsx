import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebaseConfig';
import './ProfitsChart.css';

Chart.register(...registerables);

const ProfitsChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const dbRef = ref(database, 'bebidas');
    
    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const rawData = snapshot.val() || [];

        const prices = {
          'Daiquiri': 23,
          'Gin Tonic': 55,
          'Black Russian': 76,
          'Cuba Libre': 32,
          'Margarita': 75,
          'Ice Tea': 12
        };

        const profitsData = Object.values(rawData).reduce((acc, item) => {
          const quantity = parseFloat(item.cantidad) || 0;
          const price = prices[item.nombre] || 0;
          const totalProfit = quantity * price;

          if (acc[item.nombre]) {
            acc[item.nombre] += totalProfit;
          } else {
            acc[item.nombre] = totalProfit;
          }
          return acc;
        }, {});

        const labels = Object.keys(profitsData);
        const profitValues = Object.values(profitsData);

        const backgroundColors = labels.map((nombre) => {
          switch (nombre) {
            case 'Daiquiri':
              return 'rgba(75, 192, 192, 0.4)';
            case 'Gin Tonic':
              return 'rgba(153, 102, 255, 0.4)';
            case 'Black Russian':
              return 'rgba(255, 159, 64, 0.4)';
            case 'Cuba Libre':
              return 'rgba(226, 50, 50, 0.4)';
            case 'Margarita':
              return 'rgba(255, 206, 86, 0.4)';
            case 'Ice Tea':
              return 'rgba(54, 162, 235, 0.4)';
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

        const ctx = document.getElementById('profitsChart').getContext('2d');
        chartRef.current = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: labels,
            datasets: [{
              label: 'Ganancias por bebidas',
              data: profitValues,
              backgroundColor: backgroundColors,
              borderColor: borderColors,
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'top'
              },
              title: {
                display: true,
                text: 'Ganancias por Bebida'
              }
            }
          }
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return <canvas id="profitsChart"></canvas>;
};

export default ProfitsChart;
