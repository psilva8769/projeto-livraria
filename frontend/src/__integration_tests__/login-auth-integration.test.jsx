import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';

// Mock axios
jest.mock('axios');

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
  ToastContainer: () => null,
}));

// Mock localStorage
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

describe('Login Authentication Integration', () => {
  const mockNavigate = jest.fn();
  const mockSetToken = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
    test('logs in successfully with valid credentials', async () => {
    // Mock API response
    axios.post.mockResolvedValueOnce({
      data: {
        success: true,
        token: 'fake-token',
        message: 'Login successful'
      }
    });

    // Create a context value that properly updates token state
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
    
    // Render component
    render(
      <BrowserRouter>
        <ShopContext.Provider value={contextValue}>
          <Login />
        </ShopContext.Provider>
      </BrowserRouter>
    );
      // Fill login form
    const emailInput = screen.getByPlaceholderText('E-mail');
    const passwordInput = screen.getByPlaceholderText('Senha');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Submit form
    const loginButton = screen.getByRole('button', { name: /entrar/i });
    fireEvent.click(loginButton);
    
    // Verify success
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:4000/api/user/login',
        { email: 'test@example.com', password: 'password123' }
      );
      expect(mockSetToken).toHaveBeenCalledWith('fake-token');
    });

    // Verify localStorage was called
    expect(window.localStorage.setItem).toHaveBeenCalledWith('token', 'fake-token');
  });
    test('shows error message with invalid credentials', async () => {
    const { toast } = require('react-toastify');
    
    // Mock API error response
    axios.post.mockRejectedValueOnce({
      message: 'Invalid credentials'
    });

    // Render component
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
      // Fill login form with invalid data
    const emailInput = screen.getByPlaceholderText('E-mail');
    const passwordInput = screen.getByPlaceholderText('Senha');
    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    
    // Submit form
    const loginButton = screen.getByRole('button', { name: /entrar/i });
    fireEvent.click(loginButton);
    
    // Verify error handling
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:4000/api/user/login',
        { email: 'wrong@example.com', password: 'wrongpassword' }
      );
      expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
      expect(mockSetToken).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
