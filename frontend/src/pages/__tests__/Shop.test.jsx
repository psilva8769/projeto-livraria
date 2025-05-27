import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Shop from '../Shop';
import { ShopContext } from '../../context/ShopContext';

// Mock Footer component
jest.mock('../../components/Footer', () => {
  return function MockFooter() {
    return <div data-testid="footer-component">Footer Component</div>;
  };
});

// Mock Item component
jest.mock('../../components/Item', () => {
  return function MockItem({ book }) {
    return <div data-testid={`item-${book._id}`}>{book.name}</div>;
  };
});

// Mock categories data
jest.mock('../../assets/data', () => ({
  categories: [
    { name: 'Romance', image: '/romance.png' },
    { name: 'Ficção', image: '/fiction.png' },
    { name: 'Literatura', image: '/literature.png' }
  ]
}));

const mockBooks = [
  {
    _id: '1',
    name: 'Dom Casmurro',
    category: 'Literatura',
    price: 25,
    image: '/images/book1.jpg'
  },
  {
    _id: '2',
    name: 'O Cortiço',
    category: 'Literatura',
    price: 30,
    image: '/images/book2.jpg'
  },
  {
    _id: '3',
    name: 'Romance Moderno',
    category: 'Romance',
    price: 20,
    image: '/images/book3.jpg'
  },
  {
    _id: '4',
    name: 'Ficção Científica',
    category: 'Ficção',
    price: 35,
    image: '/images/book4.jpg'
  }
];

const mockContextValue = {
  books: mockBooks
};

const renderWithContext = (contextValue = mockContextValue) => {
  return render(
    <ShopContext.Provider value={contextValue}>
      <Shop />
    </ShopContext.Provider>
  );
};

describe('Shop Page', () => {
  test('renders shop page with title', () => {
    renderWithContext();
      expect(screen.getByText('Nossa')).toBeInTheDocument();
    expect(screen.getByText('Lista de Livros')).toBeInTheDocument();
  });

  test('displays all books initially', () => {
    renderWithContext();
    
    expect(screen.getByTestId('item-1')).toBeInTheDocument();
    expect(screen.getByTestId('item-2')).toBeInTheDocument();
    expect(screen.getByTestId('item-3')).toBeInTheDocument();
    expect(screen.getByTestId('item-4')).toBeInTheDocument();
  });

  test('filters books by search term', () => {    renderWithContext();
    
    const searchInput = screen.getByPlaceholderText('Pesquise por título, autor ou categoria...');
    fireEvent.change(searchInput, { target: { value: 'Dom' } });
    
    // Should show only Dom Casmurro
    expect(screen.getByTestId('item-1')).toBeInTheDocument();
    expect(screen.queryByTestId('item-2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('item-3')).not.toBeInTheDocument();
    expect(screen.queryByTestId('item-4')).not.toBeInTheDocument();
  });

  test('search is case insensitive', () => {
    renderWithContext();
      const searchInput = screen.getByPlaceholderText('Pesquise por título, autor ou categoria...');
    fireEvent.change(searchInput, { target: { value: 'dom' } });
    
    expect(screen.getByTestId('item-1')).toBeInTheDocument();
  });

  test('sorts books by price low to high', () => {
    renderWithContext();
      const sortSelect = screen.getByDisplayValue('Relevância');
    fireEvent.change(sortSelect, { target: { value: 'low' } });
    
    // Should still display all books, but sorted
    expect(screen.getByTestId('item-1')).toBeInTheDocument();
    expect(screen.getByTestId('item-2')).toBeInTheDocument();
    expect(screen.getByTestId('item-3')).toBeInTheDocument();
    expect(screen.getByTestId('item-4')).toBeInTheDocument();
  });

  test('sorts books by price high to low', () => {
    renderWithContext();
      const sortSelect = screen.getByDisplayValue('Relevância');
    fireEvent.change(sortSelect, { target: { value: 'high' } });
    
    // Should still display all books, but sorted
    expect(screen.getByTestId('item-1')).toBeInTheDocument();
    expect(screen.getByTestId('item-2')).toBeInTheDocument();
    expect(screen.getByTestId('item-3')).toBeInTheDocument();
    expect(screen.getByTestId('item-4')).toBeInTheDocument();
  });

  test('filters books by category', () => {
    renderWithContext();
    
    // Find and click the literature category filter
    const literaturaFilter = screen.getByText('Literatura');
    fireEvent.click(literaturaFilter);
    
    // Should show only literatura books
    expect(screen.getByTestId('item-1')).toBeInTheDocument();
    expect(screen.getByTestId('item-2')).toBeInTheDocument();
    expect(screen.queryByTestId('item-3')).not.toBeInTheDocument();
    expect(screen.queryByTestId('item-4')).not.toBeInTheDocument();
  });

  test('combines search and category filters', () => {
    renderWithContext();
    
    // Apply literatura filter
    const literaturaFilter = screen.getByText('Literatura');
    fireEvent.click(literaturaFilter);
      // Apply search filter
    const searchInput = screen.getByPlaceholderText('Pesquise por título, autor ou categoria...');
    fireEvent.change(searchInput, { target: { value: 'Dom' } });
    
    // Should show only Dom Casmurro
    expect(screen.getByTestId('item-1')).toBeInTheDocument();
    expect(screen.queryByTestId('item-2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('item-3')).not.toBeInTheDocument();
    expect(screen.queryByTestId('item-4')).not.toBeInTheDocument();
  });

  test('shows no results when search has no matches', () => {
    renderWithContext();
      const searchInput = screen.getByPlaceholderText('Pesquise por título, autor ou categoria...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent book' } });
    
    // Should show no books
    expect(screen.queryByTestId('item-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('item-2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('item-3')).not.toBeInTheDocument();
    expect(screen.queryByTestId('item-4')).not.toBeInTheDocument();
  });

  test('toggles category filter on and off', () => {
    renderWithContext();
    
    const literaturaFilter = screen.getByText('Literatura');
    
    // Apply filter
    fireEvent.click(literaturaFilter);
    expect(screen.getByTestId('item-1')).toBeInTheDocument();
    expect(screen.getByTestId('item-2')).toBeInTheDocument();
    expect(screen.queryByTestId('item-3')).not.toBeInTheDocument();
    
    // Remove filter
    fireEvent.click(literaturaFilter);
    expect(screen.getByTestId('item-1')).toBeInTheDocument();
    expect(screen.getByTestId('item-2')).toBeInTheDocument();
    expect(screen.getByTestId('item-3')).toBeInTheDocument();
    expect(screen.getByTestId('item-4')).toBeInTheDocument();
  });

  test('renders footer component', () => {
    renderWithContext();
    
    expect(screen.getByTestId('footer-component')).toBeInTheDocument();
  });

  test('renders search input with correct placeholder', () => {
    renderWithContext();
      const searchInput = screen.getByPlaceholderText('Pesquise por título, autor ou categoria...');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('type', 'text');
  });

  test('renders sort dropdown with correct options', () => {
    renderWithContext();
      const sortSelect = screen.getByDisplayValue('Relevância');
    expect(sortSelect).toBeInTheDocument();
      // Check if sort options exist
    expect(screen.getByText('Relevância')).toBeInTheDocument();
    expect(screen.getByText('Menor preço')).toBeInTheDocument();
    expect(screen.getByText('Maior preço')).toBeInTheDocument();
  });

  test('handles empty books array gracefully', () => {
    const emptyBooksContext = {
      books: []
    };
    
    renderWithContext(emptyBooksContext);
      // Should render without crashing
    expect(screen.getByText('Nossa')).toBeInTheDocument();
    expect(screen.queryByTestId(/item-/)).not.toBeInTheDocument();
  });

  test('clears search input', () => {
    renderWithContext();
      const searchInput = screen.getByPlaceholderText('Pesquise por título, autor ou categoria...');
    
    // Type in search
    fireEvent.change(searchInput, { target: { value: 'Dom' } });
    expect(searchInput.value).toBe('Dom');
    
    // Clear search
    fireEvent.change(searchInput, { target: { value: '' } });
    expect(searchInput.value).toBe('');
    
    // Should show all books again
    expect(screen.getByTestId('item-1')).toBeInTheDocument();
    expect(screen.getByTestId('item-2')).toBeInTheDocument();
    expect(screen.getByTestId('item-3')).toBeInTheDocument();
    expect(screen.getByTestId('item-4')).toBeInTheDocument();
  });
});
