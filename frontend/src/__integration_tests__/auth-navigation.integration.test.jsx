import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import App from '../App';
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
  });
  test('should login and redirect to home page', async () => {
    const mockNavigate = jest.fn();
    const mockSetToken = jest.fn();
    const mockToken = 'test-token';
    
    axios.post.mockResolvedValueOnce({ 
      data: { 
        token: mockToken,
        user: mockUser
      } 
    });

    const mockContextValue = {
      ...defaultContextValue,
      token: null,
      setToken: mockSetToken,
      navigate: mockNavigate,
    };

    renderWithProviders(
      <App />,
      { contextValue: mockContextValue }
    );

    // Navigate to login page
    const loginLink = screen.getByRole('link', { name: /login/i });
    fireEvent.click(loginLink);

    // Fill login form
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/senha/i);
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /entrar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSetToken).toHaveBeenCalledWith(mockToken);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
  test('should restrict access to orders page when not logged in', async () => {
    const mockNavigate = jest.fn();
    
    const mockContextValue = {
      ...defaultContextValue,
      token: null,
      navigate: mockNavigate,
      userData: null,
    };

    renderWithProviders(
      <App />,
      { contextValue: mockContextValue }
    );

    // Try to navigate to orders page
    const ordersLink = screen.getByRole('link', { name: /orders/i });
    fireEvent.click(ordersLink);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
