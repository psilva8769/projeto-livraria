import React from 'react';

// Mock do ShopContext
const mockShopContext = {
  books: [
    {
      _id: '1',
      name: 'Livro Teste 1',
      price: 29.99,
      image: 'test-image.jpg',
      category: 'Fiction',
      description: 'Descrição do livro teste'
    },
    {
      _id: '2',
      name: 'Livro Teste 2',
      price: 39.99,
      image: 'test-image2.jpg',
      category: 'Science',
      description: 'Descrição do livro teste 2'
    }
  ],
  currency: '$',
  navigate: jest.fn(),
  token: '',
  setToken: jest.fn(),
  cartItems: { '1': 2, '2': 1 },
  setCartItems: jest.fn(),
  addToCart: jest.fn(),
  getCartCount: jest.fn(() => 3),
  getCartAmount: jest.fn(() => 99.97),
  updateQuantity: jest.fn(),
  delivery_charges: 5,
  backendUrl: 'http://localhost:5000'
};

export const ShopContext = React.createContext(mockShopContext);

const ShopContextProvider = ({ children }) => {
  return (
    React.createElement(ShopContext.Provider, { value: mockShopContext }, children)
  );
};

export default ShopContextProvider;
