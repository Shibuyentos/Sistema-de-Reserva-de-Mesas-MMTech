// backend/src/routes/MesaRoutes.js
const express = require('express');
const MesaController = require('../controllers/MesaController');

const router = express.Router();

// Rota para REGISTRAR uma nova mesa.
// Acessada via: POST http://localhost:3000/api/mesas
router.post('/', MesaController.registrarMesa);

// Rota para LISTAR todas as mesas.
// Acessada via: GET http://localhost:3000/api/mesas
router.get('/', MesaController.listarMesas);

module.exports = router;