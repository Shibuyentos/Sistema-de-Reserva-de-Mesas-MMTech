// backend/src/routes/RelatorioRoutes.js
const express = require('express');
const RelatorioController = require('../controllers/RelatorioController');

const router = express.Router();

router.get('/historico-reservas', RelatorioController.gerarHistoricoReservas);

module.exports = router;