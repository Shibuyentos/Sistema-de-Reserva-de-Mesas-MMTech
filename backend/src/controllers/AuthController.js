// backend/src/controllers/AuthController.js
const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthController {
    async registrar(req, res) {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
        }

        try {
            const hashedPassword = await bcrypt.hash(senha, 10); // Encripta a senha

            const newUser = await pool.query(
                'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email, perfil',
                [nome, email, hashedPassword]
            );

            res.status(201).json({ success: true, user: newUser.rows[0] });
        } catch (error) {
            if (error.code === '23505') { // Código de erro para violação de constraint UNIQUE
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
            const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
            const user = result.rows[0];

            if (!user) {
                return res.status(404).json({ success: false, message: 'Utilizador não encontrado.' });
            }

            const isMatch = await bcrypt.compare(senha, user.senha);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Palavra-passe incorreta.' });
            }

            // Gera o Token JWT
            const token = jwt.sign(
                { id: user.id, nome: user.nome, perfil: user.perfil },
                process.env.JWT_SECRET || 'seu_segredo_jwt_aqui', // Crie uma variável JWT_SECRET no seu .env
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