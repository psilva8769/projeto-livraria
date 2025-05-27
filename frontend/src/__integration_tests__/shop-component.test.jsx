import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Shop from '../pages/Shop';
import { ShopContext } from '../context/ShopContext';

// Mock window.scrollTo
window.scrollTo = jest.fn();

// Mock books data
const mockBooks = [
  {
    _id: '1',
    name: 'Dom Casmurro',
    category: 'literatura',
    price: 25,
    description: 'Uma das mais importantes obras da literatura brasileira.',
    image: '/images/book1.jpg'
  },
  {
    _id: '2',
    name: 'O Cortiço',
    category: 'literatura',
    price: 30,
    description: 'Romance naturalista brasileiro.',
    image: '/images/book2.jpg'
  },
  {
    _id: '3',
    name: 'Livro de Baixo Preço',
    category: 'ficção',
    price: 10,
    description: 'Um livro com preço baixo.',
    image: '/images/book3.jpg'
  },
  {
    _id: '4',
    name: 'Livro de Alto Preço',
    category: 'ficção',
    price: 50,
    description: 'Um livro com preço alto.',
    image: '/images/book4.jpg'
  }
];

// Mock context value
const mockContextValue = {
  books: mockBooks,
  currency: 'R$',
  cartItems: {},
  addToCart: jest.fn(),
  getCartCount: jest.fn(),
  getCartAmount: jest.fn(() => 0),
  delivery_charges: 15,
  navigate: jest.fn(),
};

// Custom render function with ShopContext provider
const renderWithShopContext = (ui, contextValue = mockContextValue) => {
  return render(
    <ShopContext.Provider value={contextValue}>
      {ui}
    </ShopContext.Provider>
  );
};

describe('Shop Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render shop page with books list', async () => {
    renderWithShopContext(<Shop />);
    
    // Check if page title and books are rendered
    expect(screen.getByText('Nossa')).toBeInTheDocument();
    expect(screen.getByText('Lista de Livros')).toBeInTheDocument();
    
    // Check if books are displayed
    await waitFor(() => {
      expect(screen.getByText('Dom Casmurro')).toBeInTheDocument();
      expect(screen.getByText('O Cortiço')).toBeInTheDocument();
    });
  });

  test('should filter books by search input', async () => {
    renderWithShopContext(<Shop />);
    
    // Get the search input
    const searchInput = screen.getByPlaceholderText(/pesquise por título, autor ou categoria/i);
    
    // Type in the search field
    await userEvent.type(searchInput, 'Dom');
    
    // Check if only matching books are displayed
    await waitFor(() => {
      expect(screen.getByText('Dom Casmurro')).toBeInTheDocument();
      expect(screen.queryByText('O Cortiço')).not.toBeInTheDocument();
    });
    
    // Clear search and check if all books are shown
    await userEvent.clear(searchInput);
    await waitFor(() => {
      expect(screen.getByText('Dom Casmurro')).toBeInTheDocument();
      expect(screen.getByText('O Cortiço')).toBeInTheDocument();
    });
  });
});
