import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import Item from '../../src/components/Item';
import { renderWithProviders } from '../../src/test-utils';

// Mock the ShopContext module to avoid import.meta issues
jest.mock('../../src/context/ShopContext', () => {
  const React = require('react');
  // Create a context with the same name for compatibility
  const ShopContext = React.createContext();
  
  // Define mock values directly within the module factory
  const mockValues = {
    books: [
      { _id: '1', name: 'Book 1', price: 30 },
      { _id: '2', name: 'Book 2', price: 40 }
    ],
    currency: '$',
    navigate: jest.fn(),
    token: 'test-token',
    setToken: jest.fn(),
    cartItems: { '1': 2, '2': 1 },
    setCartItems: jest.fn(),
    addToCart: jest.fn(),
    getCartCount: jest.fn(() => 3),
    getCartAmount: jest.fn(() => 70),
    updateQuantity: jest.fn(),
    delivery_charges: 5,
    backendUrl: 'http://localhost:4000',
    filterCategory: '',
    setFilterCategory: jest.fn(),
    sortOrder: 'relevant',
    setSortOrder: jest.fn(),
    getCartItemCount: jest.fn(() => 3)
  };
  
  // Export the mocked context
  return {
    ShopContext,
    __esModule: true,
    default: ({ children }) => {
      return <ShopContext.Provider value={mockValues}>{children}</ShopContext.Provider>;
    }
  };
});

describe('Book Display Integration Tests', () => {
  const mockBook = {
    _id: '1',
    name: 'Test Book',
    author: 'Test Author',
    category: 'Fiction',
    price: 29.99,
    image: '/test-book.jpg',
    description: 'This is a test book description'
  };
  
  // Define mockShopContext for all tests
  const mockShopContext = {
    currency: '$',
    cartItems: {},
    addToCart: jest.fn()
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders book with all details', () => {
    const mockShopContextValue = {
      currency: '$',
      cartItems: {},
      addToCart: jest.fn()
    };
    
    renderWithProviders(<Item book={mockBook} />, {
      shopContextValue: mockShopContextValue
    });
    
    expect(screen.getByTestId('item-container')).toBeInTheDocument();
    expect(screen.getByTestId('item-image')).toBeInTheDocument();
    expect(screen.getByTestId('item-name')).toHaveTextContent('Test Book');
    expect(screen.getByTestId('item-author')).toHaveTextContent('Test Author');
    expect(screen.getByTestId('item-category')).toHaveTextContent('Fiction');
    expect(screen.getByTestId('item-price')).toHaveTextContent('$29.99');
    expect(screen.getByTestId('item-description')).toHaveTextContent('This is a test book description');
  });
  
  test('handles image loading error', () => {
    renderWithProviders(<Item book={mockBook} />, {
      shopContextValue: mockShopContext
    });
    
    const image = screen.getByTestId('item-image');
    fireEvent.error(image);
    
    // The component should set a fallback image
    expect(image.getAttribute('src')).toBe('/fallback-image.jpg');
  });

  test('allows adding book to cart', () => {
    renderWithProviders(<Item book={mockBook} />, {
      shopContextValue: mockShopContext
    });
    
    const addToCartButton = screen.getByTestId('add-to-cart-button');
    fireEvent.click(addToCartButton);
    
    expect(mockShopContext.addToCart).toHaveBeenCalledWith('1');
  });

  test('displays quantity in cart if book is already in cart', () => {
    renderWithProviders(
      <Item book={mockBook} />,
      {
        shopContextValue: {
          ...mockShopContext,
          cartItems: { '1': 3 }
        }
      }
    );
    
    expect(screen.getByTestId('cart-quantity')).toHaveTextContent('3');
  });

  test('handles missing book data gracefully', () => {
    renderWithProviders(<Item book={null} />, {
      shopContextValue: mockShopContext
    });
    
    // The component should return null when book is null
    expect(screen.queryByTestId('item-container')).not.toBeInTheDocument();
  });
  
  test('handles partial book data', () => {
    const partialBook = {
      _id: '2',
      name: 'Partial Book',
      price: 19.99
    };
    
    renderWithProviders(<Item book={partialBook} />, {
      shopContextValue: mockShopContext
    });
    
    expect(screen.getByTestId('item-name')).toHaveTextContent('Partial Book');
    expect(screen.getByTestId('item-price')).toHaveTextContent('$19.99');
    
    // These should be empty but not cause errors
    expect(screen.getByTestId('item-author')).toBeInTheDocument();
    expect(screen.getByTestId('item-category')).toBeInTheDocument();
  });
});