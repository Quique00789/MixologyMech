//DrinkTop.jsx
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
      const snapshot = await get(child(dbRef, 'bebidas'));

      if (snapshot.exists()) {
        // Obtener los datos de consumo de bebidas
        const rawData = snapshot.val();
        const bebidaList = Object.keys(rawData).map(key => ({
          clave: key,
          ...rawData[key],
        }));

        // Generar etiquetas y datos a partir de cada entrada
        const labels = bebidaList.map((item, index) => `Bebida ${index + 1}: ${item.nombre}`);
        const consumptionData = bebidaList.map(item => parseInt(item.cantidad, 10));

        // Asignar colores a cada punto dependiendo del nombre de la bebida
        const pointColors = bebidaList.map(item => {
          switch (item.nombre) {
            case 'Daiquiri':
              return 'rgba(75, 192, 192, 0.60)';  // Color para Daiquiri
            case 'Gin Tonic':
              return 'rgba(153, 102, 255, 0.60)'; // Color para Gin Tonic
            case 'Black Russian':
              return 'rgba(255, 159, 64, 0.60)';  // Color para Black Russian
            case 'Cuba Libre':
              return 'rgba(226, 50, 50, 0.60)';  // Color para Cuba Libre
            case 'Margarita':
              return 'rgba(255, 206, 86, 0.88)';  // Color para Margarita
              case 'Ice Tea':
                return 'rgba(54, 162, 235, 0.60)'; // Color para Ice Tea
            default:
              return 'rgba(255, 255, 255, 0.75)'; // Color por defecto para cualquier otra bebida
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
