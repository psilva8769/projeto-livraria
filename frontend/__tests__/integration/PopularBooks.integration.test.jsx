import React from 'react';
import { screen } from '@testing-library/react';
import PopularBooks from '../../src/components/PopularBooks';
import { renderWithProviders } from '../../src/test-utils';
import { ShopContext } from '../../__tests__/mocks/ShopContextMock';

// Mock ShopContext using the mock module
jest.mock('../../src/context/ShopContext', () => {
  return require('../../__tests__/mocks/ShopContextMock');
});

const mockBooks = [
  {
    _id: '1',
    name: 'Popular Book 1',
    author: 'Author 1',
    price: 29.99,
    image: '/book1.jpg',
    category: 'Fiction',
    popular: true
  },
  {
    _id: '2',
    name: 'Popular Book 2',
    author: 'Author 2',
    price: 19.99,
    image: '/book2.jpg',
    category: 'Non-Fiction',
    popular: true
  },
  {
    _id: '3',
    name: 'Popular Book 3',
    author: 'Author 3',
    price: 24.99,
    image: '/book3.jpg',
    category: 'Mystery',
    popular: true
  },
  {
    _id: '4',
    name: 'Regular Book',
    author: 'Author 4',
    price: 14.99,
    image: '/book4.jpg',
    category: 'Romance',
    popular: false
  }
];

const mockShopContextValue = {
  books: mockBooks,
  currency: '$',
  addToCart: jest.fn()
};

describe('PopularBooks Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders popular books section', () => {
    renderWithProviders(<PopularBooks />, { shopContextValue: mockShopContextValue });
    
    expect(screen.getByTestId('popular-books-section')).toBeInTheDocument();
    expect(screen.getByTestId('popular-books-title')).toBeInTheDocument();
    expect(screen.getByTestId('popular-books-grid')).toBeInTheDocument();
  });

  test('displays correct section title and subtitle', () => {
    renderWithProviders(<PopularBooks />, { shopContextValue: mockShopContextValue });
    
    const titleElement = screen.getByTestId('popular-books-title');
    expect(titleElement).toHaveTextContent('Popular');
    expect(titleElement).toHaveTextContent('Books');
    expect(titleElement).toHaveTextContent('From timeless classics to modern masterpieces');
  });
  test('filters and displays only popular books', () => {
    renderWithProviders(<PopularBooks />, { shopContextValue: mockShopContextValue });
    
    const popularBooks = mockBooks.filter(book => book.popular);
    const bookElements = screen.getAllByTestId(/^item-container/);
    
    expect(bookElements).toHaveLength(popularBooks.length);
    expect(bookElements).toHaveLength(3); // We have 3 popular books in mock data
  });

  test('displays maximum of 5 popular books', () => {
    const manyPopularBooks = [
      ...mockBooks,
      ...Array(5).fill(null).map((_, i) => ({
        _id: `extra-${i}`,
        name: `Extra Book ${i}`,
        author: `Author ${i}`,
        price: 19.99,
        image: `/extra${i}.jpg`,
        category: 'Fiction',
        popular: true
      }))
    ];    const contextWithManyBooks = {
      ...mockShopContextValue,
      books: manyPopularBooks
    };

    renderWithProviders(<PopularBooks />, { shopContextValue: contextWithManyBooks });

    const bookElements = screen.getAllByTestId(/^item-container/);
    expect(bookElements).toHaveLength(5);
  });

  test('displays book details correctly', () => {
    renderWithProviders(<PopularBooks />, { shopContextValue: mockShopContextValue });
    
    const popularBooks = mockBooks.filter(book => book.popular);
    
    popularBooks.forEach(book => {
      expect(screen.getByText(book.name)).toBeInTheDocument();
      expect(screen.getByText(book.author)).toBeInTheDocument();
      expect(screen.getByText(`${mockShopContextValue.currency}${book.price}`)).toBeInTheDocument();
    });
  });

  test('handles empty books array', () => {
    const emptyContext = {
      ...mockShopContextValue,
      books: []
    };

    renderWithProviders(<PopularBooks />, { shopContextValue: emptyContext });

    const grid = screen.getByTestId('popular-books-grid');
    expect(grid).toBeEmptyDOMElement();
  });
  test('handles no popular books', () => {
    const noPopularBooksContext = {
      ...mockShopContextValue,
      books: mockBooks.map(book => ({ ...book, popular: false }))
    };

    renderWithProviders(<PopularBooks />, { shopContextValue: noPopularBooksContext });

    const grid = screen.getByTestId('popular-books-grid');
    expect(grid).toBeEmptyDOMElement();
  });
});
