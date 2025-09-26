const pool = require('../config/database');

class TesteController {
  // GET /api/teste - Rota de teste básica
  async testeBasico(req, res) {
    try {
      res.json({
        success: true,
        message: 'API funcionando perfeitamente!',
        timestamp: new Date().toISOString(),
        server: 'Node.js + Express',
        database: 'PostgreSQL'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro no teste básico',
        error: error.message
      });
    }
  }
}

module.exports = new TesteController();