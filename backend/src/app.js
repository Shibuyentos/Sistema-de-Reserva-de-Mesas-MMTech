// backend/src/app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const mesaRoutes = require('./routes/MesaRoutes');
const reservaRoutes = require('./routes/ReservaRoutes');
const relatorioRoutes = require('./routes/RelatorioRoutes'); 

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api/mesas', mesaRoutes);
app.use('/api/reservas', reservaRoutes);
app.use('/api/relatorios', relatorioRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ 
    message: 'Servidor do Sistema de Reservas MMTech rodando!',
    timestamp: new Date().toISOString()
  });
});

module.exports = app;