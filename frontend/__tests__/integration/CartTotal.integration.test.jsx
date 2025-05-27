import React from 'react';
import { screen } from '@testing-library/react';
import CartTotal from '../../src/components/CartTotal';
import { renderWithProviders } from '../../src/test-utils';

// Mock the ShopContext module to avoid import.meta issues
jest.mock('../../src/context/ShopContext', () => {
  const React = require('react');
  // Create a context with the same name for compatibility
  const ShopContext = React.createContext();
  
  // Define mock values directly within the module factory
  const mockValues = {
    books: [
      { _id: '1', name: 'Book 1', price: 30 },
      { _id: '2', name: 'Book 2', price: 40 }
    ],
    currency: '$',
    navigate: jest.fn(),
    token: 'test-token',
    setToken: jest.fn(),
    cartItems: { '1': 2, '2': 1 },
    setCartItems: jest.fn(),
    addToCart: jest.fn(),
    getCartCount: jest.fn(() => 3),
    getCartAmount: jest.fn(() => 70),
    updateQuantity: jest.fn(),
    delivery_charges: 5,
    backendUrl: 'http://localhost:4000',
    filterCategory: '',
    setFilterCategory: jest.fn(),
    sortOrder: 'relevant',
    setSortOrder: jest.fn(),
    getCartItemCount: jest.fn(() => 3)
  };
  
  // Export the mocked context
  return {
    ShopContext,
    __esModule: true,
    default: ({ children }) => {
      return <ShopContext.Provider value={mockValues}>{children}</ShopContext.Provider>;
    }
  };
});

describe('CartTotal Integration Tests', () => {
  const mockBooks = [
    { _id: '1', name: 'Book 1', price: 30 },
    { _id: '2', name: 'Book 2', price: 40 }
  ];

  const mockShopContext = {
    currency: '$',
    cartItems: {},
    books: mockBooks,
    getCartAmount: jest.fn(),
    delivery_charges: 5
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockShopContext.cartItems = {};
    mockShopContext.getCartAmount.mockReturnValue(0);
  });

  test('should display correct totals with items in cart', () => {
    mockShopContext.getCartAmount.mockReturnValue(30);
    
    renderWithProviders(
      <CartTotal />, 
      { shopContextValue: mockShopContext }
    );

    expect(screen.getByTestId('subtotal-amount')).toHaveTextContent('$30.00');
    expect(screen.getByTestId('shipping-amount')).toHaveTextContent('$5.00');
    expect(screen.getByTestId('total-amount')).toHaveTextContent('$35.00');
  });

  test('should handle empty cart correctly', () => {
    mockShopContext.getCartAmount.mockReturnValue(0);
    
    renderWithProviders(
      <CartTotal />, 
      { shopContextValue: mockShopContext }
    );

    expect(screen.getByTestId('subtotal-amount')).toHaveTextContent('$0.00');
    expect(screen.getByTestId('shipping-amount')).toHaveTextContent('0.00');
    expect(screen.getByTestId('total-amount')).toHaveTextContent('$0.00');
  });

  test('should show formatted currency values', () => {
    mockShopContext.getCartAmount.mockReturnValue(75);
    
    renderWithProviders(
      <CartTotal />, 
      { shopContextValue: mockShopContext }
    );

    expect(screen.getByTestId('subtotal-amount')).toHaveTextContent('$75.00');
    expect(screen.getByTestId('shipping-amount')).toHaveTextContent('$5.00');
    expect(screen.getByTestId('total-amount')).toHaveTextContent('$80.00');
  });
});
