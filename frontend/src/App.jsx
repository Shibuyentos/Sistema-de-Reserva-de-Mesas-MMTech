// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <NavLink to="/">Página Inicial</NavLink>
        <NavLink to="/admin">Página de Admin</NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;