// frontend/src/components/ModalReserva.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { criarReserva } from '../services/apiService';
import './ModalReserva.css';

function ModalReserva({ mesa, onClose, onReservaSucesso }) {
    const { user } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        finalidade: '',
        membro: user ? user.nome : '',
        data_hora_inicio: '',
        data_hora_fim: '',
    });

    // Novos estados para feedback e controle do formulário
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '' }); // type: 'success' ou 'error'

    if (!mesa) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
        // Limpa a notificação ao começar a digitar novamente
        if (notification.message) {
            setNotification({ message: '', type: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setNotification({ message: '', type: '' });

        const dadosDaReserva = { ...formData, mesa_id: mesa.id };

        try {
            await criarReserva(dadosDaReserva);
            setNotification({ message: 'Mesa reservada com sucesso!', type: 'success' });
            
            // Aguarda um momento para o utilizador ver a mensagem e depois fecha/atualiza
            setTimeout(() => {
                onReservaSucesso();
            }, 1500);

        } catch (error) {
            const mensagemErro = error.response?.data?.message || 'Não foi possível fazer a reserva.';
            setNotification({ message: mensagemErro, type: 'error' });
            setIsSubmitting(false); // Reativa o botão em caso de erro
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Reservar Mesa Nº {mesa.id}</h2>
                <p>Capacidade: {mesa.capacidade} pessoas</p>
                
                <form onSubmit={handleSubmit}>
                    {/* ... campos do formulário (membro, finalidade, etc.) ... */}
                    {/* (O código dos inputs permanece o mesmo) */}
                    
                    <div className="form-group">
                        <label htmlFor="membro">O seu Nome:</label>
                        <input type="text" id="membro" name="membro" value={formData.membro} readOnly required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="finalidade">Finalidade:</label>
                        <input type="text" id="finalidade" name="finalidade" value={formData.finalidade} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="data_hora_inicio">Início da Reserva:</label>
                        <input type="datetime-local" id="data_hora_inicio" name="data_hora_inicio" value={formData.data_hora_inicio} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="data_hora_fim">Fim da Reserva:</label>
                        <input type="datetime-local" id="data_hora_fim" name="data_hora_fim" value={formData.data_hora_fim} onChange={handleChange} required />
                    </div>

                    {/* Exibição da mensagem de notificação */}
                    {notification.message && (
                        <div className={`notification ${notification.type}`}>
                            {notification.message}
                        </div>
                    )}

                    <div className="button-container">
                        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-gradient" disabled={isSubmitting}>
                            {isSubmitting ? 'A reservar...' : 'Confirmar Reserva'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ModalReserva;