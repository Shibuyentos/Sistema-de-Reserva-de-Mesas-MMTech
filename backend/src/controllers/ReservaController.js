// backend/src/controllers/ReservaController.js
const pool = require('../config/database');

class ReservaController {
    async listarMesasDisponiveis(req, res) {
        const { inicio, fim } = req.query; 

        if (!inicio || !fim) {
            return res.status(400).json({ 
                success: false, 
                message: 'Os parâmetros "inicio" e "fim" são obrigatórios.' 
            });
        }

        const inicioDate = new Date(inicio);
        const fimDate = new Date(fim);
    
        if (Number.isNaN(inicioDate.getTime()) || Number.isNaN(fimDate.getTime())) {
            return res.status(400).json({ 
                success: false, 
                message: 'As datas fornecidas são inválidas. Use o formato ISO 8601 (YYYY-MM-DDTHH:MM:SSZ).' 
            });
        }

        if (inicioDate >= fimDate) {
            return res.status(400).json({ 
                success: false, 
                message: 'A data de início deve ser anterior à data de fim.' 
            });
        }

        try {
            // A query busca mesas que NÃO TENHAM NENHUMA reserva que se sobreponha ao intervalo de tempo desejado.
            // (Início da Reserva < Fim do Período) E (Fim da Reserva > Início do Período)
            const query = `
                SELECT * FROM mesas m 
                WHERE NOT EXISTS (
                    SELECT 1 
                    FROM reservas r 
                    WHERE r.mesa_id = m.id 
                    AND r.data_hora_inicio < $2 
                    AND r.data_hora_fim > $1
                )
                ORDER BY m.id ASC;
            `;
            const result = await pool.query(query, [inicioDate, fimDate]);

            res.status(200).json({ 
                success: true, 
                mesas_disponiveis: result.rows 
            });

        } catch (error) {
            res.status(500).json({ 
                success: false, 
                message: 'Erro ao buscar as mesas disponíveis.', 
                error: error.message 
            });
        }
    }

}

module.exports = new ReservaController();
