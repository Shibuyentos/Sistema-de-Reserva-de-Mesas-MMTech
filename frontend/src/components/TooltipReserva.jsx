// frontend/src/components/TooltipReserva.jsx
import React from 'react';
import './TooltipReserva.css';

const formatarData = (dataISO) => {
  if (!dataISO) return 'N/A';
  const options = { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' };
  return new Date(dataISO).toLocaleTimeString('pt-BR', options);
};

function TooltipReserva({ reserva }) {
  if (!reserva) return null;

  return (
    <div className="tooltip-container">
      <div className="tooltip-content">
        <h4>Mesa Ocupada</h4>
        <p><strong>Reservado por:</strong> {reserva.membro}</p>
        <p><strong>Finalidade:</strong> {reserva.finalidade}</p>
        <p><strong>Até:</strong> {formatarData(reserva.data_hora_fim)}</p>
      </div>
    </div>
  );
}

export default TooltipReserva;