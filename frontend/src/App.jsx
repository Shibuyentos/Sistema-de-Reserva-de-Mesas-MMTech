// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage'; // Importar a nova página
import './App.css';

const navStyle = {
    padding: '1rem',
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    backgroundColor: '#1a1a1a',
    marginBottom: '2rem'
};

function App() {
  return (
    <BrowserRouter>
      <nav style={navStyle}>
        <Link to="/">Página Inicial</Link>
        <Link to="/admin">Página de Admin</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;