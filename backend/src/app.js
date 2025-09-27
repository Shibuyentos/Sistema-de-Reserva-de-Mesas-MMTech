const express = require('express');
const cors = require('cors');
require('dotenv').config();

const testeRoutes = require('./routes/TesteRoutes');
const mesaRoutes = require('./routes/MesaRoutes');
const reservaRoutes = require('./routes/ReservaRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api/teste', testeRoutes);
app.use('/api/mesas', mesaRoutes);
app.use('/api/reservas', reservaRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ 
    message: 'Servidor do Sistema de Reservas MMTech rodando!',
    timestamp: new Date().toISOString()
  });
});

module.exports = app;