const prisma = require('../config/prisma');

class RelatorioController {
    async gerarHistoricoReservas(req, res) {
        try {
            const reservas = await prisma.reserva.findMany({
                include: {
                    mesa: true,
                    usuario: true
                },
                orderBy: { dataHoraInicio: 'desc' }
            });

            // Formatando para snake_case (compatibilidade Frontend Admin)
            const data = reservas.map(r => ({
                reserva_id: r.id,
                mesa_id: r.mesaId,
                capacidade: r.mesa.capacidade,
                membro: r.usuario.nome, // Pega nome do usuário
                finalidade: r.finalidade,
                data_hora_inicio: r.dataHoraInicio,
                data_hora_fim: r.dataHoraFim,
                check_in_at: r.checkInAt,
                check_out_at: r.checkOutAt
            }));

            res.status(200).json({
                success: true,
                message: 'Histórico gerado',
                data: data
            });

        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = new RelatorioController();