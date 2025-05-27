import React from 'react';
import { screen, fireEvent, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import { renderWithProviders } from '../../src/test-utils';
import Login from '../../src/pages/Login';
import Verify from '../../src/pages/Verify';
import { ShopContext } from '../../__tests__/mocks/ShopContextMock';

// Mock ShopContext using the mock module
jest.mock('../../src/context/ShopContext', () => {
  return require('../../__tests__/mocks/ShopContextMock');
});

// Mock icons
jest.mock('react-icons/cg', () => ({
  CgMenuLeft: () => 'MenuIcon'
}));

jest.mock('react-icons/tb', () => ({
  TbUserCircle: () => 'UserIcon'
}));

jest.mock('react-icons/ri', () => ({
  RiUserLine: () => 'UserLineIcon',
  RiShoppingBag4Line: () => 'ShoppingBagIcon'
}));

jest.mock('react-icons/fa', () => ({
  FaFacebook: () => 'FacebookIcon',
  FaTwitter: () => 'TwitterIcon'
}));

// Mock assets
jest.mock('../../src/assets/logo.png', () => 'logo-mock');
jest.mock('../../src/assets/login.png', () => 'login-mock');

// Mock axios
jest.mock('axios');

const createMockShopContext = () => ({
  token: '',
  setToken: jest.fn(),
  setUser: jest.fn(),
  navigate: jest.fn(),
  backendUrl: 'http://localhost:3001',
  getCartCount: jest.fn().mockReturnValue(0),
  setCartItems: jest.fn(),
});

describe('Authentication Flow Integration Tests', () => {  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    jest.useRealTimers();
  });
  describe('Login Page', () => {    test('renders login form with all elements', () => {
      const context = createMockShopContext();
      renderWithProviders(<Login />, { shopContextValue: context });
      
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
      expect(screen.getByTestId('login-form')).toBeInTheDocument();
      expect(screen.getByTestId('login-title')).toBeInTheDocument();
      expect(screen.getByTestId('email-input')).toBeInTheDocument();
      expect(screen.getByTestId('password-input')).toBeInTheDocument();
      expect(screen.getByTestId('login-button')).toBeInTheDocument();
      expect(screen.getByTestId('signup-link')).toBeInTheDocument();
    });    test('handles form submission with valid credentials', async () => {
      const context = createMockShopContext();
      const mockResponse = { 
        data: { 
          success: true,
          token: 'test-token', 
          user: { email: 'test@example.com' } 
        } 
      };
      
      axios.post.mockResolvedValueOnce(mockResponse);
      
      renderWithProviders(<Login />, { shopContextValue: context });
      
      fireEvent.change(screen.getByTestId('email-input'), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByTestId('password-input'), {
        target: { value: 'password123' }
      });
      
      // Act on the form submission
      await act(async () => {
        fireEvent.click(screen.getByTestId('login-button'));
        await Promise.resolve(); // Let all promises resolve
      });
      
      // Wait for state updates
      await waitFor(() => {
        expect(context.setToken).toHaveBeenCalledWith('test-token');
        expect(context.setUser).toHaveBeenCalledWith(mockResponse.data.user);
        expect(context.navigate).toHaveBeenCalledWith('/');
      }, { timeout: 1000 });
    });

    test('displays error message for invalid credentials', async () => {      const mockError = { 
        response: { 
          data: { message: 'Invalid credentials' } 
        } 
      };
      axios.post.mockRejectedValueOnce(mockError);      const context = createMockShopContext();
      renderWithProviders(<Login />, { shopContextValue: context });
      
      fireEvent.change(screen.getByTestId('email-input'), {
        target: { value: 'wrong@example.com' }
      });
      fireEvent.change(screen.getByTestId('password-input'), {
        target: { value: 'wrongpass' }
      });
      fireEvent.click(screen.getByTestId('login-button'));

      await waitFor(() => {
        expect(screen.getByTestId('login-error')).toHaveTextContent('Invalid credentials');
      });
    });    test('validates required fields', async () => {      const context = createMockShopContext();
      renderWithProviders(<Login />, { shopContextValue: context });
      
      fireEvent.click(screen.getByTestId('login-button'));

      await waitFor(() => {
        expect(screen.getByTestId('email-error')).toBeInTheDocument();
        expect(screen.getByTestId('password-error')).toBeInTheDocument();
      });
    });
  });
  describe('Verification Page', () => {    test('renders verification form', () => {
      const context = createMockShopContext();
      renderWithProviders(<Verify />, { shopContextValue: context });
      
      expect(screen.getByTestId('verify-page')).toBeInTheDocument();
      expect(screen.getByTestId('verify-form')).toBeInTheDocument();
      expect(screen.getByTestId('verify-title')).toBeInTheDocument();
      expect(screen.getByTestId('code-input')).toBeInTheDocument();
      expect(screen.getByTestId('verify-button')).toBeInTheDocument();
    });test('handles successful verification', async () => {      const mockResponse = { data: { success: true } };      axios.post.mockResolvedValueOnce(mockResponse);
      const context = createMockShopContext();
      renderWithProviders(<Verify />, { shopContextValue: context });

      fireEvent.change(screen.getByTestId('code-input'), {
        target: { value: '123456' }
      });
      
      await act(async () => {
        fireEvent.click(screen.getByTestId('verify-button'));
      });

      await waitFor(() => {
        expect(context.navigate).toHaveBeenCalledWith('/login');
        expect(screen.getByTestId('success-message')).toHaveTextContent('Verification successful');
      }, { timeout: 2000 });
    });    test('displays error for invalid verification code', async () => {
      const mockError = {
        response: {
          data: { message: 'Invalid verification code' }
        }
      };      axios.post.mockRejectedValueOnce(mockError);
      const context = createMockShopContext();
      renderWithProviders(<Verify />, { shopContextValue: context });
      
      fireEvent.change(screen.getByTestId('code-input'), {
        target: { value: '000000' }
      });
      fireEvent.click(screen.getByTestId('verify-button'));

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toHaveTextContent('Invalid verification code');
      });
    });    test('handles resend verification code', async () => {
      const mockResponse = { data: { success: true } };      axios.post.mockResolvedValueOnce(mockResponse);
      const context = createMockShopContext();
      renderWithProviders(<Verify />, { shopContextValue: context });
      
      fireEvent.click(screen.getByTestId('resend-button'));

      await waitFor(() => {
        expect(screen.getByTestId('success-message')).toHaveTextContent('Verification code resent');
      });
    });
  });
});
