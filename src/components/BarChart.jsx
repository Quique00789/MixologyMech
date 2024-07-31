import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { ref, get, child } from 'firebase/database';
import { database } from '../firebaseConfig';

Chart.register(...registerables);

const BarChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, 'bebidas')); // Cambiado a 'bebidas'

      if (snapshot.exists()) {
        const rawData = snapshot.val();
        const groupedData = {};

        // Agrupar y sumar el consumo por nombre de bebida
        Object.keys(rawData).forEach((key) => {
          const item = rawData[key];
          if (groupedData[item.nombre]) {
            groupedData[item.nombre] += parseInt(item.cantidad, 10);
          } else {
            groupedData[item.nombre] = parseInt(item.cantidad, 10);
          }
        });

        const labels = Object.keys(groupedData); // Nombres de las bebidas
        const consumptionData = Object.values(groupedData); // Consumos totales de las bebidas

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
              backgroundColor: [
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)'
              ],
              borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)'
              ],
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
            }
          }
        });
      }
    };

    fetchData();
  }, []);

  return <canvas id="barChart"></canvas>;
};

export default BarChart;
