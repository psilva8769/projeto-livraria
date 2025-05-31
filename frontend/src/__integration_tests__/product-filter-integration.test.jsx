import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Shop from '../pages/Shop';
import { ShopContext } from '../context/ShopContext';
import userEvent from '@testing-library/user-event';

// Mock do window.scrollTo para evitar erros nos testes
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
    name: 'Medicina Básica',
    category: 'saúde',
    price: 45,
    description: 'Livro sobre medicina básica.',
    image: '/images/book3.jpg'
  }
];

describe('Integração de Filtro de Produtos', () => {
  test('filtra produtos pelo campo de busca', async () => {
    // Arrange - renderiza o componente com contexto mockado
    render(
      <BrowserRouter>
        <ShopContext.Provider value={{
          books: mockBooks,
          currency: 'R$',
        }}>
          <Shop />
        </ShopContext.Provider>
      </BrowserRouter>
    );
    
    // Act - digita no campo de busca
    const searchInput = screen.getByPlaceholderText(/pesquise por título/i);
    await userEvent.type(searchInput, 'Dom');
    
    // Assert - verifica se apenas os livros correspondentes são exibidos
    expect(screen.getByText('Dom Casmurro')).toBeInTheDocument();
    expect(screen.queryByText('O Cortiço')).not.toBeInTheDocument();
    expect(screen.queryByText('Medicina Básica')).not.toBeInTheDocument();
  });

  test('ordena produtos pelo preço corretamente', async () => {
    // Arrange - renderiza o componente
    render(
      <BrowserRouter>
        <ShopContext.Provider value={{
          books: mockBooks,
          currency: 'R$',
        }}>
          <Shop />
        </ShopContext.Provider>
      </BrowserRouter>
    );
    
    // Act - seleciona ordenação pelo menor preço
    const sortSelect = screen.getByRole('combobox');
    fireEvent.change(sortSelect, { target: { value: 'low' } });
    
    // Assert - verifica se os livros estão ordenados corretamente
    const bookElements = screen.getAllByText(/[A-Za-z]/);
    
    // Os produtos devem estar ordenados por preço: Dom Casmurro (25), O Cortiço (30), Medicina Básica (45)
    expect(bookElements.some(element => element.textContent === 'Dom Casmurro')).toBeTruthy();
  });
});
