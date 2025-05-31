import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Shop from '../pages/Shop';
import { ShopContext } from '../context/ShopContext';

// Mock do window.scrollTo
window.scrollTo = jest.fn();

// Mock dos dados de livros
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

// Mock do valor do contexto
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

// Função personalizada de renderização com o provedor ShopContext
const renderWithShopContext = (ui, contextValue = mockContextValue) => {
  return render(
    <ShopContext.Provider value={contextValue}>
      {ui}
    </ShopContext.Provider>
  );
};

describe('Componente Loja', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve renderizar a página da loja com a lista de livros', async () => {
    renderWithShopContext(<Shop />);
    
    // Verifica se o título da página e os livros são renderizados
    expect(screen.getByText('Nossa')).toBeInTheDocument();
    expect(screen.getByText('Lista de Livros')).toBeInTheDocument();
    
    // Verifica se os livros são exibidos
    await waitFor(() => {
      expect(screen.getByText('Dom Casmurro')).toBeInTheDocument();
      expect(screen.getByText('O Cortiço')).toBeInTheDocument();
    });
  });

  test('deve filtrar livros pelo campo de busca', async () => {
    renderWithShopContext(<Shop />);
    
    // Obtém o campo de busca
    const searchInput = screen.getByPlaceholderText(/pesquise por título, autor ou categoria/i);
    
    // Digita no campo de busca
    await userEvent.type(searchInput, 'Dom');
    
    // Verifica se apenas os livros correspondentes são exibidos
    await waitFor(() => {
      expect(screen.getByText('Dom Casmurro')).toBeInTheDocument();
      expect(screen.queryByText('O Cortiço')).not.toBeInTheDocument();
    });
    
    // Limpa a busca e verifica se todos os livros são exibidos
    await userEvent.clear(searchInput);
    await waitFor(() => {
      expect(screen.getByText('Dom Casmurro')).toBeInTheDocument();
      expect(screen.getByText('O Cortiço')).toBeInTheDocument();
    });
  });
});
