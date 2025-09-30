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


    async SolicitarReserva(req,res) {
        const { mesa_id, finalidade, data_hora_inicio, data_hora_fim, membro,} = req.body;

        const inicioDate = new Date(data_hora_inicio);
        const fimDate = new Date(data_hora_fim);

        if (!mesa_id || !finalidade || !data_hora_inicio || !data_hora_fim || !membro) {
            return res.status(400).json({ 
                success: false,
                message: "Dados incompletos. É necessário fornecer número da mesa, finalidade, data_hora_inicio, data_hora_fim e membro." 
            });
        }

        if (Number.isNaN(inicioDate.getTime()) || Number.isNaN(fimDate.getTime()) || inicioDate >= fimDate) {
            return res.status(400).json({ 
                success: false, 
                message: 'As datas fornecidas são inválidas ou a data de início não é anterior à de fim.' 
            });
        }

        try {
            await pool.query('BEGIN'); // Inicia uma transação para garantir a consistência dos dados

            const QueryVerificaConflito = 'SELECT 1 FROM reservas WHERE mesa_id = $1 AND data_hora_inicio < $3 AND data_hora_fim > $2';
            const ResultadoConflito = await pool.query(QueryVerificaConflito, [mesa_id, inicioDate, fimDate]);

            if(ResultadoConflito.rows.length > 0) {
                await pool.query('ROLLBACK') //Desfaz a Transação
                return res
                .status(409) // 409 Conflict
                .json({success: false, message: `A mesa ID ${mesa_id} já está para este horário`})
            }
            
            
            //Fazendo o INSERT para a nova Reserva:
            const QueryInsert = 'INSERT INTO reservas (mesa_id, finalidade, data_hora_inicio, data_hora_fim, membro) VALUES ($1, $2, $3, $4, $5) RETURNING *';
            const Values = [mesa_id, finalidade, inicioDate, fimDate, membro];
            const ResultReserva = await pool.query(QueryInsert, Values);

            const QueryUpdateMesa = "UPDATE mesas SET status = 'indisponível' WHERE id = $1";
            await pool.query(QueryUpdateMesa, [mesa_id]);

            await pool.query('COMMIT'); // Confirma a Transação

            res
                .status(201)
                .json({
                    success: true,
                    messagem: 'Reserva efetuada com sucesso!',
                    reserva: ResultReserva.rows[0],
                })

        } catch (error) {
            await pool.query('ROLLBACK'); // Desfaz a transação em caso de erro
            res.status(500).json({
                success: false,
                message: 'Erro ao solicitar a reserva.',
                error: error.message
            });
        }
    }

    async CheckIn(req, res) {
        const reserva_id = Number(req.params.reserva_id)
        const QueryUpdate = 'UPDATE  reservas SET check_in_at = CURRENT_TIMESTAMP WHERE id = $1'
        const result = await pool.query(QueryUpdate, [reserva_id]);

        try{
            await pool.query(QueryUpdate, [reserva_id]);
            res
                .status(201)
                .json({
                    success: true,
                    messagem: 'Check_in efetuado com sucesso!',
                    reserva: result.rows[0],
                })

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erro ao realizar o check_in',
                error: error.message
            });
        }
    }

        async CheckOut(req, res) {
        const reserva_id = Number(req.params.reserva_id)
        const QueryUpdate = 'UPDATE  reservas SET check_out_at = CURRENT_TIMESTAMP WHERE id = $1'
        const result = await pool.query(QueryUpdate, [reserva_id]);

        try{
            await pool.query(QueryUpdate, [reserva_id]);
            res
                .status(201)
                .json({
                    success: true,
                    messagem: 'Check_out efetuado com sucesso. Até a proxima!',
                    reserva: result.rows[0],
                })

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erro ao realizar o check_out',
                error: error.message
            });
        }
    }
}

module.exports = new ReservaController();
