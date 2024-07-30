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
      const snapshot = await get(child(dbRef, 'machineData/documentId'));

      if (snapshot.exists()) {
        // Obtener los datos de consumo de bebidas
        const rawData = snapshot.val().drinkConsumption || [];

        // Precios de las bebidas
        const prices = {
          drink1: 49, // Precio para drink1
          drink2: 79, // Precio para drink2
          drink3: 149 // Precio para drink3
        };

        // Calcular las ganancias por nombre de bebida
        const profitsData = rawData.reduce((acc, item) => {
          if (acc[item.name]) {
            acc[item.name] += item.consumption * prices[item.name];
          } else {
            acc[item.name] = item.consumption * prices[item.name];
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
              label: 'Profits per Drink',
              data: profitValues,
              backgroundColor: [
                'rgba(75, 192, 192, 0.2)', // Color para drink1
                'rgba(153, 102, 255, 0.2)', // Color para drink2
                'rgba(255, 159, 64, 0.2)'   // Color para drink3
              ],
              borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
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
