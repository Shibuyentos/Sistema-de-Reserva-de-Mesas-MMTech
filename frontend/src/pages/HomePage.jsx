// frontend/src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { getMesasDisponiveis } from '../services/apiService';
import CardMesa from '../components/CardMesa';
import ModalReserva from '../components/ModalReserva'; 

// Criamos uma classe CSS para o container das mesas
const mesasListStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '1rem',
};

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
  }
  
  return (
    <div>
      <h1>Mesas Disponíveis</h1>
      {/* Aplicamos o estilo diretamente aqui, pois é um estilo de layout simples para esta página */}
      <div style={mesasListStyle}>
        {mesas.map(mesa => (
          <CardMesa 
            key={mesa.id} 
            mesa={mesa} 
            onReservarClick={handleAbrirModal} 
          />
        ))}
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