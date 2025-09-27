const express = require('express');
const TesteController = require('../controllers/TesteController');

const router = express.Router();

// GET /api/teste
router.get('/', TesteController.testeBasico);

module.exports = router;