import { Given, When, Then } from '@cucumber/cucumber';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import CancelamentoForm from '../components/Cancelamento/CancelamentoForm';
import { cancelamentoService } from '../services/api';

Given('que estou na página de cancelamento', () => {
  render(<CancelamentoForm />);
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
  await screen.findByText(mensagem);
});

Then('devo ver a mensagem de erro {string}', async (mensagem: string) => {
  await screen.findByText(mensagem);
});