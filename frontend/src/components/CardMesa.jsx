// frontend/src/components/CardMesa.jsx
import React from 'react';

function CardMesa({ mesa, onReservarClick }) { 
    const cardStyle = {
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        margin: '8px',
        width: '200px',
        textAlign: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0,1)'
    };

    const buttonStyle = {
        marginTop: '12px',
        padding: '8px 16px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    };

    return (
        <div style={cardStyle}>
            <h3>Mesa Nº {mesa.id}</h3> 
            <p>Capacidade: {mesa.capacidade} pessoas</p>

            <button style={buttonStyle} onClick={() => onReservarClick(mesa)}>
                Reservar
            </button>
        </div>
    );
}

export default CardMesa;