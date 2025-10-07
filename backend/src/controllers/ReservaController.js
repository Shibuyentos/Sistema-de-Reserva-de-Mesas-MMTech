// backend/src/controllers/ReservaController.js
const pool = require('../config/database');

class ReservaController {
    async listarMesasDisponiveis(req, res) {
        try {
            const query = `
                SELECT id, capacidade, status FROM mesas m 
                WHERE status = 'disponível'
                ORDER BY id ASC
            `;
            const result = await pool.query(query);

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
        const { mesa_id, finalidade, data_hora_inicio, data_hora_fim } = req.body;
        // O nome do membro agora vem do token, não do corpo da requisição!
        const membro = req.user.nome;

        const inicioDate = new Date(data_hora_inicio);
        const fimDate = new Date(data_hora_fim);

        if (!mesa_id || !finalidade || !data_hora_inicio || !data_hora_fim || !membro) {
            return res.status(400).json({ 
                success: false,
                message: "Dados incompletos. É necessário fornecer todos os campos da reserva." 
            });
        }

        if (isNaN(inicioDate.getTime()) || isNaN(fimDate.getTime()) || inicioDate >= fimDate) {
            return res.status(400).json({ 
                success: false, 
                message: 'As datas fornecidas são inválidas ou a data de início não é anterior à de fim.' 
            });
        }

        try {
            await pool.query('BEGIN');

            const QueryVerificaConflito = 'SELECT 1 FROM reservas WHERE mesa_id = $1 AND data_hora_inicio < $3 AND data_hora_fim > $2 AND check_out_at IS NULL';
            const ResultadoConflito = await pool.query(QueryVerificaConflito, [mesa_id, data_hora_inicio, data_hora_fim]);

            if(ResultadoConflito.rows.length > 0) {
                await pool.query('ROLLBACK');
                return res.status(409).json({success: false, message: `A mesa ID ${mesa_id} já está reservada para este horário`});
            }
            
            const QueryInsert = 'INSERT INTO reservas (mesa_id, finalidade, data_hora_inicio, data_hora_fim, membro) VALUES ($1, $2, $3, $4, $5) RETURNING *';
            const Values = [mesa_id, finalidade, inicioDate, fimDate, membro];
            const ResultReserva = await pool.query(QueryInsert, Values);

            // ATENÇÃO: A lógica de mudar o status da mesa para "indisponível" pode ser complexa
            // se múltiplas reservas futuras forem permitidas. Por agora, vamos manter,
            // mas saiba que o status real vem da query na HomePage.
            const QueryUpdateMesa = "UPDATE mesas SET status = 'indisponível' WHERE id = $1";
            await pool.query(QueryUpdateMesa, [mesa_id]);

            await pool.query('COMMIT');

            res.status(201).json({
                success: true,
                message: 'Reserva efetuada com sucesso!',
                reserva: ResultReserva.rows[0],
            });

        } catch (error) {
            await pool.query('ROLLBACK');
            res.status(500).json({
                success: false,
                message: 'Erro ao solicitar a reserva.',
                error: error.message
            });
        }
    }

    async CheckIn(req, res) {
        const { reserva_id } = req.params;
        const nomeDoMembro = req.user.nome; // Apenas o próprio membro ou admin pode dar check-in

        try {
            // Adicionamos uma verificação para garantir que o utilizador é o dono da reserva ou um admin
            const permissaoQuery = await pool.query("SELECT membro FROM reservas WHERE id = $1", [reserva_id]);
            if (permissaoQuery.rows.length === 0 || (permissaoQuery.rows[0].membro !== nomeDoMembro && req.user.perfil !== 'admin')) {
                return res.status(403).json({ success: false, message: "Você não tem permissão para fazer check-in nesta reserva." });
            }

            const QueryUpdate = 'UPDATE reservas SET check_in_at = CURRENT_TIMESTAMP WHERE id = $1 AND check_in_at IS NULL RETURNING *';
            const result = await pool.query(QueryUpdate, [reserva_id]);

            if (result.rows.length === 0) {
                return res.status(404).json({ success: false, message: 'Reserva não encontrada ou check-in já realizado.' });
            }

            res.status(200).json({
                success: true,
                message: 'Check-in efetuado com sucesso!',
                reserva: result.rows[0],
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erro ao realizar o check-in',
                error: error.message
            });
        }
    }

    async CheckOut(req, res) {
        const { reserva_id } = req.params;
        const nomeDoMembro = req.user.nome;

        try {
            await pool.query('BEGIN');

            const permissaoQuery = await pool.query("SELECT membro FROM reservas WHERE id = $1", [reserva_id]);
            if (permissaoQuery.rows.length === 0 || (permissaoQuery.rows[0].membro !== nomeDoMembro && req.user.perfil !== 'admin')) {
                await pool.query('ROLLBACK');
                return res.status(403).json({ success: false, message: "Você não tem permissão para fazer check-out nesta reserva." });
            }

            const updateReservaQuery = `
                UPDATE reservas 
                SET check_out_at = CURRENT_TIMESTAMP 
                WHERE id = $1 AND check_out_at IS NULL
                RETURNING mesa_id;
            `;
            const resultReserva = await pool.query(updateReservaQuery, [reserva_id]);

            if (resultReserva.rows.length === 0) {
                await pool.query('ROLLBACK'); 
                return res.status(404).json({
                    success: false,
                    message: 'Reserva não encontrada ou já finalizada.'
                });
            }

            const mesaId = resultReserva.rows[0].mesa_id;

            // Lógica para verificar se há outras reservas ativas antes de libertar a mesa
            const outrasReservasQuery = 'SELECT 1 FROM reservas WHERE mesa_id = $1 AND check_out_at IS NULL';
            const outrasReservasResult = await pool.query(outrasReservasQuery, [mesaId]);

            if (outrasReservasResult.rows.length === 0) {
                const updateMesaQuery = "UPDATE mesas SET status = 'disponível' WHERE id = $1";
                await pool.query(updateMesaQuery, [mesaId]);
            }

            await pool.query('COMMIT');

            res.status(200).json({
                success: true,
                message: 'Check-out efetuado com sucesso. A mesa foi liberada!',
            });
        } catch (error) {
            await pool.query('ROLLBACK');
            res.status(500).json({
                success: false,
                message: 'Erro ao realizar o check-out.',
                error: error.message
            });
        }
    }

    async listarMinhasReservas(req, res) {
        const nomeDoMembro = req.user.nome;
        
        try {
            const query = `
                SELECT 
                    r.id AS reserva_id, r.mesa_id, r.finalidade, r.data_hora_inicio, 
                    r.data_hora_fim, r.check_in_at, r.check_out_at, m.capacidade
                FROM reservas r
                JOIN mesas m ON r.mesa_id = m.id
                WHERE r.membro = $1
                ORDER BY r.data_hora_inicio DESC
            `;
            
            const result = await pool.query(query, [nomeDoMembro]);

            res.status(200).json({
                success: true,
                reservas: result.rows
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erro ao buscar as suas reservas.',
                error: error.message
            });
        }
    }
}

module.exports = new ReservaController();