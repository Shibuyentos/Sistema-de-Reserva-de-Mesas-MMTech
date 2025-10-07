// frontend/src/components/CardMesa.jsx
import React from 'react';
import './CardMesa.css';
import tableIcon from '../assets/table-icon.png'; // Verifique se o nome do arquivo corresponde ao que você salvou

function CardMesa({ mesa, onReservarClick }) {
  return (
    <div className="card-mesa" onClick={() => onReservarClick(mesa)}>
      <div className="card-mesa-icon">
       <img src={tableIcon} alt="Ícone de Mesa" className="table-icon-img" />
      </div>
      <p>Capacidade: {mesa.capacidade} pessoas</p>
      
      <button className="btn btn-gradient">
        Reservar
      </button>
    </div>
  );
}

export default CardMesa;