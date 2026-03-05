// backend/src/controllers/MesaController.js
const db = require('../config/database');

class MesaController {
    async registrarMesa(req, res) {
        const { capacidade } = req.body;

        if (!capacidade || typeof capacidade !== 'number' || capacidade <= 0) {
            return res.status(400).json({
                success: false,
                message: 'O campo "capacidade" é obrigatório e deve ser um número positivo.'
            });
        }

        try {
            const result = db.prepare('INSERT INTO mesas (capacidade) VALUES (?)').run(capacidade);
            const mesa = db.prepare('SELECT * FROM mesas WHERE id = ?').get(result.lastInsertRowid);

            res.status(201).json({
                success: true,
                message: 'Mesa registrada com sucesso!',
                mesa
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erro ao registrar a mesa.',
                error: error.message
            });
        }
    }

    async listarMesas(req, res) {
        try {
            const rows = db.prepare(`
                SELECT
                    m.id,
                    m.capacidade,
                    m.status,
                    r.membro,
                    r.finalidade,
                    r.data_hora_inicio,
                    r.data_hora_fim
                FROM
                    mesas m
                LEFT JOIN
                    reservas r ON m.id = r.mesa_id AND r.check_out_at IS NULL
                ORDER BY
                    m.id ASC
            `).all();

            const mesasFormatadas = rows.map(mesa => {
                const isOcupada = mesa.status === 'indisponível' && mesa.membro != null;

                return {
                    id: mesa.id,
                    capacidade: mesa.capacidade,
                    status: isOcupada ? 'ocupada' : 'disponivel',
                    reserva_atual: isOcupada ? {
                        membro: mesa.membro,
                        finalidade: mesa.finalidade,
                        data_hora_inicio: mesa.data_hora_inicio,
                        data_hora_fim: mesa.data_hora_fim,
                    } : null
                };
            });

            res.status(200).json({
                success: true,
                mesas: mesasFormatadas
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
