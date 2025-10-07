// frontend/src/pages/MyReservationsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { getMinhasReservas, fazerCheckIn, fazerCheckOut } from '../services/apiService';
import { LogIn, LogOut, Calendar, Users, Target } from 'react-feather';
import './MyReservationsPage.css';

function MyReservationsPage() {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const buscarMinhasReservas = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getMinhasReservas();
            setReservas(response.data.reservas);
        } catch (err) {
            setError('Não foi possível carregar as suas reservas.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        buscarMinhasReservas();
    }, [buscarMinhasReservas]);
    
    const handleCheckIn = async (reservaId) => {
        // ... (lógica idêntica à do AdminPage)
    };

    const handleCheckOut = async (reservaId) => {
        // ... (lógica idêntica à do AdminPage)
    };

    const formatarData = (dataISO) => {
        if (!dataISO) return '—';
        return new Date(dataISO).toLocaleString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    if (loading) return <p>A carregar as suas reservas...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="my-reservations-container">
            <h1 className="gradient-text">Minhas Reservas</h1>
            <p>Faça a gestão das suas reservas ativas e passadas.</p>

            <div className="reservations-grid">
                {reservas.length > 0 ? (
                    reservas.map(reserva => (
                        <div key={reserva.reserva_id} className={`reservation-card ${reserva.check_out_at ? 'finalizada' : ''}`}>
                            <div className="card-header">
                                <h3>Mesa Nº {reserva.mesa_id}</h3>
                                <span className={`status-tag ${!reserva.check_in_at ? 'aguardando' : (reserva.check_out_at ? 'finalizada' : 'em-uso')}`}>
                                    {!reserva.check_in_at ? 'Aguardando' : (reserva.check_out_at ? 'Finalizada' : 'Em Uso')}
                                </span>
                            </div>
                            <div className="card-body">
                                <p><Target size={16} /> <strong>Finalidade:</strong> {reserva.finalidade}</p>
                                <p><Calendar size={16} /> <strong>Início:</strong> {formatarData(reserva.data_hora_inicio)}</p>
                                <p><Calendar size={16} /> <strong>Fim:</strong> {formatarData(reserva.data_hora_fim)}</p>
                            </div>
                            <div className="card-footer">
                                {!reserva.check_in_at && !reserva.check_out_at && (
                                    <button className="btn-card-action check-in" onClick={() => handleCheckIn(reserva.reserva_id)}>
                                        <LogIn size={18} /> Fazer Check-in
                                    </button>
                                )}
                                {reserva.check_in_at && !reserva.check_out_at && (
                                    <button className="btn-card-action check-out" onClick={() => handleCheckOut(reserva.reserva_id)}>
                                        <LogOut size={18} /> Fazer Check-out
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Você ainda não fez nenhuma reserva.</p>
                )}
            </div>
        </div>
    );
}

export default MyReservationsPage;