// frontend/src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { getMesasDisponiveis } from '../services/apiService';
import CardMesa from '../components/CardMesa';
import ModalReserva from '../components/ModalReserva';
import './HomePage.css';

function HomePage() {
  const [mesas, setMesas] = useState([]);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [mesaSelecionada, setMesaSelecionada] = useState(null);

  const buscarMesas = async () => {
    try {
      const response = await getMesasDisponiveis();
      setMesas(response.data.mesas_disponiveis);
    } catch (error) {
      console.error('Erro ao buscar mesas disponíveis:', error);
    }
  };

  useEffect(() => {
    buscarMesas();
  }, []);

  const handleAbrirModal = (mesa) => {
    setMesaSelecionada(mesa);
    setModalVisivel(true);
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
          mesas.map((mesa, index) => (
            <CardMesa
              key={mesa.id}
              mesa={mesa}
              onReservarClick={handleAbrirModal}
              style={{ animationDelay: `${index * 100}ms` }}
            />
          ))
        ) : (
          <p>Nenhuma mesa disponível no momento.</p>
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