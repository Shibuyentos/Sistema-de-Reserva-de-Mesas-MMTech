// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client'; 
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext'; // Importar
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider> {/* Envolver o App com o Provider */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);