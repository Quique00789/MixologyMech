import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { ref, get, child } from 'firebase/database';
import { database } from '../firebaseConfig';

Chart.register(...registerables);

const ProfitsChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, 'bebidas')); // Ajusta la ruta según sea necesario

      if (snapshot.exists()) {
        // Obtener los datos de consumo de bebidas
        const rawData = snapshot.val() || [];

        // Precios de las bebidas actualizados
        const prices = {
          'Daiquiri': 23,
          'Gin Tonic': 55,
          'Black Russian': 76,
          'Cuba Libre': 32, // Ajusta el precio si es necesario
          'Margarita': 75, // Ajusta el precio si es necesario
          'Ice Tea': 12 // Ajusta el precio si es necesario
        };

        // Calcular las ganancias por nombre de bebida
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

        const labels = Object.keys(profitsData); // Nombres de las bebidas
        const profitValues = Object.values(profitsData); // Ganancias totales por bebida

        if (chartRef.current) {
          chartRef.current.destroy();
        }

        const ctx = document.getElementById('profitsChart').getContext('2d');
        chartRef.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'Ganancias por bebidas',
              data: profitValues,
              backgroundColor: [
                
                'rgba(153, 102, 255, 0.2)', // Color para Gin Tonic
                'rgba(255, 206, 86, 0.40', // Color para Margarita
                'rgba(255, 159, 64, 0.2)',
                'rgba(75, 192, 192, 0.2)', // Color para Daiquiri
                'rgba(226, 50, 50, 0.2)',
                'rgba(54, 162, 235, 0.2)', // Color para Cuba Libre
              ],
              borderColor: [
                'rgba(153, 102, 255, 1)',
                'rgba(255, 236, 0, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(255, 50, 50, 1)',
                'rgba(54, 162, 235, 1)',
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                 // text: 'Total Profit'
                },
                ticks: {
                  callback: function(value) {
                    return `$${value}`;
                  }
                }
              },
              x: {
                title: {
                  display: true,
                  //text: 'Drink Names'
                }
              }
            }
          }
        });
      }
    };

    fetchData();
  }, []);

  return <canvas id="profitsChart"></canvas>;
};

export default ProfitsChart;
