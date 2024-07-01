// src/App.js

import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { Chart, registerables } from 'chart.js';
import { ref, get, child } from 'firebase/database';
import { database } from './firebaseConfig';

Chart.register(...registerables);

function App() {
  const overallIncomeChartRef = useRef(null);
  const barChartRef = useRef(null);
  const lineChartRef = useRef(null);
  const [overallIncomeData, setOverallIncomeData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, 'incomedata/documentId'));
      if (snapshot.exists()) {
        const incomeData = snapshot.val();
        setOverallIncomeData(Object.values(incomeData.overallIncome || {}));
        setBarChartData(Object.values(incomeData.barChart || {}));
        setLineChartData(Object.values(incomeData.lineChart || {}));
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const createChart = (ctx, type, data, options) => {
      if (ctx.chart) {
        ctx.chart.destroy();
      }
      ctx.chart = new Chart(ctx, {
        type: type,
        data: data,
        options: options,
      });
    };

    if (overallIncomeData.length) {
      const overallIncomeCtx = document.getElementById('overallIncomeChart').getContext('2d');
      createChart(overallIncomeCtx, 'line', {
        labels: ['May', 'June', 'July', 'August', 'September'],
        datasets: [{
          label: 'Overall Income',
          data: overallIncomeData,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }]
      }, {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      });
      overallIncomeChartRef.current = overallIncomeCtx.chart;
    }

    if (barChartData.length) {
      const barChartCtx = document.getElementById('barChart').getContext('2d');
      createChart(barChartCtx, 'bar', {
        labels: ['Technology', 'Security', 'Income'],
        datasets: [{
          label: 'Overall Income',
          data: barChartData,
          backgroundColor: [
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      }, {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      });
      barChartRef.current = barChartCtx.chart;
    }

    if (lineChartData.length) {
      const lineChartCtx = document.getElementById('lineChart').getContext('2d');
      createChart(lineChartCtx, 'line', {
        labels: ['May', 'June', 'July'],
        datasets: [{
          label: 'Overall Income',
          data: lineChartData,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      }, {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      });
      lineChartRef.current = lineChartCtx.chart;
    }

    return () => {
      if (overallIncomeChartRef.current) {
        overallIncomeChartRef.current.destroy();
      }
      if (barChartRef.current) {
        barChartRef.current.destroy();
      }
      if (lineChartRef.current) {
        lineChartRef.current.destroy();
      }
    };
  }, [overallIncomeData, barChartData, lineChartData]);

  return (
    <div className="dashboard">
      <div className="top">
        <div className="income">Income<br />534</div>
        <div className="income">Income<br />1,568,800$</div>
        <div className="income">Income<br />1,568,800$</div>
      </div>
      <div className="middle">
        <div className="chart">
          <canvas id="overallIncomeChart"></canvas>
        </div>
        <div className="progress">
          <div className="progress-text">Overall Income<br />54%</div>
          <div className="progress-circle" id="progressCircle"></div>
        </div>
      </div>
      <div className="bottom">
        <div className="bar-chart">
          <canvas id="barChart"></canvas>
        </div>
        <div className="line-chart">
          <canvas id="lineChart"></canvas>
        </div>
      </div>
    </div>
  );
}

export default App;
