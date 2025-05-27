import React from 'react';
import { screen, fireEvent, waitFor, act } from '@testing-library/react';
import Login from '../../src/pages/Login';
import Header from '../../src/components/Header';
import { renderWithProviders } from '../../src/test-utils';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ShopContext } from '../../__tests__/mocks/ShopContextMock';

// Mock ShopContext using the mock module
jest.mock('../../src/context/ShopContext', () => {
  return require('../../__tests__/mocks/ShopContextMock');
});

jest.mock('axios');

// Mock toast notifications
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn()
  }
}));

// Mock icons
jest.mock('react-icons/cg', () => ({
  CgMenuLeft: () => <div>MenuIcon</div>
}));

jest.mock('react-icons/tb', () => ({
  TbUserCircle: () => <div data-testid="user-circle-icon">UserIcon</div>
}));

jest.mock('react-icons/ri', () => ({
  RiUserLine: () => <div>UserLineIcon</div>,
  RiShoppingBag4Line: () => <div>ShoppingBagIcon</div>
}));

// Mock assets
jest.mock('../../src/assets/logo.png', () => 'logo-mock');
jest.mock('../../src/assets/login.png', () => 'login-mock');

describe('Authentication Integration Tests', () => {
  const mockShopContext = {
    token: '',
    setToken: jest.fn(),
    setUser: jest.fn(),
    backendUrl: 'http://localhost:3000',
    navigate: jest.fn(),
    setCartItems: jest.fn(),
    logout: jest.fn(),
    getCartCount: jest.fn().mockReturnValue(0),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockShopContext.token = '';
  });

  test('renders login form with all fields', () => {
    renderWithProviders(<Login />, { shopContextValue: mockShopContext });
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('login-button')).toBeInTheDocument();
  });

  test('validates form fields on submission', async () => {
    renderWithProviders(<Login />, { shopContextValue: mockShopContext });
    
    // Submit empty form
    fireEvent.click(screen.getByTestId('login-button'));

    await waitFor(() => {
      expect(screen.getByTestId('email-error')).toHaveTextContent('Email is required');
      expect(screen.getByTestId('password-error')).toHaveTextContent('Password is required');
    });

    // Enter invalid email and try again
    fireEvent.change(screen.getByTestId('email-input'), {
      target: { value: 'invalid-email' }
    });
    
    fireEvent.click(screen.getByTestId('login-button'));    await waitFor(() => {
      expect(screen.getByTestId('email-error')).toHaveTextContent('Email is required');
    });

    // Enter short password
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: '12345' }
    });

    fireEvent.click(screen.getByTestId('login-button'));

    await waitFor(() => {
      expect(screen.getByTestId('password-error')).toHaveTextContent('Password is required');
    });
  });

  test('handles successful login flow', async () => {
    const mockResponse = { data: { success: true, token: 'test-token', user: { name: 'Test User' } } };
    axios.post.mockResolvedValueOnce(mockResponse);

    renderWithProviders(<Login />, { shopContextValue: mockShopContext });

    // Fill form with valid data
    fireEvent.change(screen.getByTestId('email-input'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'password123' }
    });

    // Submit form
    await act(async () => {
      fireEvent.click(screen.getByTestId('login-button'));
    });

    await waitFor(() => {
      expect(mockShopContext.setToken).toHaveBeenCalledWith('test-token');
      expect(mockShopContext.setUser).toHaveBeenCalledWith({ name: 'Test User' });
      expect(mockShopContext.navigate).toHaveBeenCalledWith('/');
      expect(toast.success).toHaveBeenCalled();
    });
  });

  test('updates header state after login/logout', async () => {
    // Initial state (not logged in)
    renderWithProviders(<Header />, { shopContextValue: mockShopContext });
    expect(screen.getByTestId('login-button')).toBeInTheDocument();

    // After login
    mockShopContext.token = 'test-token';
    renderWithProviders(<Header />, { shopContextValue: { ...mockShopContext, token: 'test-token' } });
    expect(screen.getByTestId('user-menu')).toBeInTheDocument();

    // Trigger logout
    const userMenu = screen.getByTestId('user-menu');
    fireEvent.click(userMenu);
    
    expect(screen.getByTestId('logout-button')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('logout-button'));

    await waitFor(() => {
      expect(mockShopContext.setToken).toHaveBeenCalledWith('');
      expect(mockShopContext.setCartItems).toHaveBeenCalledWith({});
      expect(mockShopContext.navigate).toHaveBeenCalledWith('/login');
    });
  });
});
