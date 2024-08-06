//Header.jsx
import React from 'react';
import '../styles/Header.css'; 

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
