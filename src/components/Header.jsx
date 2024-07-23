import React from 'react';
import '../styles/Header.css'; // Asegúrate de crear este archivo CSS para los estilos

const Header = ({ isAuthenticated, onLogout, onLogin }) => {
  return (
    <header className="app-header">
      <h1 className="app-title">MixologyMechStats</h1>
      <button className="auth-btn" onClick={isAuthenticated ? onLogout : onLogin}>
        {isAuthenticated ? 'Logout' : 'Sign Up'}
      </button>
    </header>
  );
};

export default Header;
