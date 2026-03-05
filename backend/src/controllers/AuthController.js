// backend/src/controllers/AuthController.js
const db = require('../config/database');
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

            const stmt = db.prepare('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)');
            const result = stmt.run(nome, email, hashedPassword);

            const newUser = db.prepare('SELECT id, nome, email, perfil FROM usuarios WHERE id = ?').get(result.lastInsertRowid);

            res.status(201).json({ success: true, user: newUser });
        } catch (error) {
            if (error.code === 'SQLITE_CONSTRAINT_UNIQUE' || (error.message && error.message.includes('UNIQUE constraint failed'))) {
                return res.status(409).json({ success: false, message: 'Este e-mail já está em uso.' });
            }
            res.status(500).json({ success: false, message: 'Erro ao registrar utilizador.', error: error.message });
        }
    }

    async login(req, res) {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
        }

        try {
            const user = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);

            if (!user) {
                return res.status(404).json({ success: false, message: 'Utilizador não encontrado.' });
            }

            const isMatch = await bcrypt.compare(senha, user.senha);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Palavra-passe incorreta.' });
            }

            const token = jwt.sign(
                { id: user.id, nome: user.nome, perfil: user.perfil },
                process.env.JWT_SECRET || 'seu_segredo_jwt_aqui',
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
