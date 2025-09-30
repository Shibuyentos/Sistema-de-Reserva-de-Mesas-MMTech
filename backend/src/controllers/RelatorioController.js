// backend/src/controllers/RelatorioController.js
const pool = require('../config/database');

class RelatorioController {
    async gerarHistoricoReservas(req, res) {
        try {
            const query = `
            SELECT 
                r.id AS reserva_id,
                r.mesa_id,
                m.capacidade,
                r.membro,
                r.finalidade,
                r.data_hora_inicio,
                r.data_hora_fim,
                r.check_in_at,
                r.check_out_at
            FROM 
                reservas r
            JOIN
                mesas m 
                ON r.mesa_id = m.id
            ORDER BY
                r.data_hora_inicio DESC`
            
            const result = await pool.query(query);

            res
                .status(200)
                .json({
                    success: true,
                    message: 'Histórico de reservas gerado com sucesso',
                    data: result.rows
                });

        } catch (error) {
            res
            .status(500)
            .json({
                success: false,
                message: 'Erro ao gerar o relatorio de histórico de reservas',
                error: error.message
            });
        }
    }
}

module.exports = new RelatorioController();