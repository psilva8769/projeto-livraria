import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

// Dados de exemplo para testes
export const mockBooks = [
  {
    _id: '1',
    name: 'Dom Casmurro',
    category: 'Ficção',
    price: 25,
    description: 'Uma das mais importantes obras da literatura brasileira.',
    image: '/images/book1.jpg'
  },
  {
    _id: '2',
    name: 'O Cortiço',
    category: 'Ficção',
    price: 30,
    description: 'Romance naturalista brasileiro.',
    image: '/images/book2.jpg'
  },
  {
    _id: '3',
    name: 'Romance Moderno',
    category: 'Ficção',
    price: 20,
    description: 'Uma história de amor contemporânea.',
    image: '/images/book3.jpg'
  }
];

export const mockUser = {
  _id: 'user1',
  name: 'Test User',
  email: 'test@example.com'
};

// Valores padrão do contexto para testes
export const defaultContextValue = {
  books: mockBooks,
  currency: 'R$',
  cartItems: {},
  addToCart: jest.fn(),
  updateQuantity: jest.fn(),
  getCartAmount: jest.fn(() => 0),
  getCartCount: jest.fn(() => 0),
  setCartItems: jest.fn(),
  delivery_charges: 15,
  navigate: jest.fn(),
  token: null,
  setToken: jest.fn(),
  backendUrl: 'http://localhost:4000',
  userData: null,
  setUserData: jest.fn()
};

// Função de renderização customizada que inclui todos os providers necessários
export const renderWithProviders = (
  component,
  {
    contextValue = defaultContextValue,
    initialEntries = ['/'],
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }) => (
    <MemoryRouter initialEntries={initialEntries}>
      <ShopContext.Provider value={contextValue}>
        {children}
      </ShopContext.Provider>
    </MemoryRouter>
  );

  return render(component, { wrapper: Wrapper, ...renderOptions });
};

// Função auxiliar para criar contexto com itens no carrinho
export const createContextWithCart = (cartItems = {}) => ({
  ...defaultContextValue,
  cartItems,
  getCartAmount: jest.fn(() => {
    const total = Object.entries(cartItems).reduce((sum, [id, quantity]) => {
      const book = mockBooks.find(b => b._id === id);
      return sum + (book ? book.price * quantity : 0);
    }, 0);
    return total;
  })
});

// Função auxiliar para criar contexto com usuário logado
export const createContextWithUser = (token = 'fake-token', userData = mockUser) => ({
  ...defaultContextValue,
  token,
  userData
});

// Implementações mock para funções comuns
export const mockFunctions = {
  navigate: jest.fn(),
  addToCart: jest.fn(),
  updateQuantity: jest.fn(),
  getCartAmount: jest.fn(),
  setToken: jest.fn(),
  setUserData: jest.fn()
};

// Reseta todos os mocks
export const resetMocks = () => {
  Object.values(mockFunctions).forEach(mock => {
    if (mock.mockReset) {
      mock.mockReset();
    }
  });
};

// Dados de teste comuns
export const testData = {
  validEmail: 'test@example.com',
  validPassword: 'password123',
  validName: 'Test User',
  invalidEmail: 'invalid-email',
  shortPassword: '123'
};

export default {
  renderWithProviders,
  createContextWithCart,
  createContextWithUser,
  mockBooks,
  mockUser,
  defaultContextValue,
  mockFunctions,
  resetMocks,
  testData
};
