// frontend/src/App.jsx

// A CORREÇÃO ESTÁ AQUI 👇 (Adicionando a importação que faltava)
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyReservationsPage from './pages/MyReservationsPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="container">
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registrar" element={<RegisterPage />} />

          {/* Rota Protegida para Membros */}
          <Route 
            path="/minhas-reservas" 
            element={
              <ProtectedRoute>
                <MyReservationsPage />
              </ProtectedRoute>
            } 
          />

          {/* Rota Protegida para Admin */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;