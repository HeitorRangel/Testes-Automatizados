import React from 'react';
import CancelamentoForm from '../components/Cancelamento/CancelamentoForm';
import CancelamentoList from '../components/Cancelamento/CancelamentoList';

const Cancelamento: React.FC = () => {
  return (
    <div>
      <h1>Cancelamento de Matrícula</h1>
      <CancelamentoForm />
      <CancelamentoList />
    </div>
  );
};

export default Cancelamento;