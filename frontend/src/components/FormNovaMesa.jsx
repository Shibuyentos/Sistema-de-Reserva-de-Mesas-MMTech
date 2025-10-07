// frontend/src/components/FormNovaMesa.jsx
import React, { useState } from 'react';
import { registrarNovaMesa } from '../services/apiService';
import './FormNovaMesa.css';

function FormNovaMesa({ onMesaAdicionada }) {
  const [capacidade, setCapacidade] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    const capNum = parseInt(capacidade, 10);
    if (!capNum || capNum <= 0) {
      setErro('Por favor, insira uma capacidade válida (número maior que zero).');
      return;
    }

    try {
      await registrarNovaMesa({ capacidade: capNum });
      setSucesso(`Mesa com capacidade para ${capNum} pessoas foi adicionada!`);
      setCapacidade(''); // Limpa o campo
      onMesaAdicionada(); // Avisa o componente pai para atualizar a lista de mesas
    } catch (error) {
      console.error('Erro ao registrar mesa:', error);
      setErro(error.response?.data?.message || 'Não foi possível registrar a mesa.');
    }
  };

  return (
    <div className="form-nova-mesa-container">
      <h3>Registrar Nova Mesa</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group-inline">
          <label htmlFor="capacidade">Capacidade:</label>
          <input
            type="number"
            id="capacidade"
            value={capacidade}
            onChange={(e) => setCapacidade(e.target.value)}
            placeholder="Ex: 4"
            min="1"
            required
          />
          <button type="submit" className="btn btn-gradient">Adicionar</button>
        </div>
        {erro && <p className="mensagem-erro">{erro}</p>}
        {sucesso && <p className="mensagem-sucesso">{sucesso}</p>}
      </form>
    </div>
  );
}

export default FormNovaMesa;