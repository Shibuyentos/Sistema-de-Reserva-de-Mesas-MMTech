// frontend/src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/apiService';
import './LoginPage.css'; // Reutilizamos o mesmo estilo do Login!

function RegisterPage() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await registerUser({ nome, email, senha });
            alert('Registo efetuado com sucesso! Por favor, faça o login.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao fazer o registo.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="gradient-text">Crie a Sua Conta</h2>
                <p>Junte-se à nossa comunidade.</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="nome">Nome Completo</label>
                        <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">E-mail</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="senha">Palavra-passe</label>
                        <input type="password" id="senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="btn btn-gradient full-width">Registar</button>
                </form>
                <p className="register-link">
                    Já tem uma conta? <Link to="/login">Faça o login aqui</Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;