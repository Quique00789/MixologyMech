import React from 'react';

const Header = ({ isAuthenticated, onLogout, onLogin }) => {
  return (
    <header className="app-header">
      <button className="auth-btn" onClick={isAuthenticated ? onLogout : onLogin}>
        {isAuthenticated ? 'Logout' : 'Sign Up'}
      </button>
    </header>
  );
};

export default Header;
