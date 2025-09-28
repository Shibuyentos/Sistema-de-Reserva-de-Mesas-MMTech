// backend/src/routes/ReservaRoutes.js
const express = require('express');
const ReservaController = require('../controllers/ReservaController');

const router = express.Router();

// Rota para LISTAR mesas disponíveis em um intervalo de tempo.
// Acessada via: GET http://localhost:3000/api/reservas/disponiveis?inicio=2024-01-01T10:00:00Z&fim=2024-01-01T12:00:00Z ajustar formato...
router.get('/disponiveis', ReservaController.listarMesasDisponiveis);

// Rota para SOLICITAR uma nova reserva.
// Acessada via: POST http://localhost:3000/api/reservas/reservar
router.post('/reservar', ReservaController.SolicitarReserva);


module.exports = router;
