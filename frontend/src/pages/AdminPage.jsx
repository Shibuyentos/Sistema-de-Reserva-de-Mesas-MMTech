// frontend/src/pages/AdminPage.jsx
import React, { useState, useEffect } from 'react';
import { getHistoricoDeReservas } from '../services/apiService';
import './AdminPage.css'; // Importamos o novo CSS

function AdminPage() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const buscarHistorico = async () => {
      try {
        const response = await getHistoricoDeReservas();
        setReservas(response.data.data);
      } catch (err) {
        setError('Não foi possível carregar o histórico de reservas.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    buscarHistorico();
  }, []);

  const formatarData = (dataISO) => {
    if (!dataISO) return 'N/A';
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Date(dataISO).toLocaleDateString('pt-BR', options);
  };

  if (loading) return <p className="loading-message">A carregar o relatório...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="admin-page-container">
      <h1>Relatório - Histórico de Reservas</h1>
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
          </tr>
        </thead>
        <tbody>
          {reservas.map(reserva => (
            <tr key={reserva.reserva_id}>
              <td>{reserva.mesa_id}</td>
              <td>{reserva.membro}</td>
              <td>{reserva.finalidade}</td>
              <td>{formatarData(reserva.data_hora_inicio)}</td>
              <td>{formatarData(reserva.data_hora_fim)}</td>
              <td>{formatarData(reserva.check_in_at)}</td>
              <td>{formatarData(reserva.check_out_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPage;