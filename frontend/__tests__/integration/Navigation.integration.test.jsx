import React from 'react';
import { screen, fireEvent, act } from '@testing-library/react';
import Header from '../../src/components/Header';
import Navbar from '../../src/components/Navbar';
import { renderWithProviders } from '../../src/test-utils';
import { ShopContext } from '../../__tests__/mocks/ShopContextMock';

// Mock ShopContext using the mock module
jest.mock('../../src/context/ShopContext', () => {
  return require('../../__tests__/mocks/ShopContextMock');
});

// Mock icons
jest.mock('react-icons/cg', () => ({
  CgMenuLeft: () => <div data-testid="menu-icon">MenuIcon</div>
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

describe('Navigation Integration Tests', () => {
  const mockShopContext = {
    token: '',
    setToken: jest.fn(),
    getCartCount: jest.fn().mockReturnValue(0),
    setCartItems: jest.fn(),
    navigate: jest.fn()
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockShopContext.token = '';
    mockShopContext.getCartCount.mockReturnValue(0);
  });

  test('renders navigation components with basic structure', () => {
    renderWithProviders(
      <Header />,
      { shopContextValue: mockShopContext }
    );

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('header-container')).toBeInTheDocument();
  });

  test('displays correct cart count', () => {
    mockShopContext.getCartCount.mockReturnValue(3);
    
    renderWithProviders(
      <Header />, 
      { shopContextValue: mockShopContext }
    );
    
    expect(screen.getByTestId('cart-count')).toHaveTextContent('3');
  });

  test('shows login button when user is not logged in', () => {
    renderWithProviders(
      <Header />, 
      { shopContextValue: mockShopContext }
    );
    
    expect(screen.getByTestId('login-button')).toBeInTheDocument();
    expect(screen.queryByTestId('user-menu')).not.toBeInTheDocument();
  });

  test('shows user menu when logged in', () => {
    const loggedInContext = {
      ...mockShopContext,
      token: 'test-token'
    };
    
    renderWithProviders(
      <Header />, 
      { shopContextValue: loggedInContext }
    );
    
    expect(screen.queryByTestId('login-button')).not.toBeInTheDocument();
    expect(screen.getByTestId('user-menu')).toBeInTheDocument();
  });
  
  test('handles logout correctly', () => {
    const loggedInContext = {
      ...mockShopContext,
      token: 'test-token'
    };
    
    renderWithProviders(
      <Header />, 
      { shopContextValue: loggedInContext }
    );
    
    const userMenu = screen.getByTestId('user-menu');
    fireEvent.click(userMenu);
    
    const logoutButton = screen.getByTestId('logout-button');
    fireEvent.click(logoutButton);

    expect(mockShopContext.setToken).toHaveBeenCalledWith('');
    expect(mockShopContext.setCartItems).toHaveBeenCalledWith({});
    expect(mockShopContext.navigate).toHaveBeenCalledWith('/login');
  });
});
