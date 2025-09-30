// frontend/src/pages/AdminPage.jsx
import React, { useState, useEffect } from 'react';
import { getHistoricoDeReservas } from '../services/apiService';

// Estilos para a tabela
const styles = {
    table: {
        width: '100%',
        marginTop: '20px',
        borderCollapse: 'collapse',
    },
    th: {
        border: '1px solid #555',
        padding: '8px',
        backgroundColor: '#333',
        textAlign: 'left',
    },
    td: {
        border: '1px solid #555',
        padding: '8px',
    },
};

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

    // Função para formatar a data para um formato mais legível
    const formatarData = (dataISO) => {
        if (!dataISO) return 'N/A';
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
        return new Date(dataISO).toLocaleDateString('pt-BR', options);
    };

    if (loading) return <p>A carregar o relatório...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h1>Relatório - Histórico de Reservas</h1>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Mesa ID</th>
                        <th style={styles.th}>Membro</th>
                        <th style={styles.th}>Finalidade</th>
                        <th style={styles.th}>Início</th>
                        <th style={styles.th}>Fim</th>
                        <th style={styles.th}>Check-in</th>
                        <th style={styles.th}>Check-out</th>
                    </tr>
                </thead>
                <tbody>
                    {reservas.map(reserva => (
                        <tr key={reserva.reserva_id}>
                            <td style={styles.td}>{reserva.mesa_id}</td>
                            <td style={styles.td}>{reserva.membro}</td>
                            <td style={styles.td}>{reserva.finalidade}</td>
                            <td style={styles.td}>{formatarData(reserva.data_hora_inicio)}</td>
                            <td style={styles.td}>{formatarData(reserva.data_hora_fim)}</td>
                            <td style={styles.td}>{formatarData(reserva.check_in_at)}</td>
                            <td style={styles.td}>{formatarData(reserva.check_out_at)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminPage;