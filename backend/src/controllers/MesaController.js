// backend/src/controllers/MesaController.js
const pool = require('../config/database');

class MesaController {
    async registrarMesa(req, res) { // Método/Função
        // 'req.body' é onde chegam os dados enviados numa requisição POST.
        const { capacidade } = req.body; // = const capacidade = req.body.capacidade;

        // Validação simples: a capacidade foi enviada?
        if (!capacidade) { //Se NÃO existir capacidade, retorne...
            return res
                .status(400) //400 → Bad Request
                .json({ success: false, message: 'O campo "capacidade" é obrigatório.'});
        }

        try {
            const query = 'INSERT INTO mesas (capacidade) VALUES ($1) RETURNING *';
            const values = [capacidade];
            
            const result = await pool.query(query, values);

            res.status(201).json({
                success: true,
                message: 'Mesa registrada com sucesso!',
                mesa: result.rows[0]
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erro ao registrar a mesa.',
                error: error.message
            });
        }
    }
    //Lista todas as mesas cadastradas no banco de dados.
    async listarMesas(req, res) { //Método/Função
        try {
            const query = 'SELECT * FROM mesas ORDER BY id ASC';
            const result = await pool.query(query);

            res.status(200).json({
                success: true,
                mesas: result.rows
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erro ao buscar as mesas.',
                error: error.message
            });
        }
    }
}

module.exports = new MesaController();