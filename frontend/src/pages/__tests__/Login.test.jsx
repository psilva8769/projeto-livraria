import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../Login';
import { ShopContext } from '../../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

// Mock react-toastify
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

describe('Login Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });
  test('renders login form by default', () => {
    renderWithContext();
    
    expect(screen.getByRole('heading', { name: 'Entrar' })).toBeInTheDocument();
    expect(screen.getByText('Acesse sua conta e continue lendo')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('E-mail')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Senha')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
  });

  test('switches to sign up form when clicking create account', () => {
    renderWithContext();
    
    const createAccountLink = screen.getByText('Criar conta');
    fireEvent.click(createAccountLink);
    
    expect(screen.getByText('Cadastro')).toBeInTheDocument();
    expect(screen.getByText('Crie sua conta e explore nosso catálogo')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nome')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cadastrar' })).toBeInTheDocument();
  });

  test('switches back to login form when clicking login link', () => {
    renderWithContext();
    
    // Switch to sign up first
    const createAccountLink = screen.getByText('Criar conta');
    fireEvent.click(createAccountLink);
    
    // Then switch back to login
    const loginLink = screen.getByText('Entrar');
    fireEvent.click(loginLink);
    
    expect(screen.getByText('Acesse sua conta e continue lendo')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Nome')).not.toBeInTheDocument();
  });

  test('handles login form submission successfully', async () => {
    const mockResponse = {
      data: {
        success: true,
        token: 'fake-token'
      }
    };
    mockedAxios.post.mockResolvedValue(mockResponse);
    
    renderWithContext();
    
    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText('E-mail'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Senha'), {
      target: { value: 'password123' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
    
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:4000/api/user/login',
        { email: 'test@example.com', password: 'password123' }
      );
      expect(mockSetToken).toHaveBeenCalledWith('fake-token');
    });
  });

  test('handles signup form submission successfully', async () => {
    const mockResponse = {
      data: {
        success: true,
        token: 'fake-token'
      }
    };
    mockedAxios.post.mockResolvedValue(mockResponse);
    
    renderWithContext();
    
    // Switch to sign up
    fireEvent.click(screen.getByText('Criar conta'));
    
    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText('Nome'), {
      target: { value: 'Test User' }
    });
    fireEvent.change(screen.getByPlaceholderText('E-mail'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Senha'), {
      target: { value: 'password123' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar' }));
    
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:4000/api/user/register',
        { name: 'Test User', email: 'test@example.com', password: 'password123' }
      );
      expect(mockSetToken).toHaveBeenCalledWith('fake-token');
    });
  });

  test('handles login error', async () => {
    const mockResponse = {
      data: {
        success: false,
        message: 'Invalid credentials'
      }
    };
    mockedAxios.post.mockResolvedValue(mockResponse);
    
    renderWithContext();
    
    // Fill and submit form
    fireEvent.change(screen.getByPlaceholderText('E-mail'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Senha'), {
      target: { value: 'wrongpassword' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
    });
  });

  test('handles network error', async () => {
    const mockError = new Error('Network error');
    mockedAxios.post.mockRejectedValue(mockError);
    
    renderWithContext();
    
    // Fill and submit form
    fireEvent.change(screen.getByPlaceholderText('E-mail'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Senha'), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Network error');
    });
  });

  test('redirects to home when already logged in', () => {
    const loggedInContext = {
      ...mockContextValue,
      token: 'existing-token'
    };
    
    renderWithContext(loggedInContext);
    
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('renders welcome message and branding', () => {
    renderWithContext();
    
    expect(screen.getByText('Bem-vindo à Bacala')).toBeInTheDocument();
    expect(screen.getByText('Sua biblioteca digital moderna')).toBeInTheDocument();
  });

  test('form inputs update state correctly', () => {
    renderWithContext();
    
    const emailInput = screen.getByPlaceholderText('E-mail');
    const passwordInput = screen.getByPlaceholderText('Senha');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('forgot password link is rendered', () => {
    renderWithContext();
    
    expect(screen.getByText('Esqueceu sua senha?')).toBeInTheDocument();
  });
});
