// frontend/src/services/apiService.js
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', 
});

export const loginUser = (credentials) => {
    return apiClient.post('/auth/login', credentials);
};

export const registerUser = (userData) => {
    return apiClient.post('/auth/registrar', userData);
};

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
export const registrarNovaMesa = (dadosMesa) => {
  return apiClient.post('/mesas', dadosMesa);
};

export const fazerCheckIn = (reservaId) => {
  return apiClient.post(`/reservas/check_in/${reservaId}`);
};

export const fazerCheckOut = (reservaId) => {
  return apiClient.post(`/reservas/check_out/${reservaId}`);
};

export const getMinhasReservas = () => {
    return apiClient.get('/reservas/minhas-reservas');
};