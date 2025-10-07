// frontend/src/components/ModalReserva.jsx
import React, { useState } from 'react';
import { criarReserva } from '../services/apiService';
import './ModalReserva.css';

function ModalReserva({ mesa, onClose, onReservaSucesso }) {
  const [formData, setFormData] = useState({
    finalidade: '',
    membro: '',
    data_hora_inicio: '',
    data_hora_fim: '',
  });

  if (!mesa) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dadosDaReserva = {
      ...formData,
      mesa_id: mesa.id,
    };

    try {
      await criarReserva(dadosDaReserva);
      alert('Mesa reservada com sucesso!');
      onReservaSucesso();
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      const mensagemErro = error.response?.data?.message || 'Não foi possível fazer a reserva.';
      alert(`Erro: ${mensagemErro}`);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Reservar Mesa Nº {mesa.id}</h2>
        <p>Capacidade: {mesa.capacidade} pessoas</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="membro">O seu Nome:</label>
            <input type="text" id="membro" name="membro" value={formData.membro} onChange={handleChange} required />
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
          <div className="button-container">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-gradient">Confirmar Reserva</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalReserva;