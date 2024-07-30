import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { ref, get, child } from 'firebase/database';
import { database } from '../firebaseConfig';

Chart.register(...registerables);

const DrinkTop = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, 'machineData/documentId'));

      if (snapshot.exists()) {
        // Obtener los datos de consumo de bebidas
        const rawData = snapshot.val().drinkConsumption || [];

        // Generar etiquetas y datos a partir de cada entrada
        const labels = rawData.map((item, index) => `Order ${index + 1}: ${item.name}`);
        const consumptionData = rawData.map(item => item.consumption);

        // Asignar colores a cada punto dependiendo del nombre de la bebida
        const pointColors = rawData.map(item => {
          switch (item.name) {
            case 'drink1':
              return 'rgba(75, 192, 192, 0.50)';  // Color para drink1
            case 'drink2':
              return 'rgba(153, 102, 255, 0.50)'; // Color para drink2
            case 'drink3':
              return 'rgba(255, 159, 64, 0.50)';  // Color para drink3
            default:
              return 'rgba(54, 162, 235, 0.50)'; // Color por defecto para cualquier otra bebida
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
              label: 'Drink Consumption per Order',
              data: consumptionData,
              fill: false,
              // Cambia aquí el color de la línea
              borderColor: 'rgba(250, 46, 116, 0.86)', // Color de la línea
              backgroundColor: 'rgba(255, 82, 142, 0.22)', // Color del cuadrado en la leyenda
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
                  text: 'Orders'
                }
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Consumption'
                }
              }
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.dataset.label || '';
                    const order = labels[context.dataIndex];
                    const value = context.raw;
                    return `${order}: ${value}`;
                  }
                }
              }
            }
          }
        });
      }
    };

    fetchData();
  }, []);

  return <canvas id="drinkTopChart"></canvas>;
};

export default DrinkTop;
