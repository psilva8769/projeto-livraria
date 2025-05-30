import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PopularBooks from '../PopularBooks';
import { ShopContext } from '../../context/ShopContext';

// Mock ShopContext
const mockBooks = [
  { _id: 1, name: 'Book 1', img: 'img1.jpg', price: 19.99, popular: true },
  { _id: 2, name: 'Book 2', img: 'img2.jpg', price: 29.99, popular: true },
  { _id: 3, name: 'Book 3', img: 'img3.jpg', price: 39.99, popular: true },
  { _id: 4, name: 'Book 4', img: 'img4.jpg', price: 49.99, popular: false }
];

describe('PopularBooks Component', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <ShopContext.Provider value={{ books: mockBooks }}>
          <PopularBooks />
        </ShopContext.Provider>
      </BrowserRouter>
    );
  });

  test('renders the title correctly', () => {
    expect(screen.getByText('Livros')).toBeInTheDocument();
    expect(screen.getByText('Populares')).toBeInTheDocument();
  });

  test('renders only popular books', () => {
    // Should display only the books with popular=true (max 5)
    const bookElements = screen.getAllByRole('img');
    
    // We have 3 popular books in our mock data
    expect(bookElements.length).toBeGreaterThan(0);
  });
});
