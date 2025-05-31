import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Contact from '../pages/Contact';

// Mock do console.log
console.log = jest.fn();

// Mock do window.scrollTo
window.scrollTo = jest.fn();

describe('Componente de Contato', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve renderizar o formulário de contato e enviar com sucesso', async () => {
    render(<Contact />);
    
    // Verifica se os elementos principais são renderizados
    expect(screen.getByText('Entre em')).toBeInTheDocument();
    expect(screen.getByText('Contato')).toBeInTheDocument();
    
    // Preenche o formulário
    const nameInput = screen.getByPlaceholderText('Seu nome completo');
    const emailInput = screen.getByPlaceholderText('seu@email.com');
    const subjectInput = screen.getByPlaceholderText('Assunto da mensagem');
    const messageInput = screen.getByPlaceholderText('Escreva sua mensagem aqui...');

    await userEvent.type(nameInput, 'Test User');
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(subjectInput, 'Test Subject');
    await userEvent.type(messageInput, 'This is a test message.');

    // Envia o formulário
    const submitButton = screen.getByRole('button', { name: /enviar mensagem/i });
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

  test('deve validar campos obrigatórios', async () => {
    render(<Contact />);

    // Tenta enviar o formulário sem preencher os campos
    const submitButton = screen.getByRole('button', { name: /enviar mensagem/i });
    fireEvent.click(submitButton);

    // Verifica se o envio do formulário NÃO foi bem-sucedido
    expect(console.log).not.toHaveBeenCalledWith(
      expect.stringContaining('Formulário enviado:'),
      expect.any(Object)
    );
    
    // Verifica se a validação HTML5 foi acionada
    const nameInput = screen.getByPlaceholderText('Seu nome completo');
    expect(nameInput).toBeRequired();
    
    const emailInput = screen.getByPlaceholderText('seu@email.com');
    expect(emailInput).toBeRequired();
    
    const subjectInput = screen.getByPlaceholderText('Assunto da mensagem');
    expect(subjectInput).toBeRequired();
    
    const messageInput = screen.getByPlaceholderText('Escreva sua mensagem aqui...');
    expect(messageInput).toBeRequired();
  });
});
