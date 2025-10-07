// frontend/src/pages/LoginPage.jsx
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { loginUser } from '../services/apiService';
import './LoginPage.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await loginUser({ email, senha });
            if (response.data.success) {
                login(response.data.user, response.data.token);
                // Redireciona o admin para o painel, e o membro para a home
                if (response.data.user.perfil === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao fazer login. Verifique as suas credenciais.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="gradient-text">Bem-vindo de Volta!</h2>
                <p>Faça login para continuar.</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">E-mail</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="senha">Palavra-passe</label>
                        <input type="password" id="senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="btn btn-gradient full-width">Entrar</button>
                </form>
                <p className="register-link">
                    Não tem uma conta? <Link to="/registrar">Registe-se aqui</Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;