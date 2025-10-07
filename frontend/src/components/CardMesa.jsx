// frontend/src/components/CardMesa.jsx
import React from 'react';
import './CardMesa.css';
import TooltipReserva from './TooltipReserva';
import tableIcon from '../assets/table-icon.png';

function CardMesa({ mesa, onReservarClick }) {
    const isOcupada = mesa.status === 'ocupada';

    // A função de clique agora está mais inteligente.
    // O div inteiro só é "clicável" se a mesa não estiver ocupada.
    const handleCardClick = () => {
        if (!isOcupada) {
            onReservarClick(mesa);
        }
    };

    // O clique no botão é tratado separadamente para parar a propagação,
    // evitando que o handleCardClick seja chamado duas vezes.
    const handleButtonClick = (e) => {
        e.stopPropagation();
        onReservarClick(mesa);
    };

    return (
        <div 
            className={`card-mesa ${isOcupada ? 'ocupada' : ''}`} 
            onClick={handleCardClick}
            // Adicionamos atributos para acessibilidade
            role="button"
            tabIndex={isOcupada ? -1 : 0}
            onKeyPress={(e) => e.key === 'Enter' && handleCardClick()}
        >
            {isOcupada && <TooltipReserva reserva={mesa.reserva_atual} />}
            
            <div className="card-mesa-icon">
                <img src={tableIcon} alt="Ícone de Mesa" className="table-icon-img" />
            </div>
            <p>Capacidade: {mesa.capacidade} pessoas</p>
            
            <button 
                className="btn btn-gradient" 
                disabled={isOcupada}
                onClick={isOcupada ? undefined : handleButtonClick}
            >
                {isOcupada ? 'Indisponível' : 'Reservar'}
            </button>
        </div>
    );
}

export default CardMesa;