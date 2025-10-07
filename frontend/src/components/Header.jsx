// frontend/src/components/Header.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Header.css';

function Header() {
  return (
    <header className="header-container">
      <div className="logo-container">
        <img src={logo} alt="Logo da MMTech" className="logo-img" />
      </div>
      <nav className="navbar">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Página Inicial
        </NavLink>
        <NavLink to="/admin" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Administração
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;