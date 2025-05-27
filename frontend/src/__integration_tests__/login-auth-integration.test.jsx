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
    
    // Fill login form
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/senha/i);
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
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
  
  test('shows error message with invalid credentials', async () => {
    // Mock API error response
    axios.post.mockRejectedValueOnce({
      response: {
        data: {
          success: false,
          message: 'Invalid credentials'
        }
      }
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
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/senha/i);
    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    
    // Submit form
    const loginButton = screen.getByRole('button', { name: /entrar/i });
    fireEvent.click(loginButton);
    
    // Verify error
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:4000/api/user/login',
        { email: 'wrong@example.com', password: 'wrongpassword' }
      );
      expect(mockSetToken).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
