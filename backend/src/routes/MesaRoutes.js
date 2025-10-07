// backend/src/routes/MesaRoutes.js
const express = require('express');
const MesaController = require('../controllers/MesaController');
const { proteger, isAdmin } = require('../middleware/authMiddleware'); // Importar

const router = express.Router();

// A rota para REGISTRAR uma nova mesa agora é protegida
router.post('/', proteger, isAdmin, MesaController.registrarMesa);

// A rota para LISTAR todas as mesas continua pública
router.get('/', MesaController.listarMesas);

module.exports = router;