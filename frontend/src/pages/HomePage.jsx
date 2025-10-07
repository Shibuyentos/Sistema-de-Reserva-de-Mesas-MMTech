// frontend/src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { getTodasAsMesas } from '../services/apiService';
import CardMesa from '../components/CardMesa';
import ModalReserva from '../components/ModalReserva';
import './HomePage.css';

function HomePage() {
  const [mesas, setMesas] = useState([]);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [mesaSelecionada, setMesaSelecionada] = useState(null);

  const buscarMesas = async () => {
    try {
      const response = await getTodasAsMesas();
      setMesas(response.data.mesas); 
    } catch (error) {
      console.error('Erro ao buscar todas as mesas:', error);
    }
  };

  useEffect(() => {
    buscarMesas();
  }, []);

  const handleAbrirModal = (mesa) => {
    if (mesa.status === 'disponivel') {
      setMesaSelecionada(mesa);
      setModalVisivel(true);
    }
  };

  const handleFecharModal = () => {
    setModalVisivel(false);
    setMesaSelecionada(null);
  };

  const handleReservaSucesso = () => {
    handleFecharModal();
    buscarMesas();
  };

  return (
    <div className="homepage-container">
      <div className="hero-section">
        <h1>Faça sua reserva na <span className="gradient-text">MMTech</span></h1>
        <p>Escolha uma mesa abaixo e faça sua reserva de forma rápida e fácil.</p>
      </div>

      <div className="mesas-list">
        {mesas.length > 0 ? (
          mesas.map((mesa) => (
            <CardMesa
              key={mesa.id}
              mesa={mesa}
              onReservarClick={handleAbrirModal}
            />
          ))
        ) : (
          <p>Nenhuma mesa encontrada.</p>
        )}
      </div>

      {modalVisivel && (
        <ModalReserva
          mesa={mesaSelecionada}
          onClose={handleFecharModal}
          onReservaSucesso={handleReservaSucesso}
        />
      )}
    </div>
  );
}

export default HomePage;