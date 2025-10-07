// frontend/src/pages/AdminPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { getHistoricoDeReservas, fazerCheckIn, fazerCheckOut } from '../services/apiService';
import FormNovaMesa from '../components/FormNovaMesa'; // Importamos o novo formulário
import './AdminPage.css';

function AdminPage() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Usamos useCallback para evitar recriar a função em cada renderização
  const buscarHistorico = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getHistoricoDeReservas();
      // Ordenamos para que as reservas mais recentes e ativas apareçam primeiro
      const sortedReservas = response.data.data.sort((a, b) => {
        if (a.check_out_at && !b.check_out_at) return 1;
        if (!a.check_out_at && b.check_out_at) return -1;
        return new Date(b.data_hora_inicio) - new Date(a.data_hora_inicio);
      });
      setReservas(sortedReservas);
    } catch (err) {
      setError('Não foi possível carregar o histórico de reservas.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    buscarHistorico();
  }, [buscarHistorico]);

  const handleCheckIn = async (reservaId) => {
    if (!window.confirm('Tem a certeza de que deseja fazer o check-in?')) return;
    try {
      await fazerCheckIn(reservaId);
      alert('Check-in realizado com sucesso!');
      buscarHistorico(); // Atualiza a lista
    } catch (err) {
      alert(`Erro ao fazer check-in: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleCheckOut = async (reservaId) => {
    if (!window.confirm('Tem a certeza de que deseja fazer o check-out? Esta ação irá libertar a mesa.')) return;
    try {
      await fazerCheckOut(reservaId);
      alert('Check-out realizado com sucesso!');
      buscarHistorico(); // Atualiza a lista
    } catch (err) {
      alert(`Erro ao fazer check-out: ${err.response?.data?.message || err.message}`);
    }
  };

  const formatarData = (dataISO) => {
    if (!dataISO) return '—';
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Date(dataISO).toLocaleDateString('pt-BR', options);
  };

  return (
    <div className="admin-page-container">
      {/* Adicionamos o formulário aqui */}
      <FormNovaMesa onMesaAdicionada={() => alert('Mesa adicionada! A página inicial será atualizada.')} />

      <h1>Relatório - Histórico de Reservas</h1>

      {loading && <p className="loading-message">A carregar o relatório...</p>}
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
              <th>Ações</th> {/* Nova coluna para os botões */}
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