// backend/src/controllers/ReservaController.js
const db = require('../config/database');

class ReservaController {
    async listarMesasDisponiveis(req, res) {
        try {
            const rows = db.prepare(`
                SELECT id, capacidade, status FROM mesas
                WHERE status = 'disponível'
                ORDER BY id ASC
            `).all();

            res.status(200).json({
                success: true,
                mesas_disponiveis: rows
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erro ao buscar as mesas disponíveis.',
                error: error.message
            });
        }
    }

    async SolicitarReserva(req, res) {
        const { mesa_id, finalidade, data_hora_inicio, data_hora_fim } = req.body;
        const membro = req.user.nome;

        const inicioDate = new Date(data_hora_inicio);
        const fimDate = new Date(data_hora_fim);

        if (!mesa_id || !finalidade || !data_hora_inicio || !data_hora_fim || !membro) {
            return res.status(400).json({
                success: false,
                message: 'Dados incompletos. É necessário fornecer todos os campos da reserva.'
            });
        }

        if (isNaN(inicioDate.getTime()) || isNaN(fimDate.getTime()) || inicioDate >= fimDate) {
            return res.status(400).json({
                success: false,
                message: 'As datas fornecidas são inválidas ou a data de início não é anterior à de fim.'
            });
        }

        try {
            const inicioISO = inicioDate.toISOString();
            const fimISO = fimDate.toISOString();

            let reservaId;

            const transact = db.transaction(() => {
                const conflito = db.prepare(
                    'SELECT 1 FROM reservas WHERE mesa_id = ? AND data_hora_inicio < ? AND data_hora_fim > ? AND check_out_at IS NULL'
                ).get(mesa_id, fimISO, inicioISO);

                if (conflito) {
                    throw Object.assign(new Error(`A mesa ID ${mesa_id} já está reservada para este horário`), { isConflict: true });
                }

                const result = db.prepare(
                    'INSERT INTO reservas (mesa_id, finalidade, data_hora_inicio, data_hora_fim, membro) VALUES (?, ?, ?, ?, ?)'
                ).run(mesa_id, finalidade, inicioISO, fimISO, membro);

                db.prepare("UPDATE mesas SET status = 'indisponível' WHERE id = ?").run(mesa_id);

                reservaId = result.lastInsertRowid;
            });

            transact();

            const reserva = db.prepare('SELECT * FROM reservas WHERE id = ?').get(reservaId);

            res.status(201).json({
                success: true,
                message: 'Reserva efetuada com sucesso!',
                reserva,
            });

        } catch (error) {
            if (error.isConflict) {
                return res.status(409).json({ success: false, message: error.message });
            }
            res.status(500).json({
                success: false,
                message: 'Erro ao solicitar a reserva.',
                error: error.message
            });
        }
    }

    async CheckIn(req, res) {
        const { reserva_id } = req.params;
        const nomeDoMembro = req.user.nome;

        try {
            const reserva = db.prepare('SELECT membro FROM reservas WHERE id = ?').get(reserva_id);

            if (!reserva || (reserva.membro !== nomeDoMembro && req.user.perfil !== 'admin')) {
                return res.status(403).json({ success: false, message: 'Você não tem permissão para fazer check-in nesta reserva.' });
            }

            const result = db.prepare(
                "UPDATE reservas SET check_in_at = datetime('now') WHERE id = ? AND check_in_at IS NULL"
            ).run(reserva_id);

            if (result.changes === 0) {
                return res.status(404).json({ success: false, message: 'Reserva não encontrada ou check-in já realizado.' });
            }

            const reservaAtualizada = db.prepare('SELECT * FROM reservas WHERE id = ?').get(reserva_id);

            res.status(200).json({
                success: true,
                message: 'Check-in efetuado com sucesso!',
                reserva: reservaAtualizada,
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
            const reserva = db.prepare('SELECT membro FROM reservas WHERE id = ?').get(reserva_id);

            if (!reserva || (reserva.membro !== nomeDoMembro && req.user.perfil !== 'admin')) {
                return res.status(403).json({ success: false, message: 'Você não tem permissão para fazer check-out nesta reserva.' });
            }

            let mesaId;

            const transact = db.transaction(() => {
                const result = db.prepare(
                    "UPDATE reservas SET check_out_at = datetime('now') WHERE id = ? AND check_out_at IS NULL"
                ).run(reserva_id);

                if (result.changes === 0) {
                    throw Object.assign(new Error('Reserva não encontrada ou já finalizada.'), { isNotFound: true });
                }

                const reservaAtualizada = db.prepare('SELECT mesa_id FROM reservas WHERE id = ?').get(reserva_id);
                mesaId = reservaAtualizada.mesa_id;

                const outrasReservas = db.prepare(
                    'SELECT 1 FROM reservas WHERE mesa_id = ? AND check_out_at IS NULL'
                ).get(mesaId);

                if (!outrasReservas) {
                    db.prepare("UPDATE mesas SET status = 'disponível' WHERE id = ?").run(mesaId);
                }
            });

            transact();

            res.status(200).json({
                success: true,
                message: 'Check-out efetuado com sucesso. A mesa foi liberada!',
            });
        } catch (error) {
            if (error.isNotFound) {
                return res.status(404).json({ success: false, message: error.message });
            }
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
            const rows = db.prepare(`
                SELECT
                    r.id AS reserva_id, r.mesa_id, r.finalidade, r.data_hora_inicio,
                    r.data_hora_fim, r.check_in_at, r.check_out_at, m.capacidade
                FROM reservas r
                JOIN mesas m ON r.mesa_id = m.id
                WHERE r.membro = ?
                ORDER BY r.data_hora_inicio DESC
            `).all(nomeDoMembro);

            res.status(200).json({
                success: true,
                reservas: rows
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
