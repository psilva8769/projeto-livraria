// A reusable mock for the ShopContext module to be used in tests
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
module.exports = {
  ShopContext,
  __esModule: true,
  default: ({ children }) => {
    return React.createElement(ShopContext.Provider, { value: mockValues }, children);
  }
};
