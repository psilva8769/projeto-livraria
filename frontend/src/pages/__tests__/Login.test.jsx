import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../Login';
import { ShopContext } from '../../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

// Mock do axios
jest.mock('axios');
const mockedAxios = axios;

// Mock do react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn()
  }
}));

const mockNavigate = jest.fn();
const mockSetToken = jest.fn();

const mockContextValue = {
  token: null,
  setToken: mockSetToken,
  navigate: mockNavigate,
  backendUrl: 'http://localhost:4000'
};

const renderWithContext = (contextValue = mockContextValue) => {
  return render(
    <ShopContext.Provider value={contextValue}>
      <Login />
    </ShopContext.Provider>
  );
};

describe('Página de Login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });
  test('renderiza o formulário de login por padrão', () => {
    renderWithContext();
    
    expect(screen.getByRole('heading', { name: 'Entrar' })).toBeInTheDocument();
    expect(screen.getByText('Acesse sua conta e continue lendo')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('E-mail')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Senha')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
  });

  test('alterna para o formulário de cadastro ao clicar em criar conta', () => {
    renderWithContext();
    
    const createAccountLink = screen.getByText('Criar conta');
    fireEvent.click(createAccountLink);
    
    expect(screen.getByText('Cadastro')).toBeInTheDocument();
    expect(screen.getByText('Crie sua conta e explore nosso catálogo')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nome')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cadastrar' })).toBeInTheDocument();
  });

  test('volta para o formulário de login ao clicar no link de login', () => {
    renderWithContext();
    
    // Alterna para o cadastro primeiro
    const createAccountLink = screen.getByText('Criar conta');
    fireEvent.click(createAccountLink);
    
    // Depois volta para o login
    const loginLink = screen.getByText('Entrar');
    fireEvent.click(loginLink);
    
    expect(screen.getByText('Acesse sua conta e continue lendo')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Nome')).not.toBeInTheDocument();
  });

  test('processa o envio do formulário de login com sucesso', async () => {
    const mockResponse = {
      data: {
        success: true,
        token: 'fake-token'
      }
    };
    mockedAxios.post.mockResolvedValue(mockResponse);
    
    renderWithContext();
    
    // Preenche o formulário
    fireEvent.change(screen.getByPlaceholderText('E-mail'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Senha'), {
      target: { value: 'password123' }
    });
    
    // Envia o formulário
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
    
    // Ensure mockNavigate is called correctly
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    // Validate mockSetToken behavior
    await waitFor(() => {
      expect(mockSetToken).toHaveBeenCalledWith('fake-token');
    });
  });

  test('processa o envio do formulário de cadastro com sucesso', async () => {
    const mockResponse = {
      data: {
        success: true,
        token: 'fake-token'
      }
    };
    mockedAxios.post.mockResolvedValue(mockResponse);
    
    renderWithContext();
    
    // Alterna para o cadastro
    fireEvent.click(screen.getByText('Criar conta'));
    
    // Preenche o formulário
    fireEvent.change(screen.getByPlaceholderText('Nome'), {
      target: { value: 'Test User' }
    });
    fireEvent.change(screen.getByPlaceholderText('E-mail'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Senha'), {
      target: { value: 'password123' }
    });
    
    // Envia o formulário
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar' }));
    
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:4000/api/user/register',
        { name: 'Test User', email: 'test@example.com', password: 'password123' }
      );
      expect(mockSetToken).toHaveBeenCalledWith('fake-token');
    });
  });

  test('exibe mensagem de erro para credenciais inválidas', async () => {
    mockedAxios.post.mockRejectedValueOnce({ response: { data: { message: 'Credenciais inválidas' } } });
    renderWithContext();

    fireEvent.change(screen.getByPlaceholderText('E-mail'), { target: { value: 'email@invalido.com' } });
    fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: 'senhaerrada' } });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Credenciais inválidas');
    });
  });

  test('redireciona para a página inicial após login bem-sucedido', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { token: 'mockToken' } });
    renderWithContext();

    fireEvent.change(screen.getByPlaceholderText('E-mail'), { target: { value: 'email@valido.com' } });
    fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: 'senha123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    // Ensure mockNavigate is called correctly
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    // Validate mockSetToken behavior
    await waitFor(() => {
      expect(mockSetToken).toHaveBeenCalledWith('fake-token');
    });
  });

  test('lida com erro de rede', async () => {
    const mockError = new Error('Erro de rede');
    mockedAxios.post.mockRejectedValue(mockError);
    
    renderWithContext();
    
    // Preenche e envia o formulário
    fireEvent.change(screen.getByPlaceholderText('E-mail'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Senha'), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Erro de rede');
    });
  });

  test('redireciona para a página inicial quando já está logado', () => {
    const loggedInContext = {
      ...mockContextValue,
      token: 'existing-token'
    };
    
    renderWithContext(loggedInContext);
    
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('renderiza mensagem de boas-vindas e branding', () => {
    renderWithContext();
    
    expect(screen.getByText('Bem-vindo à Look the Book')).toBeInTheDocument();
    expect(screen.getByText('Sua biblioteca digital moderna')).toBeInTheDocument();
  });

  test('inputs do formulário atualizam o estado corretamente', () => {
    renderWithContext();
    
    const emailInput = screen.getByPlaceholderText('E-mail');
    const passwordInput = screen.getByPlaceholderText('Senha');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('link de esqueci minha senha é renderizado', () => {
    renderWithContext();
    
    expect(screen.getByText('Esqueceu sua senha?')).toBeInTheDocument();
  });
});
