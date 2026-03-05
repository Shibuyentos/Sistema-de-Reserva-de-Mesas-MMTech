// backend/src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const proteger = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'seu_segredo_jwt_aqui');
            req.user = decoded; // Adiciona os dados do user ao objeto da requisição
            return next();
        } catch (error) {
            return res.status(401).json({ message: 'Token não é válido.' });
        }
    }

    return res.status(401).json({ message: 'Acesso não autorizado, sem token.' });
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.perfil === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Acesso negado. Apenas para administradores.' });
    }
};

module.exports = { proteger, isAdmin };