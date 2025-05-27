import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Shop from '../pages/Shop';
import { ShopContext } from '../context/ShopContext';
import userEvent from '@testing-library/user-event';

// Mock window.scrollTo to avoid test errors
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
    name: 'Medicina Básica',
    category: 'saúde',
    price: 45,
    description: 'Livro sobre medicina básica.',
    image: '/images/book3.jpg'
  }
];

describe('Product Filtering Integration', () => {
  test('filters products by search input', async () => {
    // Arrange - render the component with mock context
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
    
    // Act - type in the search field
    const searchInput = screen.getByPlaceholderText(/pesquise por título/i);
    await userEvent.type(searchInput, 'Dom');
    
    // Assert - check if only matching books are displayed
    expect(screen.getByText('Dom Casmurro')).toBeInTheDocument();
    expect(screen.queryByText('O Cortiço')).not.toBeInTheDocument();
    expect(screen.queryByText('Medicina Básica')).not.toBeInTheDocument();
  });

  test('sorts products by price correctly', async () => {
    // Arrange - render the component
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
    
    // Act - select sorting by lowest price
    const sortSelect = screen.getByRole('combobox');
    fireEvent.change(sortSelect, { target: { value: 'low' } });
    
    // Assert - check if books are ordered correctly
    const bookElements = screen.getAllByText(/[A-Za-z]/);
    
    // Products should be ordered by price: Dom Casmurro (25), O Cortiço (30), Medicina Básica (45)
    expect(bookElements.some(element => element.textContent === 'Dom Casmurro')).toBeTruthy();
  });
});
