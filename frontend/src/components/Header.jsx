// frontend/src/components/Header.jsx
import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/logo.png';
import './Header.css';

function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header-container">
      <div className="logo-container">
        <NavLink to="/"><img src={logo} alt="Logo da MMTech" className="logo-img" /></NavLink>
      </div>

      <nav className="navbar-center">
        {/* Link visível para todos */}
        <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Página Inicial
        </NavLink>

        {/* ======================================================================== */}
        {/* NOVO LINK AQUI 👇                                                       */}
        {/* ======================================================================== */}
        {/* Mostra o link "Minhas Reservas" apenas se o utilizador estiver logado */}
        {/* e tiver o perfil de 'membro'.                                          */}
        {user && user.perfil === 'membro' && (
          <NavLink to="/minhas-reservas" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Minhas Reservas
          </NavLink>
        )}

        {/* Mostra o link de Administração apenas para o perfil de 'admin'. */}
        {user && user.perfil === 'admin' && (
          <NavLink to="/admin" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Administração
          </NavLink>
        )}
      </nav>
      
      <div className="navbar-right">
        {user ? (
          <>
            <span className="welcome-message">Olá, {user.nome}</span>
            <button onClick={handleLogout} className="btn-nav-ghost">Logout</button>
          </>
        ) : (
          <NavLink to="/login" className="btn-nav-ghost">
            Login
          </NavLink>
        )}
      </div>
    </header>
  );
}

export default Header;