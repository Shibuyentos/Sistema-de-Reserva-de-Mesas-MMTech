// frontend/src/components/CardMesa.jsx
import React from 'react';
import './CardMesa.css';
import TooltipReserva from './TooltipReserva'; // Importamos nosso novo componente
import tableIcon from '../assets/table-icon.png';

function CardMesa({ mesa, onReservarClick }) {
  const isOcupada = mesa.status === 'ocupada';

  return (
    // Adicionamos a classe 'ocupada' condicionalmente
    <div 
      className={`card-mesa ${isOcupada ? 'ocupada' : ''}`} 
      onClick={() => onReservarClick(mesa)}
    >
      {/* O tooltip só é renderizado se a mesa estiver ocupada */}
      {isOcupada && <TooltipReserva reserva={mesa.reserva_atual} />}
      
      <div className="card-mesa-icon">
        <img src={tableIcon} alt="Ícone de Mesa" className="table-icon-img" />
      </div>
      <p>Capacidade: {mesa.capacidade} pessoas</p>
      
      <button className="btn btn-gradient" disabled={isOcupada}>
        {isOcupada ? 'Indisponível' : 'Reservar'}
      </button>
    </div>
  );
}

export default CardMesa;