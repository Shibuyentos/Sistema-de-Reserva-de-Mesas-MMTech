// backend/src/routes/ReservaRoutes.js
const express = require('express');
const ReservaController = require('../controllers/ReservaController');
// A CORREÇÃO ESTÁ AQUI 👇 (removido o "s" de "middlewares")
const { proteger } = require('../middleware/authMiddleware'); 

const router = express.Router();

// Rota para o utilizador logado ver as suas próprias reservas.
router.get('/minhas-reservas', proteger, ReservaController.listarMinhasReservas);

// Rotas existentes, agora protegidas
router.get('/disponiveis', ReservaController.listarMesasDisponiveis);
router.post('/reservar', proteger, ReservaController.SolicitarReserva);
router.post('/check_in/:reserva_id', proteger, ReservaController.CheckIn);
router.post('/check_out/:reserva_id', proteger, ReservaController.CheckOut);

module.exports = router;