// frontend/src/components/ModalReserva.jsx
import React, { useState } from 'react';
import { criarReserva } from '../services/apiService';

// Estilos CSS para o modal. Adicionados aqui para simplicidade.
const modalStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        backgroundColor: '#333', // Fundo escuro para combinar com o tema
        padding: '20px',
        borderRadius: '8px',
        width: '400px',
        color: 'white',
    },
    formGroup: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
    },
    input: {
        width: '95%',
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #555',
        backgroundColor: '#444',
        color: 'white',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
        marginTop: '20px',
    },
};

function ModalReserva({ mesa, onClose, onReservaSucesso }) {
    // Estado para guardar os dados do formulário
    const [formData, setFormData] = useState({
        finalidade: '',
        membro: '',
        data_hora_inicio: '',
        data_hora_fim: '',
    });

    // Se não houver mesa selecionada, o modal não é renderizado.
    if (!mesa) {
        return null;
    }

    // Função para atualizar o estado quando o utilizador digita nos campos.
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Função chamada quando o formulário é submetido.
    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita que a página recarregue

        // Prepara os dados para enviar para a API.
        const dadosDaReserva = {
            ...formData,
            mesa_id: mesa.id,
        };

        try {
            // Chama a função da API.
            await criarReserva(dadosDaReserva);
            alert('Mesa reservada com sucesso!');
            onReservaSucesso(); // Avisa o componente pai que a reserva foi um sucesso.
        } catch (error) {
            console.error('Erro ao criar reserva:', error);
            // Pega a mensagem de erro da API, se existir.
            const mensagemErro = error.response?.data?.message || 'Não foi possível fazer a reserva.';
            alert(`Erro: ${mensagemErro}`);
        }
    };

    return (
        <div style={modalStyles.overlay} onClick={onClose}>
            <div style={modalStyles.content} onClick={(e) => e.stopPropagation()}>
                <h2>Reservar Mesa Nº {mesa.id}</h2>
                <p>Capacidade: {mesa.capacidade} pessoas</p>
                
                <form onSubmit={handleSubmit}>
                    <div style={modalStyles.formGroup}>
                        <label style={modalStyles.label} htmlFor="membro">O seu Nome:</label>
                        <input
                            style={modalStyles.input}
                            type="text"
                            id="membro"
                            name="membro"
                            value={formData.membro}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div style={modalStyles.formGroup}>
                        <label style={modalStyles.label} htmlFor="finalidade">Finalidade:</label>
                        <input
                            style={modalStyles.input}
                            type="text"
                            id="finalidade"
                            name="finalidade"
                            value={formData.finalidade}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div style={modalStyles.formGroup}>
                        <label style={modalStyles.label} htmlFor="data_hora_inicio">Início da Reserva:</label>
                        <input
                            style={modalStyles.input}
                            type="datetime-local"
                            id="data_hora_inicio"
                            name="data_hora_inicio"
                            value={formData.data_hora_inicio}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div style={modalStyles.formGroup}>
                        <label style={modalStyles.label} htmlFor="data_hora_fim">Fim da Reserva:</label>
                        <input
                            style={modalStyles.input}
                            type="datetime-local"
                            id="data_hora_fim"
                            name="data_hora_fim"
                            value={formData.data_hora_fim}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div style={modalStyles.buttonContainer}>
                        <button type="button" onClick={onClose}>Cancelar</button>
                        <button type="submit">Confirmar Reserva</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ModalReserva;