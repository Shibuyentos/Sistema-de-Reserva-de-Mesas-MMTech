const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthController {
    async registrar(req, res) {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
        }

        try {
            const hashedPassword = await bcrypt.hash(senha, 10);

            // Criação com Prisma
            const newUser = await prisma.usuario.create({
                data: {
                    nome,
                    email,
                    senha: hashedPassword,
                    perfil: 'membro' // Default
                },
                select: { // Seleciona apenas o que queremos retornar (segurança)
                    id: true,
                    nome: true,
                    email: true,
                    perfil: true
                }
            });

            res.status(201).json({ success: true, user: newUser });

        } catch (error) {
            if (error.code === 'P2002') { // Erro do Prisma para campo único duplicado (email)
                return res.status(409).json({ success: false, message: 'Este e-mail já está em uso.' });
            }
            res.status(500).json({ success: false, message: 'Erro ao registrar utilizador.', error: error.message });
        }
    }

    async login(req, res) {
        const { email, senha } = req.body;

        try {
            const user = await prisma.usuario.findUnique({
                where: { email }
            });

            if (!user) {
                return res.status(404).json({ success: false, message: 'Utilizador não encontrado.' });
            }

            const isMatch = await bcrypt.compare(senha, user.senha);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Palavra-passe incorreta.' });
            }

            const token = jwt.sign(
                { id: user.id, nome: user.nome, perfil: user.perfil },
                process.env.JWT_SECRET,
                { expiresIn: '8h' }
            );

            res.json({
                success: true,
                token,
                user: { id: user.id, nome: user.nome, email: user.email, perfil: user.perfil }
            });

        } catch (error) {
            res.status(500).json({ success: false, message: 'Erro ao fazer login.', error: error.message });
        }
    }
}

module.exports = new AuthController();