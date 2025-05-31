import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';

// Mock do axios
jest.mock('axios');

// Mock do react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
  ToastContainer: () => null,
}));

// Mock do localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Integração de Autenticação de Login', () => {
  const mockNavigate = jest.fn();
  const mockSetToken = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('realiza login com sucesso usando credenciais válidas', async () => {
    // Mock da resposta da API
    axios.post.mockResolvedValueOnce({
      data: {
        success: true,
        token: 'fake-token',
        message: 'Login realizado com sucesso'
      }
    });

    // Cria um valor de contexto que atualiza corretamente o estado do token
    let currentToken = '';
    const contextValue = {
      navigate: mockNavigate,
      setToken: (token) => {
        currentToken = token;
        mockSetToken(token);
      },
      token: currentToken,
      backendUrl: 'http://localhost:4000'
    };
    
    // Renderiza o componente
    render(
      <BrowserRouter>
        <ShopContext.Provider value={contextValue}>
          <Login />
        </ShopContext.Provider>
      </BrowserRouter>
    );

    // Preenche o formulário de login
    const emailInput = screen.getByPlaceholderText('E-mail');
    const passwordInput = screen.getByPlaceholderText('Senha');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Envia o formulário
    const loginButton = screen.getByRole('button', { name: /entrar/i });
    fireEvent.click(loginButton);
    
    // Verifica o sucesso
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:4000/api/user/login',
        { email: 'test@example.com', password: 'password123' }
      );
      expect(mockSetToken).toHaveBeenCalledWith('fake-token');
    });

    // Verifica se o localStorage foi chamado
    expect(window.localStorage.setItem).toHaveBeenCalledWith('token', 'fake-token');
  });

  test('exibe mensagem de erro com credenciais inválidas', async () => {
    const { toast } = require('react-toastify');
    
    // Mock da resposta de erro da API
    axios.post.mockRejectedValueOnce({
      message: 'Credenciais inválidas'
    });

    // Renderiza o componente
    render(
      <BrowserRouter>
        <ShopContext.Provider value={{
          navigate: mockNavigate,
          setToken: mockSetToken,
          backendUrl: 'http://localhost:4000'
        }}>
          <Login />
        </ShopContext.Provider>
      </BrowserRouter>
    );

    // Preenche o formulário de login com dados inválidos
    const emailInput = screen.getByPlaceholderText('E-mail');
    const passwordInput = screen.getByPlaceholderText('Senha');
    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    
    // Envia o formulário
    const loginButton = screen.getByRole('button', { name: /entrar/i });
    fireEvent.click(loginButton);
    
    // Verifica o tratamento de erro
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:4000/api/user/login',
        { email: 'wrong@example.com', password: 'wrongpassword' }
      );
      expect(toast.error).toHaveBeenCalledWith('Credenciais inválidas');
      expect(mockSetToken).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
