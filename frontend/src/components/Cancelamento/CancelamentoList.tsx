import React, { useState, useEffect } from 'react';
import { Cancelamento } from '../../types/Cancelamento';
import { cancelamentoService } from '../../services/api';

const CancelamentoList: React.FC = () => {
  const [cancelamentos, setCancelamentos] = useState<Cancelamento[]>([]);

  useEffect(() => {
    const fetchCancelamentos = async () => {
      try {
        const data = await cancelamentoService.getCancelamentos();
        setCancelamentos(data);
      } catch (error) {
        console.error('Erro ao buscar cancelamentos', error);
      }
    };

    fetchCancelamentos();
  }, []);

  return (
    <div>
      <h2>Cancelamentos</h2>
      {cancelamentos.map((cancelamento) => (
        <div key={cancelamento.id}>
          <p>Aluno ID: {cancelamento.alunoId}</p>
          <p>Data: {new Date(cancelamento.dataCancelamento).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

export default CancelamentoList;