import React from 'react';
import { screen } from '@testing-library/react';
import NewArrivals from '../../src/components/NewArrivals';
import { renderWithProviders } from '../../src/test-utils';
import { ShopContext } from '../../__tests__/mocks/ShopContextMock';

// Mock ShopContext using the mock module
jest.mock('../../src/context/ShopContext', () => {
  return require('../../__tests__/mocks/ShopContextMock');
});

// Mock Swiper components and styles
jest.mock('swiper/react', () => ({
  Swiper: ({ children }) => <div data-testid="new-arrivals-swiper">{children}</div>,
  SwiperSlide: ({ children }) => <div data-testid="swiper-slide">{children}</div>,
}));

jest.mock('swiper/css', () => ({}));
jest.mock('swiper/css/pagination', () => ({}));
jest.mock('swiper/modules', () => ({
  Autoplay: jest.fn(),
  Pagination: jest.fn(),
  Navigation: jest.fn(),
}));

// Mock sample books data
const mockBooks = [
  {
    _id: '1',
    name: 'New Book 1',
    author: 'Author 1',
    price: 29.99,
    image: '/book1.jpg',
    category: 'Fiction'
  },
  {
    _id: '2',
    name: 'New Book 2',
    author: 'Author 2',
    price: 19.99,
    image: '/book2.jpg',
    category: 'Non-Fiction'
  },
  {
    _id: '3',
    name: 'New Book 3',
    author: 'Author 3',
    price: 24.99,
    image: '/book3.jpg',
    category: 'Mystery'
  },
  {
    _id: '4',
    name: 'New Book 4',
    author: 'Author 4',
    price: 14.99,
    image: '/book4.jpg',
    category: 'Romance'
  },
  {
    _id: '5',
    name: 'New Book 5',
    author: 'Author 5',
    price: 34.99,
    image: '/book5.jpg',
    category: 'Science Fiction'
  }
];

describe('NewArrivals Integration Tests', () => {
  const mockShopContext = {
    books: mockBooks,
  };

  beforeEach(() => {
    renderWithProviders(<NewArrivals />, { shopContextValue: mockShopContext });
  });

  test('renders the NewArrivals section with title', () => {
    expect(screen.getByTestId('new-arrivals-section')).toBeInTheDocument();
    expect(screen.getByTestId('title-part1')).toHaveTextContent('New');
    expect(screen.getByTestId('title-part2')).toHaveTextContent('Arrivals');
  });

  test('renders Swiper component', () => {
    expect(screen.getByTestId('new-arrivals-swiper')).toBeInTheDocument();
  });

  test('renders book slides', () => {
    const slides = screen.getAllByTestId('swiper-slide');
    // The component shows only 5 books (the last 5 in reverse order)
    expect(slides.length).toBeGreaterThan(0);
    expect(slides.length).toBeLessThanOrEqual(mockBooks.length);
  });

  test('renders with proper layout structure', () => {
    const section = screen.getByTestId('new-arrivals-section');
    expect(section).toHaveClass('max-padd-container', 'py-16');
  });
});
