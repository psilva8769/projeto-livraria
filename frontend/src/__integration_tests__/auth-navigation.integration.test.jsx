import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import App from '../App';
import Header from '../components/Header';
import Login from '../pages/Login';
import { renderWithProviders, defaultContextValue, mockUser } from '../utils/testUtils';
import axios from 'axios';

jest.mock('axios');
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
  ToastContainer: () => null
}));

describe('Integração de Autenticação e Navegação', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });  test('deve mostrar botão de login quando não autenticado', () => {
    const mockContextValue = {
      ...defaultContextValue,
      token: null,
    };

    renderWithProviders(
      <Header />,
      { contextValue: mockContextValue }
    );

    // Deve mostrar o botão "Entrar" quando não logado
    const loginButton = screen.getByRole('button', { name: /entrar/i });
    expect(loginButton).toBeInTheDocument();
  });

  test('deve mostrar ícone de usuário quando autenticado', () => {
    const mockContextValue = {
      ...defaultContextValue,
      token: 'test-token',
      userData: mockUser,
    };

    renderWithProviders(
      <Header />,
      { contextValue: mockContextValue }
    );

    // Deve mostrar o ícone de usuário quando logado (usando seletor de classe já que não é um elemento semântico)
    const userIcon = document.querySelector('.text-\\[32px\\]');
    expect(userIcon).toBeInTheDocument();
    
    // Não deve mostrar o botão "Entrar" quando logado
    const loginButton = screen.queryByRole('button', { name: /entrar/i });
    expect(loginButton).not.toBeInTheDocument();
  });  test('deve realizar login com sucesso com credenciais válidas', async () => {
    const mockNavigate = jest.fn();
    const mockSetToken = jest.fn();
    const mockToken = 'test-token';
    
    axios.post.mockResolvedValueOnce({ 
      data: { 
        token: mockToken,
        success: true
      } 
    });

    const mockContextValue = {
      ...defaultContextValue,
      token: null,
      setToken: mockSetToken,
      navigate: mockNavigate,
    };

    renderWithProviders(
      <Login />,
      { contextValue: mockContextValue }
    );

    // Preenche o formulário de login
    const emailInput = screen.getByPlaceholderText(/e-mail/i);
    const passwordInput = screen.getByPlaceholderText(/senha/i);
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');

    // Envia o formulário
    const submitButton = screen.getByRole('button', { name: /entrar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/user/login'),
        { email: 'test@example.com', password: 'password123' }
      );
      expect(mockSetToken).toHaveBeenCalledWith(mockToken);
    });
  });
});
