import React, { useState, useEffect, useCallback } from 'react';
import { getHistoricoDeReservas, fazerCheckIn, fazerCheckOut } from '../services/apiService';
import FormNovaMesa from '../components/FormNovaMesa';
import { useToast } from '../context/ToastContext';
import './AdminPage.css';

function AdminPage() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToast } = useToast();

  const buscarHistorico = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getHistoricoDeReservas();
      const sortedReservas = response.data.data.sort((a, b) => {
        if (a.check_out_at && !b.check_out_at) return 1;
        if (!a.check_out_at && b.check_out_at) return -1;
        return new Date(b.data_hora_inicio) - new Date(a.data_hora_inicio);
      });
      setReservas(sortedReservas);
    } catch (err) {
      setError('Não foi possível carregar o histórico de reservas.');
      addToast('Erro ao carregar histórico.', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    buscarHistorico();
  }, [buscarHistorico]);

  const handleCheckIn = async (reservaId) => {
    if (!window.confirm('Tem certeza de que deseja fazer o check-in?')) return;
    try {
      await fazerCheckIn(reservaId);
      addToast('Check-in realizado com sucesso!', 'success');
      buscarHistorico();
    } catch (err) {
      addToast(`Erro ao fazer check-in: ${err.response?.data?.message || err.message}`, 'error');
    }
  };

  const handleCheckOut = async (reservaId) => {
    if (!window.confirm('Tem certeza de que deseja fazer o check-out? Esta ação irá liberar a mesa.')) return;
    try {
      await fazerCheckOut(reservaId);
      addToast('Check-out realizado com sucesso!', 'success');
      buscarHistorico();
    } catch (err) {
      addToast(`Erro ao fazer check-out: ${err.response?.data?.message || err.message}`, 'error');
    }
  };

  const formatarData = (dataISO) => {
    if (!dataISO) return '—';
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Date(dataISO).toLocaleDateString('pt-BR', options);
  };

  const handleMesaAdicionada = () => {
      addToast('Mesa adicionada! Tabela atualizada.', 'success');
      // Opcionalmente recarregar mesas se essa página mostrasse mesas, mas aqui mostra histórico.
  };

  return (
    <div className="admin-page-container">
      <FormNovaMesa onMesaAdicionada={handleMesaAdicionada} />

      <h1>Relatório - Histórico de Reservas</h1>

      {loading && <p className="loading-message">Carregando relatório...</p>}
      {error && <p className="error-message">{error}</p>}
      
      {!loading && !error && (
        <table className="report-table">
          <thead>
            <tr>
              <th>Mesa ID</th>
              <th>Membro</th>
              <th>Finalidade</th>
              <th>Início</th>
              <th>Fim</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {reservas.map(reserva => (
              <tr key={reserva.reserva_id} className={reserva.check_out_at ? 'reserva-finalizada' : ''}>
                <td>{reserva.mesa_id}</td>
                <td>{reserva.membro}</td>
                <td>{reserva.finalidade}</td>
                <td>{formatarData(reserva.data_hora_inicio)}</td>
                <td>{formatarData(reserva.data_hora_fim)}</td>
                <td>{formatarData(reserva.check_in_at)}</td>
                <td>{formatarData(reserva.check_out_at)}</td>
                <td className="coluna-acoes">
                  {!reserva.check_in_at && (
                    <button className="btn-acao check-in" onClick={() => handleCheckIn(reserva.reserva_id)}>
                      Check-in
                    </button>
                  )}
                  {reserva.check_in_at && !reserva.check_out_at && (
                    <button className="btn-acao check-out" onClick={() => handleCheckOut(reserva.reserva_id)}>
                      Check-out
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminPage;