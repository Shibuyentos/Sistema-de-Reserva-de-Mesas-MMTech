// frontend/src/pages/HomePage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import { getTodasAsMesas } from '../services/apiService';
import CardMesa from '../components/CardMesa';
import ModalReserva from '../components/ModalReserva';
import './HomePage.css';

function HomePage() {
  const [mesas, setMesas] = useState([]);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [mesaSelecionada, setMesaSelecionada] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { showModal } = useModal();

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
      if (user) {
        setMesaSelecionada(mesa);
        setModalVisivel(true);
      } else {
        showModal({
          type: 'info',
          message: 'Por favor, faça o login para reservar uma mesa.',
          onConfirm: () => navigate('/login'),
        });
      }
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
        <h1>Faça a sua reserva na <span className="gradient-text">MMTech</span></h1>
        <p>Escolha uma mesa abaixo e faça a sua reserva de forma rápida e fácil.</p>
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
