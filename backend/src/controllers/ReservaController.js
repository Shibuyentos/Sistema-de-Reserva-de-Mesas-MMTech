const prisma = require('../config/prisma');

class ReservaController {
    async listarMesasDisponiveis(req, res) {
        try {
            const mesas = await prisma.mesa.findMany({
                where: { status: 'disponível' },
                orderBy: { id: 'asc' }
            });
            res.status(200).json({ success: true, mesas_disponiveis: mesas });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erro.', error: error.message });
        }
    }

    async SolicitarReserva(req, res) {
        const { mesa_id, finalidade, data_hora_inicio, data_hora_fim } = req.body;
        const usuarioId = req.user.id; // Pegamos o ID do token!

        const inicioDate = new Date(data_hora_inicio);
        const fimDate = new Date(data_hora_fim);

        if (!mesa_id || !finalidade || !data_hora_inicio || !data_hora_fim) {
            return res.status(400).json({ message: "Dados incompletos." });
        }
        if (inicioDate >= fimDate) {
            return res.status(400).json({ message: 'Datas inválidas.' });
        }

        try {
            // Transação: Verifica conflito, cria reserva e atualiza mesa atomicamente
            await prisma.$transaction(async (tx) => {
                
                // 1. Verifica conflito
                const conflito = await tx.reserva.findFirst({
                    where: {
                        mesaId: mesa_id,
                        checkOutAt: null, // Ainda está ativa
                        AND: [
                            { dataHoraInicio: { lt: fimDate } }, // Começa antes do fim da nova
                            { dataHoraFim: { gt: inicioDate } }  // Termina depois do início da nova
                        ]
                    }
                });

                if (conflito) {
                    throw new Error(`A mesa ID ${mesa_id} já está reservada para este horário.`);
                }

                // 2. Cria Reserva
                const novaReserva = await tx.reserva.create({
                    data: {
                        mesaId: mesa_id,
                        usuarioId: usuarioId, // Chave Estrangeira correta
                        finalidade,
                        dataHoraInicio: inicioDate,
                        dataHoraFim: fimDate
                    }
                });

                // 3. Atualiza Mesa para Indisponível
                await tx.mesa.update({
                    where: { id: mesa_id },
                    data: { status: 'indisponível' }
                });

                return novaReserva;
            });

            res.status(201).json({ success: true, message: 'Reserva efetuada!' });

        } catch (error) {
            const status = error.message.includes('já está reservada') ? 409 : 500;
            res.status(status).json({ success: false, message: error.message });
        }
    }

    async CheckIn(req, res) {
        const { reserva_id } = req.params;
        const usuarioId = req.user.id;
        const perfilUser = req.user.perfil;

        try {
            const reserva = await prisma.reserva.findUnique({ where: { id: parseInt(reserva_id) } });

            if (!reserva) return res.status(404).json({ message: 'Reserva não encontrada.' });
            
            // Validação de permissão
            if (reserva.usuarioId !== usuarioId && perfilUser !== 'admin') {
                return res.status(403).json({ message: 'Sem permissão.' });
            }

            if (reserva.checkInAt) return res.status(400).json({ message: 'Check-in já realizado.' });

            const reservaAtualizada = await prisma.reserva.update({
                where: { id: parseInt(reserva_id) },
                data: { checkInAt: new Date() }
            });

            res.status(200).json({ success: true, message: 'Check-in feito!', reserva: reservaAtualizada });

        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async CheckOut(req, res) {
        const { reserva_id } = req.params;
        const usuarioId = req.user.id;
        const perfilUser = req.user.perfil;

        try {
            await prisma.$transaction(async (tx) => {
                const reserva = await tx.reserva.findUnique({ where: { id: parseInt(reserva_id) } });
                
                if (!reserva) throw new Error('Reserva não encontrada.');
                if (reserva.usuarioId !== usuarioId && perfilUser !== 'admin') throw new Error('Sem permissão.');
                if (reserva.checkOutAt) throw new Error('Check-out já realizado.');

                // 1. Atualiza Checkout
                await tx.reserva.update({
                    where: { id: parseInt(reserva_id) },
                    data: { checkOutAt: new Date() }
                });

                // 2. Verifica se há OUTRA reserva ativa na mesma mesa
                const outrasReservas = await tx.reserva.count({
                    where: {
                        mesaId: reserva.mesaId,
                        checkOutAt: null,
                        id: { not: reserva.id }
                    }
                });

                // 3. Se não houver, libera a mesa
                if (outrasReservas === 0) {
                    await tx.mesa.update({
                        where: { id: reserva.mesaId },
                        data: { status: 'disponível' }
                    });
                }
            });

            res.status(200).json({ success: true, message: 'Check-out realizado e mesa liberada.' });

        } catch (error) {
            const status = error.message === 'Sem permissão.' ? 403 : 500;
            res.status(status).json({ success: false, message: error.message });
        }
    }

    async listarMinhasReservas(req, res) {
        const usuarioId = req.user.id;

        try {
            const reservas = await prisma.reserva.findMany({
                where: { usuarioId: usuarioId },
                include: { mesa: true }, // Join com Mesa
                orderBy: { dataHoraInicio: 'desc' }
            });

            // Mapeia para manter compatibilidade com frontend (snake_case)
            const formatted = reservas.map(r => ({
                reserva_id: r.id,
                mesa_id: r.mesaId,
                finalidade: r.finalidade,
                data_hora_inicio: r.dataHoraInicio,
                data_hora_fim: r.dataHoraFim,
                check_in_at: r.checkInAt,
                check_out_at: r.checkOutAt,
                capacidade: r.mesa.capacidade
            }));

            res.status(200).json({ success: true, reservas: formatted });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = new ReservaController();