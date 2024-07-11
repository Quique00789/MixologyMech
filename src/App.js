import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { Chart, registerables } from 'chart.js';
import { ref, get, child } from 'firebase/database';
import { database } from './firebaseConfig';
import Header from './components/Header';
import AuthPopup from './components/AuthPopup';
  
Chart.register(...registerables);

function App() {
  const overallIncomeChartRef = useRef(null);
  const barChartRef = useRef(null);
  const lineChartRef = useRef(null);
  const [overallIncomeData, setOverallIncomeData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);
  const [expandedChart, setExpandedChart] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, 'machineData/documentId'));
        if (snapshot.exists()) {
          const machineData = snapshot.val();
          setOverallIncomeData(Object.values(machineData.drinkConsumption || {}).map(item => item.consumption));
          setBarChartData(Object.values(machineData.barChart || {}));
          setLineChartData(Object.values(machineData.lineChart || {}));
        }
      };

      fetchData();
    } else {
      setOverallIncomeData([]);
      setBarChartData([]);
      setLineChartData([]);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const createChart = (ctx, type, data, options) => {
      if (ctx.chart) {
        ctx.chart.destroy();
      }
      ctx.chart = new Chart(ctx, {
        type: type,
        data: data,
        options: {
          ...options,
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    };
  
    if (isAuthenticated) {
      if (overallIncomeData.length) {
        const overallIncomeCtx = document.getElementById('overallIncomeChart').getContext('2d');
        createChart(overallIncomeCtx, 'line', {
          labels: overallIncomeData.map((_, index) => `Drink ${index + 1}`),
          datasets: [{
            label: 'Drink Consumption',
            data: overallIncomeData,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          }]
        }, {
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
          labels: barChartData.map((_, index) => `Bar ${index + 1}`),
          datasets: [{
            label: 'Expenditure per Drink',
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
          maintainAspectRatio: false,
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
          labels: lineChartData.map((_, index) => `Line ${index + 1}`),
          datasets: [{
            label: 'Prepared Drinks',
            data: lineChartData,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        }, {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        });
        lineChartRef.current = lineChartCtx.chart;
      }
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
  }, [overallIncomeData, barChartData, lineChartData, isAuthenticated]);

  const toggleExpandChart = (chart) => {
    setExpandedChart(chart === expandedChart ? null : chart);
  };

  const closeExpandedChart = () => {
    setExpandedChart(null);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleLoginClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleSuccessfulLogin = () => {
    setIsAuthenticated(true);
    setShowPopup(false);
  };

  return (
    <div className="dashboard">
      <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} onLogin={handleLoginClick} />
      {showPopup && <AuthPopup onClose={handleClosePopup} onSuccessfulLogin={handleSuccessfulLogin} />}
      {expandedChart && <div className="overlay" onClick={closeExpandedChart}></div>}
      <div className="top">
        <div className="income">Income<br />534</div>
        <div className="income">Income<br />1,568,800$</div>
        <div className="income">Income<br />1,568,800$</div>
      </div>
      {isAuthenticated && (
        <>
          <div className="middle">
            <div 
              className={`chart ${expandedChart === 'overallIncomeChart' ? 'expanded' : ''}`} 
              onClick={() => toggleExpandChart('overallIncomeChart')}
            >
              <canvas id="overallIncomeChart"></canvas>
            </div>
          </div>
          <div className="bottom">
            <div 
              className={`bar-chart ${expandedChart === 'barChart' ? 'expanded' : ''}`} 
              onClick={() => toggleExpandChart('barChart')}
            >
              <canvas id="barChart"></canvas>
            </div>
            <div 
              className={`line-chart ${expandedChart === 'lineChart' ? 'expanded' : ''}`} 
              onClick={() => toggleExpandChart('lineChart')}
            >
              <canvas id="lineChart"></canvas>
            </div>
          </div>
        </>
      )}
      {!isAuthenticated && (
        <div className="login-message">
          Por favor, inicia sesión para ver las gráficas.
        </div>
      )}
    </div>
  );
}

export default App;