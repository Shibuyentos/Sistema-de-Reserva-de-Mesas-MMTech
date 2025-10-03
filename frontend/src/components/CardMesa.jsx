// frontend/src/components/CardMesa.jsx
import React from 'react';
import './CardMesa.css'; // Importamos a nossa nova folha de estilos

function CardMesa({ mesa, onReservarClick }) { 
  // Removemos todos os objetos de estilo 'inline'
  return (
    // Usamos 'className' para aplicar os estilos do CardMesa.css
    <div className="card-mesa">
      <h3>Mesa Nº {mesa.id}</h3> 
      <p>Capacidade: {mesa.capacidade} pessoas</p>
      
      <button onClick={() => onReservarClick(mesa)}>
        Reservar
      </button>
    </div>
  );
}

export default CardMesa;