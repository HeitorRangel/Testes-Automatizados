import { Given, When, Then } from '@cucumber/cucumber';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import CancelamentoForm from '../components/Cancelamento/CancelamentoForm';

type CancelamentoFormType = React.ComponentType<{}>;

Given('que estou na página de cancelamento', () => {
  render(React.createElement(CancelamentoForm as CancelamentoFormType));
});

When('preencho o ID do aluno {string}', (id: string) => {
  const input = screen.getByPlaceholderText('ID do Aluno');
  fireEvent.change(input, { target: { value: id } });
});

When('preencho o motivo {string}', (motivo: string) => {
  const input = screen.getByPlaceholderText('Motivo do Cancelamento');
  fireEvent.change(input, { target: { value: motivo } });
});

When('confirmo o cancelamento', () => {
  const button = screen.getByText('Cancelar Matrícula');
  fireEvent.click(button);
});

Then('devo ver a mensagem de sucesso {string}', async (mensagem: string) => {
  try {
    await waitFor(() => {
      const successMessage = screen.getByText(mensagem);
      expect(successMessage).to.exist;
    }, { timeout: 3000 });
  } catch (error: unknown) { 
    if (error instanceof Error) {
      throw new Error(`Mensagem de sucesso "${mensagem}" não encontrada: ${error.message}`);
    } else {
      throw new Error(`Mensagem de sucesso "${mensagem}" não encontrada`);
    }
  }
});

Then('devo ver a mensagem de erro {string}', async (mensagem: string) => {
  try {
    await waitFor(() => {
      const errorMessage = screen.getByText(mensagem);
      expect(errorMessage).to.exist;
    }, { timeout: 3000 });
  } catch (error: unknown) { 
    if (error instanceof Error) {
      throw new Error(`Mensagem de erro "${mensagem}" não encontrada: ${error.message}`);
    } else {
      throw new Error(`Mensagem de erro "${mensagem}" não encontrada`);
    }
  }
});