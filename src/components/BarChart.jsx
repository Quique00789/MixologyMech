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
<<<<<<< Updated upstream
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
=======
      const snapshot = await get(child(dbRef, 'bebidas'));

      if (snapshot.exists()) {
        // Obtener los datos de las bebidas
        const rawData = snapshot.val() || {};

        // Agrupar y sumar la cantidad por nombre de bebida
        const data = Object.values(rawData).reduce((acc, item) => {
          const quantity = parseFloat(item.cantidad) || 0;

          if (acc[item.nombre]) {
            acc[item.nombre] += quantity;
          } else {
            acc[item.nombre] = quantity;
>>>>>>> Stashed changes
          }
        });

<<<<<<< Updated upstream
        const labels = Object.keys(groupedData); // Nombres de las bebidas
        const consumptionData = Object.values(groupedData); // Consumos totales de las bebidas
=======
        const labels = Object.keys(data); // Nombres de las bebidas
        const quantityData = Object.values(data); // Cantidades totales de las bebidas
>>>>>>> Stashed changes

        if (chartRef.current) {
          chartRef.current.destroy();
        }

        const ctx = document.getElementById('barChart').getContext('2d');
        chartRef.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
<<<<<<< Updated upstream
              label: 'Consumo por Bebida',
              data: consumptionData,
=======
              label: 'Total Quantity per Drink',
              data: quantityData,
>>>>>>> Stashed changes
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
