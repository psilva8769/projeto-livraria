import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, defaultContextValue } from '../utils/testUtils';
import Contact from '../pages/Contact';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

// Mock do window.scrollTo para evitar erros
window.scrollTo = jest.fn();

// Mock do console.log para testar envio de formulário
console.log = jest.fn();

describe('Integração do Formulário de Contato', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve navegar para a página de contato e enviar o formulário com sucesso', async () => {
    const mockNavigate = jest.fn();
    const mockContextValue = {
      ...defaultContextValue,
      navigate: mockNavigate
    };

    renderWithProviders(
      <App />,
      { 
        contextValue: mockContextValue,
        initialEntries: ['/contact']
      }
    );

    // Preenche o formulário
    const nameInput = await screen.findByPlaceholderText('Seu nome completo');
    const emailInput = await screen.findByPlaceholderText('seu@email.com');
    const subjectInput = await screen.findByPlaceholderText('Assunto da mensagem');
    const messageInput = await screen.findByPlaceholderText('Escreva sua mensagem aqui...');

    await userEvent.type(nameInput, 'Test User');
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(subjectInput, 'Test Subject');
    await userEvent.type(messageInput, 'This is a test message.');

    // Envia o formulário
    const submitButton = await screen.findByRole('button', { name: /enviar mensagem/i });
    fireEvent.click(submitButton);

    // Verifica se o envio do formulário foi bem-sucedido (console.log foi chamado com os dados do formulário)
    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith('Formulário enviado:', {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'This is a test message.'
      });
    });

    // Verifica se o formulário foi limpo após o envio
    await waitFor(() => {
      expect(nameInput).toHaveValue('');
      expect(emailInput).toHaveValue('');
      expect(subjectInput).toHaveValue('');
      expect(messageInput).toHaveValue('');
    });
  });

  test('deve validar campos obrigatórios no formulário de contato', async () => {
    renderWithProviders(<App />, {
      initialEntries: ['/contact']
    });

    // Tenta enviar o formulário sem preencher os campos
    const submitButton = await screen.findByRole('button', { name: /enviar mensagem/i });
    fireEvent.click(submitButton);

    // Verifica se o envio do formulário NÃO foi bem-sucedido
    expect(console.log).not.toHaveBeenCalledWith(
      expect.stringContaining('Formulário enviado:'),
      expect.any(Object)
    );
    
    // Verifica se a validação HTML5 foi acionada
    // Nota: Este teste ajuda a garantir que os campos do formulário possuem o atributo required
    const nameInput = await screen.findByPlaceholderText('Seu nome completo');
    expect(nameInput).toBeRequired();
    
    const emailInput = await screen.findByPlaceholderText('seu@email.com');
    expect(emailInput).toBeRequired();
    
    const subjectInput = await screen.findByPlaceholderText('Assunto da mensagem');
    expect(subjectInput).toBeRequired();
    
    const messageInput = await screen.findByPlaceholderText('Escreva sua mensagem aqui...');
    expect(messageInput).toBeRequired();
  });
});
