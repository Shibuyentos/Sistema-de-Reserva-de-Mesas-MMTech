// backend/src/app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { proteger, isAdmin } = require('./middleware/authMiddleware');

const mesaRoutes = require('./routes/MesaRoutes');
const reservaRoutes = require('./routes/ReservaRoutes');
const relatorioRoutes = require('./routes/RelatorioRoutes'); 
const authRoutes = require('./routes/AuthRoutes'); // Importar novas rotas

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api/auth', authRoutes); // Rota pública para login/registo

// A rota para ver as mesas continua pública
app.use('/api/mesas', mesaRoutes); 
app.use('/api/reservas', reservaRoutes); 

// A rota de relatórios agora é protegida
app.use('/api/relatorios', proteger, isAdmin, relatorioRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ 
    message: 'Servidor do Sistema de Reservas MMTech a rodar!',
    timestamp: new Date().toISOString()
  });
});

module.exports = app;