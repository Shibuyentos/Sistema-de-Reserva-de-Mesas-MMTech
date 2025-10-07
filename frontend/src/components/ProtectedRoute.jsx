// frontend/src/components/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return <div>A carregar...</div>; // Ou um spinner/loading component
    }

    if (!user) {
        // Se não estiver logado, redireciona para a página de login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (adminOnly && user.perfil !== 'admin') {
        // Se a rota é só para admin e o user não é admin, redireciona
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;