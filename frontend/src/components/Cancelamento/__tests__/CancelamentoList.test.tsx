import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CancelamentoList from '../CancelamentoList';
import { cancelamentoService } from '../../../services/api';

jest.mock('../../../services/api', () => ({
  cancelamentoService: {
    getCancelamentos: jest.fn()
  }
}));

const mockCancelamentos = [
  {
    id: '1',
    alunoId: '123e4567-e89b-12d3-a456-426614174000',
    dataCancelamento: '2024-05-01T00:00:00.000Z',
  },
];

describe('CancelamentoList', () => {
  it('renderiza os cancelamentos retornados pela API', async () => {
    (cancelamentoService.getCancelamentos as jest.Mock).mockResolvedValue(mockCancelamentos);

    render(<CancelamentoList />);

    await waitFor(() => {
      expect(screen.getByText(/Aluno ID:/)).toBeInTheDocument();
      expect(screen.getByText(/123e4567-e89b-12d3-a456-426614174000/)).toBeInTheDocument();
      expect(screen.getByText(/Cancelamentos/)).toBeInTheDocument();
    });
  });

  it('exibe erro no console caso ocorra um problema', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (cancelamentoService.getCancelamentos as jest.Mock).mockRejectedValue(new Error('Erro de rede'));

    render(<CancelamentoList />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });
});
