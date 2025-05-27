// Mock for ShopContext.jsx to be used in tests
import React from 'react';

export const ShopContext = React.createContext();

// Default mock values for ShopContext
const defaultContextValues = {
  books: [
    { _id: '1', name: 'Test Book 1', price: 20, author: 'Author 1' },
    { _id: '2', name: 'Test Book 2', price: 30, author: 'Author 2' }
  ],
  currency: '$',
  navigate: jest.fn(),
  token: 'test-token',
  setToken: jest.fn(),
  cartItems: { '1': 2, '2': 1 },
  setCartItems: jest.fn(),
  addToCart: jest.fn(),
  getCartCount: jest.fn(() => 3),
  getCartAmount: jest.fn(() => 70), // 2 * 20 + 1 * 30
  updateQuantity: jest.fn(),
  delivery_charges: 5,
  backendUrl: 'http://localhost:4000',
  filterCategory: '',
  setFilterCategory: jest.fn(),
  sortOrder: 'relevant',
  setSortOrder: jest.fn(),
  getCartItemCount: jest.fn(() => 3) // Alias for compatibility
};

// Mock ShopContextProvider component
const ShopContextProvider = ({ children, contextValue = {} }) => {
  // Merge default values with any custom values provided
  const mockContextValue = { ...defaultContextValues, ...contextValue };

  return (
    <ShopContext.Provider value={mockContextValue}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
