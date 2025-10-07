// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { apiClient } from '../services/apiService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
            
            /*
             * NOTA DE SEGURANÇA E BOAS PRÁTICAS:
             * A abordagem atual de confiar nos dados do usuario guardados no localStorage 
             * é vulnerável, pois podem ser facilmente manipulados pelo cliente.
             * * Numa aplicação de produção, a prática recomendada seria:
             * 1. Guardar apenas o token JWT no localStorage.
             * 2. Ao carregar a aplicação, enviar este token para um endpoint seguro no backend
             * (ex: GET /api/auth/me) para validar o token e obter os dados
             * atualizados e seguros do utilizador a partir do servidor.
             * Isso garante que os dados do utilizador (como o 'perfil') são sempre autênticos.
            */
        }
        setLoading(false);
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(userData));
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        delete apiClient.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};