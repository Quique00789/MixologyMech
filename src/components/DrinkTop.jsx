import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebaseConfig';

Chart.register(...registerables);

const DrinkTop = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const dbRef = ref(database, 'bebidas');
    
    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const rawData = snapshot.val();
        const bebidaList = Object.keys(rawData).map(key => ({
          clave: key,
          ...rawData[key],
        }));

        const labels = bebidaList.map((item, index) => `Bebida ${index + 1}: ${item.nombre}`);
        const consumptionData = bebidaList.map(item => parseInt(item.cantidad, 10));
        const mesaData = bebidaList.map(item => item.mesa);

        const pointColors = bebidaList.map(item => {
          switch (item.nombre) {
            case 'Daiquiri':
              return 'rgba(75, 192, 192, 0.60)';
            case 'Gin Tonic':
              return 'rgba(153, 102, 255, 0.60)';
            case 'Black Russian':
              return 'rgba(255, 159, 64, 0.60)';
            case 'Cuba Libre':
              return 'rgba(226, 50, 50, 0.60)';
            case 'Margarita':
              return 'rgba(255, 206, 86, 0.88)';
            case 'Ice Tea':
              return 'rgba(54, 162, 235, 0.60)';
            default:
              return 'rgba(255, 255, 255, 0.75)';
          }
        });

        if (chartRef.current) {
          chartRef.current.destroy();
        }

        const ctx = document.getElementById('drinkTopChart').getContext('2d');
        chartRef.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: 'Consumo de Bebidas por orden',
              data: consumptionData,
              fill: false,
              borderColor: 'rgba(250, 46, 116, 0.86)',
              backgroundColor: 'rgba(255, 82, 142, 0.22)',
              borderWidth: 1,
              pointBackgroundColor: pointColors,
              pointBorderColor: pointColors,
              pointRadius: 5,
              pointHoverRadius: 7
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Órdenes'
                }
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Consumo'
                }
              }
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const label = context.dataset.label || '';
                    const order = labels[context.dataIndex];
                    const value = context.raw;
                    const mesa = mesaData[context.dataIndex];
                    return [`${order}: ${value}`, `Mesa: ${mesa}`];
                  }
                }
              }
            }
          }
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return <canvas id="drinkTopChart"></canvas>;
};

export default DrinkTop;