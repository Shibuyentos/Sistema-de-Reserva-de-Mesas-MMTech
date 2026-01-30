const prisma = require('../config/prisma');

class MesaController {
    async registrarMesa(req, res) {
        const { capacidade } = req.body;

        if (!capacidade || typeof capacidade !== 'number' || capacidade <= 0) { 
            return res.status(400).json({ 
                success: false, 
                message: 'O campo "capacidade" é obrigatório.'
            });
        }

        try {
            const novaMesa = await prisma.mesa.create({
                data: { capacidade }
            });

            res.status(201).json({
                success: true,
                message: 'Mesa registrada com sucesso!',
                mesa: novaMesa
            });

        } catch (error) {
            res.status(500).json({ success: false, message: 'Erro ao registrar a mesa.', error: error.message });
        }
    }

    async listarMesas(req, res) {
        try {
            // Busca todas as mesas e inclui reservas ativas (sem checkout)
            const mesas = await prisma.mesa.findMany({
                include: {
                    reservas: {
                        where: { checkOutAt: null }, // Apenas reservas ativas
                        include: { usuario: true }   // Traz dados do usuário (antigo membro)
                    }
                },
                orderBy: { id: 'asc' }
            });

            // Formatação para manter compatibilidade com o Frontend
            const mesasFormatadas = mesas.map(mesa => {
                const reservaAtiva = mesa.reservas[0]; // Pega a primeira reserva ativa, se houver
                
                // Lógica de Ocupada: Tem reserva E status da mesa é indisponível
                // Ou simplificando: se tem reserva ativa e a data bate com agora (opcional)
                // Vamos manter a lógica do status do banco + presença de reserva
                const isOcupada = mesa.status === 'indisponível' && reservaAtiva;

                return {
                    id: mesa.id,
                    capacidade: mesa.capacidade,
                    status: isOcupada ? 'ocupada' : 'disponivel',
                    reserva_atual: isOcupada ? {
                        membro: reservaAtiva.usuario.nome, // Mapeando usuario.nome para membro
                        finalidade: reservaAtiva.finalidade,
                        data_hora_inicio: reservaAtiva.dataHoraInicio,
                        data_hora_fim: reservaAtiva.dataHoraFim,
                    } : null
                };
            });

            res.status(200).json({ success: true, mesas: mesasFormatadas });

        } catch (error) {
            res.status(500).json({ success: false, message: 'Erro ao buscar as mesas.', error: error.message });
        }
    }
}

module.exports = new MesaController();