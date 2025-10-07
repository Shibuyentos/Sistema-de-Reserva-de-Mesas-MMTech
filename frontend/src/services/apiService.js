// frontend/src/services/apiService.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', 
});

// Função antiga (pode manter ou remover)
export const getMesasDisponiveis = () => {
  return apiClient.get('/reservas/disponiveis');
};

export const getTodasAsMesas = () => {
  return apiClient.get('/mesas'); 
};

export const criarReserva = (dadosDaReserva) => {
  return apiClient.post('/reservas/reservar', dadosDaReserva);
};

export const getHistoricoDeReservas = () => {
  return apiClient.get('/relatorios/historico-reservas');
};