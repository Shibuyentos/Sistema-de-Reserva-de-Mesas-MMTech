// frontend/src/pages/HomePage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getTodasAsMesas } from '../services/apiService';
import CardMesa from '../components/CardMesa';
import ModalReserva from '../components/ModalReserva';
import './HomePage.css';

function HomePage() {
  const [mesas, setMesas] = useState([]);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [mesaSelecionada, setMesaSelecionada] = useState(null);

  // Hooks para aceder ao contexto de autenticação e à navegação
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Função para buscar os dados de todas as mesas na API
  const buscarMesas = async () => {
    try {
      const response = await getTodasAsMesas();
      setMesas(response.data.mesas); 
    } catch (error) {
      console.error('Erro ao buscar todas as mesas:', error);
    }
  };

  // O useEffect vai executar a função buscarMesas assim que o componente for montado
  useEffect(() => {
    buscarMesas();
  }, []);

  /**
   * Função chamada quando um card de mesa é clicado.
   * Verifica se o utilizador está logado antes de abrir o modal de reserva.
   */
  const handleAbrirModal = (mesa) => {
    // Apenas mesas com status 'disponivel' podem ser reservadas
    if (mesa.status === 'disponivel') {
      if (user) {
        // Se o utilizador estiver logado, abre o modal
        setMesaSelecionada(mesa);
        setModalVisivel(true);
      } else {
        // Se não estiver logado, exibe um alerta e redireciona para a página de login
        alert('Por favor, faça o login para reservar uma mesa.');
        navigate('/login');
      }
    }
  };

  // Função para fechar o modal de reserva
  const handleFecharModal = () => {
    setModalVisivel(false);
    setMesaSelecionada(null);
  };

  // Função chamada após uma reserva ser bem-sucedida
  const handleReservaSucesso = () => {
    handleFecharModal();
    buscarMesas(); // Atualiza a lista de mesas para refletir o novo status
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

      {/* O ModalReserva só é renderizado se modalVisivel for true */}
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