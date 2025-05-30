import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, defaultContextValue, mockBooks } from '../utils/testUtils';
import App from '../App';

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
      { 
        contextValue: mockContextValue,
        initialEntries: ['/shop']
      }
    );

    // Check if the shop page is loaded
    await waitFor(() => {
      expect(screen.getByText('Nossa')).toBeInTheDocument();
      expect(screen.getByText('Lista de Livros')).toBeInTheDocument();
    });    // All books from mockBooks should be visible initially
    expect(screen.getByText('Dom Casmurro')).toBeInTheDocument();
    
    // Select a category - target the category filter specifically, not the book category badges
    const categoryFilters = screen.getAllByText('Ficção');
    // The first one should be the category filter checkbox, others are book category badges
    const categoryFilterLabel = categoryFilters.find(element => 
      element.classList.contains('medium-14') && 
      element.closest('label')?.querySelector('input[type="checkbox"]')
    );
    expect(categoryFilterLabel).toBeTruthy();
    fireEvent.click(categoryFilterLabel);
    
    // Check if the category filter is applied - we should only see books in that category
    await waitFor(() => {
      const categoryCheckbox = categoryFilterLabel.closest('label').querySelector('input');
      expect(categoryCheckbox).toBeChecked();
    });
  });

  test('should search and sort books', async () => {
    // Adding additional mock books with varying prices for sorting test
    const extendedMockBooks = [
      ...mockBooks,      {
        _id: '4',
        name: 'Book with Low Price',
        category: 'Ficção',
        price: 10,
        description: 'This is a low price book.',
        image: '/images/book4.jpg'
      },
      {
        _id: '5',
        name: 'Book with High Price',
        category: 'Ficção',
        price: 50,
        description: 'This is a high price book.',
        image: '/images/book5.jpg'
      }
    ];
    
    const mockContextValue = {
      ...defaultContextValue,
      books: extendedMockBooks,
    };    renderWithProviders(
      <App />,
      { 
        contextValue: mockContextValue,
        initialEntries: ['/shop']
      }
    );

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
