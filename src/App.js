import React, { useState } from 'react';
import './App.css';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Header from './components/Header';
import AuthPopup from './components/AuthPopup';
import DrinkCarousel from './components/DrinkCarousel'; // Nuevo componente de carrusel
import BarChart from './components/BarChart';
import LineChart from './components/ProfitsChart';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [expandedChart, setExpandedChart] = useState(null);

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
      {isAuthenticated ? (
        <>
          <div className="middle">
            {/* Usar DrinkCarousel en lugar de DrinkTop y eliminar la funcionalidad de expansión para este componente */}
            <DrinkCarousel />
          </div>
          <div className="bottom">
            <div 
              className={`chart ${expandedChart === 'barChart' ? 'expanded' : ''}`} 
              onClick={() => toggleExpandChart('barChart')}
            >
              <BarChart />
            </div>
            <div 
              className={`chart ${expandedChart === 'lineChart' ? 'expanded' : ''}`} 
              onClick={() => toggleExpandChart('lineChart')}
            >
              <LineChart />
            </div>
          </div>
        </>
      ) : (
        <div className="login-message">
          Por favor, inicia sesión para ver las gráficas.
        </div>
      )}
    </div>
  );
}

export default App;
