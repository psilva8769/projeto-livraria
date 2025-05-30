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

describe('Auth-Navigation Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });  test('should show login button when not authenticated', () => {
    const mockContextValue = {
      ...defaultContextValue,
      token: null,
    };

    renderWithProviders(
      <Header />,
      { contextValue: mockContextValue }
    );

    // Should show "Entrar" button when not logged in
    const loginButton = screen.getByRole('button', { name: /entrar/i });
    expect(loginButton).toBeInTheDocument();
  });

  test('should show user icon when authenticated', () => {
    const mockContextValue = {
      ...defaultContextValue,
      token: 'test-token',
      userData: mockUser,
    };

    renderWithProviders(
      <Header />,
      { contextValue: mockContextValue }
    );

    // Should show user icon when logged in (using class selector since it's not a semantic element)
    const userIcon = document.querySelector('.text-\\[32px\\]');
    expect(userIcon).toBeInTheDocument();
    
    // Should not show "Entrar" button when logged in
    const loginButton = screen.queryByRole('button', { name: /entrar/i });
    expect(loginButton).not.toBeInTheDocument();
  });  test('should login successfully with valid credentials', async () => {
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

    // Fill login form
    const emailInput = screen.getByPlaceholderText(/e-mail/i);
    const passwordInput = screen.getByPlaceholderText(/senha/i);
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');

    // Submit form
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
