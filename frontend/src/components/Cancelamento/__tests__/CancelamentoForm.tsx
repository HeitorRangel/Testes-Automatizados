import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CancelamentoForm from '../CancelamentoForm';
import { cancelamentoService } from '../../../services/api';
import { ErrorProvider } from '../../../contexts/ErrorContext';

// Mock do serviço de cancelamento
jest.mock('../../../services/api', () => ({
  cancelamentoService: {
    cancelarMatricula: jest.fn()
  }
}));

describe('CancelamentoForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza o formulário corretamente', () => {
    render(
      <ErrorProvider>
        <CancelamentoForm />
      </ErrorProvider>
    );
    
    expect(screen.getByPlaceholderText('ID do Aluno')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Motivo do Cancelamento')).toBeInTheDocument();
    expect(screen.getByText('Cancelar Matrícula')).toBeInTheDocument();
  });

  it('valida o campo de ID do aluno', async () => {
    render(
      <ErrorProvider>
        <CancelamentoForm />
      </ErrorProvider>
    );
    
    const input = screen.getByPlaceholderText('ID do Aluno');
    const submitButton = screen.getByText('Cancelar Matrícula');
    
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('ID do aluno é obrigatório')).toBeInTheDocument();
    });
  });

  it('valida o campo de motivo', async () => {
    render(
      <ErrorProvider>
        <CancelamentoForm />
      </ErrorProvider>
    );
    
    const input = screen.getByPlaceholderText('ID do Aluno');
    const motivoInput = screen.getByPlaceholderText('Motivo do Cancelamento');
    const submitButton = screen.getByText('Cancelar Matrícula');
    
    fireEvent.change(input, { target: { value: '123e4567-e89b-12d3-a456-426614174000' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Motivo do cancelamento é obrigatório')).toBeInTheDocument();
    });
  });

  it('chama o serviço de cancelamento com dados válidos', async () => {
    const mockCancelarMatricula = jest.spyOn(cancelamentoService, 'cancelarMatricula');
    mockCancelarMatricula.mockResolvedValue(undefined);

    render(
      <ErrorProvider>
        <CancelamentoForm />
      </ErrorProvider>
    );
    
    const input = screen.getByPlaceholderText('ID do Aluno');
    const motivoInput = screen.getByPlaceholderText('Motivo do Cancelamento');
    const submitButton = screen.getByText('Cancelar Matrícula');
    
    fireEvent.change(input, { target: { value: '123e4567-e89b-12d3-a456-426614174000' } });
    fireEvent.change(motivoInput, { target: { value: 'Motivo de cancelamento detalhado' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockCancelarMatricula).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
    });
  });
});