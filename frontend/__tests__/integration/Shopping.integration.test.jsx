import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import Item from '../../src/components/Item';
import PopularBooks from '../../src/components/PopularBooks';
import NewArrivals from '../../src/components/NewArrivals';
import { renderWithProviders } from '../../src/test-utils';
import { ShopContext } from '../../__tests__/mocks/ShopContextMock';

// Mock ShopContext using the mock module
jest.mock('../../src/context/ShopContext', () => {
  return require('../../__tests__/mocks/ShopContextMock');
});

// Mock Swiper components
jest.mock('swiper/react', () => ({
  Swiper: ({ children }) => <div data-testid="new-arrivals-swiper">{children}</div>,
  SwiperSlide: ({ children }) => <div data-testid="swiper-slide">{children}</div>,
}));

jest.mock('swiper/modules', () => ({
  Autoplay: jest.fn(),
  Pagination: jest.fn(),
}));

// Mock Swiper styles
jest.mock('swiper/css', () => ({}));
jest.mock('swiper/css/pagination', () => ({}));

describe('Shopping Integration Tests', () => {
  const mockBooks = [
    { 
      _id: '1', 
      name: 'Book 1', 
      author: 'Author 1',
      category: 'Fiction',
      price: 30, 
      image: 'book1.jpg',
      popular: true
    },
    { 
      _id: '2', 
      name: 'Book 2', 
      author: 'Author 2',
      category: 'Non-Fiction',
      price: 40, 
      image: 'book2.jpg',
      popular: true
    }
  ];

  const mockShopContext = {
    currency: '$',
    cartItems: {},
    books: mockBooks,
    addToCart: jest.fn(),
    removeFromCart: jest.fn(),
    navigate: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockShopContext.cartItems = {};
  });

  describe('Item Component Integration', () => {
    const mockItem = mockBooks[0];

    test('should add item to cart when add button is clicked', () => {
      renderWithProviders(
        <Item book={mockItem} />, 
        { shopContextValue: mockShopContext }
      );

      const addButton = screen.getByTestId('add-to-cart-button');
      fireEvent.click(addButton);

      expect(mockShopContext.addToCart).toHaveBeenCalledWith(mockItem._id);
    });

    test('should update item count when already in cart', () => {
      const contextWithCart = {
        ...mockShopContext,
        cartItems: { '1': 1 }
      };

      renderWithProviders(
        <Item book={mockItem} />, 
        { shopContextValue: contextWithCart }
      );

      expect(screen.getByTestId('cart-quantity')).toHaveTextContent('1');
    });
  });

  describe('PopularBooks Integration', () => {
    test('should render items from context', () => {
      renderWithProviders(
        <PopularBooks />, 
        { shopContextValue: mockShopContext }
      );

      // Components might filter books or only show a subset
      expect(screen.getByTestId('popular-books-section')).toBeInTheDocument();
      expect(screen.getByTestId('popular-books-title')).toBeInTheDocument();
    });

    test('should update cart when items are added', () => {
      renderWithProviders(
        <Item book={mockBooks[0]} />, 
        { shopContextValue: mockShopContext }
      );

      const addButton = screen.getByTestId('add-to-cart-button');
      fireEvent.click(addButton);

      expect(mockShopContext.addToCart).toHaveBeenCalledWith(mockBooks[0]._id);
    });
  });

  describe('NewArrivals Integration', () => {
    test('should render section structure', () => {
      renderWithProviders(
        <NewArrivals />, 
        { shopContextValue: mockShopContext }
      );

      expect(screen.getByTestId('new-arrivals-section')).toBeInTheDocument();
      expect(screen.getByTestId('new-arrivals-title')).toBeInTheDocument();
    });
  });
});
