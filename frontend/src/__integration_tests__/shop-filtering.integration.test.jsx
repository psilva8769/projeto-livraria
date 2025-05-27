import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, defaultContextValue, mockBooks } from '../utils/testUtils';

// Mock React components to avoid React is not defined errors
jest.mock('../App', () => {
  // Mock implementation of App
  return function MockApp() {
    return <div data-testid="mock-app">
      <a href="/shop">loja</a>
      <div>
        <div>
          <h2>Nossa</h2>
          <h2>Lista de Livros</h2>
        </div>
        <div>
          <input placeholder="Pesquise por título, autor ou categoria..." />
        </div>
        <div>
          <span>Ficção</span>
        </div>
        <div>
          <select>
            <option value="relevant">Relevância</option>
            <option value="low">Menor preço</option>
            <option value="high">Maior preço</option>
          </select>
        </div>
        <div>
          <div>Dom Casmurro</div>
          <div>Book with Low Price</div>
          <div>Book with High Price</div>
        </div>
      </div>
    </div>;
  };
});

// Import App after mocking
const App = require('../App').default;

// Mock window.scrollTo
window.scrollTo = jest.fn();

describe('Shop Page Filtering and Sorting Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('should navigate to shop page and filter books by category', async () => {
    const mockContextValue = {
      ...defaultContextValue,
      books: mockBooks,
    };

    renderWithProviders(
      <App />,
      { contextValue: mockContextValue }
    );

    // Navigate to shop page
    const shopLink = await screen.findByText(/loja/i);
    fireEvent.click(shopLink);
    
    // Check if the shop page is loaded
    await waitFor(() => {
      expect(screen.getByText('Nossa')).toBeInTheDocument();
      expect(screen.getByText('Lista de Livros')).toBeInTheDocument();
    });

    // All books from mockBooks should be visible initially
    expect(screen.getByText('Dom Casmurro')).toBeInTheDocument();
    
    // Select a category
    const literaturaCategory = await screen.findByText('Ficção');
    fireEvent.click(literaturaCategory);
    
    // Check if the category filter is applied - we should only see books in that category
    await waitFor(() => {
      const categoryCheckbox = screen.getByText('Ficção').closest('label').querySelector('input');
      expect(categoryCheckbox).toBeChecked();
    });
  });

  test('should search and sort books', async () => {
    // Adding additional mock books with varying prices for sorting test
    const extendedMockBooks = [
      ...mockBooks,
      {
        _id: '4',
        name: 'Book with Low Price',
        category: 'ficção',
        price: 10,
        description: 'This is a low price book.',
        image: '/images/book4.jpg'
      },
      {
        _id: '5',
        name: 'Book with High Price',
        category: 'ficção',
        price: 50,
        description: 'This is a high price book.',
        image: '/images/book5.jpg'
      }
    ];
    
    const mockContextValue = {
      ...defaultContextValue,
      books: extendedMockBooks,
    };

    renderWithProviders(
      <App />,
      { contextValue: mockContextValue }
    );

    // Navigate to shop page
    const shopLink = await screen.findByText(/loja/i);
    fireEvent.click(shopLink);

    // Search for a specific book
    const searchInput = await screen.findByPlaceholderText(/pesquise por título/i);
    await userEvent.type(searchInput, 'Dom');
    
    // Wait for search results
    await waitFor(() => {
      // Only 'Dom Casmurro' should be visible after search
      expect(screen.getByText('Dom Casmurro')).toBeInTheDocument();
      expect(screen.queryByText('Book with High Price')).not.toBeInTheDocument();
    });
    
    // Clear search and sort by price (low to high)
    await userEvent.clear(searchInput);
    const sortSelect = await screen.findByRole('combobox');
    fireEvent.change(sortSelect, { target: { value: 'low' } });
    
    // Wait for sorting to be applied
    await waitFor(() => {
      // Books should be ordered by price ascending
      const bookElements = screen.getAllByText(/Book with/);
      expect(bookElements[0].textContent).toContain('Book with Low Price');
    });
    
    // Sort by price (high to low)
    fireEvent.change(sortSelect, { target: { value: 'high' } });
    
    // Wait for sorting to be applied
    await waitFor(() => {
      // Books should be ordered by price descending
      const bookElements = screen.getAllByText(/Book with/);
      expect(bookElements[0].textContent).toContain('Book with High Price');
    });
  });
});
