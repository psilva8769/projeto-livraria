import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import Item from '../../src/components/Item';
import { renderWithProviders } from '../../src/test-utils';
import { ShopContext } from '../../__tests__/mocks/ShopContextMock';

// Mock ShopContext using the mock module
jest.mock('../../src/context/ShopContext', () => {
  return require('../../__tests__/mocks/ShopContextMock');
});

const mockBook = {
  _id: '1',
  name: 'Test Book',
  author: 'Test Author',
  price: 29.99,
  image: '/test-book.jpg',
  category: 'Fiction',
  description: 'A test book description'
};

const mockShopContextValue = {
  currency: '$',
  addToCart: jest.fn(),
  cartItems: {}
};

describe('Item Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders item with correct book information', () => {
    renderWithProviders(<Item book={mockBook} />, { shopContextValue: mockShopContextValue });

    expect(screen.getByTestId('item-container')).toBeInTheDocument();
    expect(screen.getByTestId('item-image')).toHaveAttribute('src', mockBook.image);
    expect(screen.getByTestId('item-name')).toHaveTextContent(mockBook.name);
    expect(screen.getByTestId('item-author')).toHaveTextContent(mockBook.author);
    expect(screen.getByTestId('item-price')).toHaveTextContent(`${mockShopContextValue.currency}${mockBook.price}`);
  });

  test('calls addToCart when add to cart button is clicked', () => {
    renderWithProviders(<Item book={mockBook} />, { shopContextValue: mockShopContextValue });

    const addToCartButton = screen.getByTestId('add-to-cart-button');    fireEvent.click(addToCartButton);

    expect(mockShopContextValue.addToCart).toHaveBeenCalledWith(mockBook._id);
  });

  test('displays correct cart status when item is in cart', () => {
    const contextWithItemInCart = {
      ...mockShopContextValue,
      cartItems: { [mockBook._id]: 2 }
    };

    renderWithProviders(<Item book={mockBook} />, { shopContextValue: contextWithItemInCart });

    expect(screen.getByTestId('cart-quantity')).toHaveTextContent('2');
  });

  test('handles image loading error gracefully', () => {
    const bookWithInvalidImage = {
      ...mockBook,
      image: 'invalid-image.jpg'
    };

    renderWithProviders(<Item book={bookWithInvalidImage} />, { shopContextValue: mockShopContextValue });
    
    const image = screen.getByTestId('item-image');
    fireEvent.error(image);

    expect(image).toHaveAttribute('src', '/fallback-image.jpg');
  });
  test('truncates long book names', () => {
    const bookWithLongName = {
      ...mockBook,
      name: 'This is a very long book name that should be truncated in the display'
    };

    renderWithProviders(<Item book={bookWithLongName} />, { shopContextValue: mockShopContextValue });
    
    const nameElement = screen.getByTestId('item-name');
    expect(nameElement).toHaveClass('line-clamp-2');
  });
});
