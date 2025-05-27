import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import Cart from '../../src/pages/Cart';
import { renderWithProviders } from '../../src/test-utils';
import { ShopContext } from '../../__tests__/mocks/ShopContextMock';

// Mock ShopContext using the mock module
jest.mock('../../src/context/ShopContext', () => {
  return require('../../__tests__/mocks/ShopContextMock');
});

// Mock icons
jest.mock('react-icons/tb', () => ({
  TbTrash: () => <div data-testid="trash-icon">TrashIcon</div>
}));

jest.mock('react-icons/fa6', () => ({
  FaMinus: () => <div data-testid="minus-icon">MinusIcon</div>,
  FaPlus: () => <div data-testid="plus-icon">PlusIcon</div>
}));

describe('Shopping Cart Integration Tests', () => {
  const mockBooks = [
    { 
      _id: '1', 
      name: 'Book 1', 
      author: 'Author 1', 
      category: 'Fiction', 
      price: 30, 
      image: '/book1.jpg' 
    },
    { 
      _id: '2', 
      name: 'Book 2', 
      author: 'Author 2', 
      category: 'Non-Fiction', 
      price: 40, 
      image: '/book2.jpg' 
    }
  ];

  const mockShopContext = {
    books: mockBooks,
    cartItems: { '1': 2, '2': 1 },
    currency: '$',
    navigate: jest.fn(),
    getCartAmount: jest.fn().mockReturnValue(100),
    updateQuantity: jest.fn(),
    delivery_charges: 5
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders cart with items', () => {
    renderWithProviders(<Cart />, { shopContextValue: mockShopContext });
    
    expect(screen.getByTestId('cart-section')).toBeInTheDocument();
    expect(screen.getByTestId('cart-title')).toBeInTheDocument();
    expect(screen.getByTestId('cart-items')).toBeInTheDocument();
    
    // Should display all cart items
    expect(screen.getByTestId('cart-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('cart-item-2')).toBeInTheDocument();
    
    // Check item details
    expect(screen.getByTestId('cart-item-name-1')).toHaveTextContent('Book 1');
    expect(screen.getByTestId('cart-item-price-1')).toHaveTextContent('$30');
  });

  test('allows increasing item quantity', () => {
    renderWithProviders(<Cart />, { shopContextValue: mockShopContext });
    
    const increaseButton = screen.getByTestId('increase-quantity-1');
    fireEvent.click(increaseButton);
    
    expect(mockShopContext.updateQuantity).toHaveBeenCalledWith('1', 3);
  });

  test('allows decreasing item quantity', () => {
    renderWithProviders(<Cart />, { shopContextValue: mockShopContext });
    
    const decreaseButton = screen.getByTestId('decrease-quantity-1');
    fireEvent.click(decreaseButton);
    
    expect(mockShopContext.updateQuantity).toHaveBeenCalledWith('1', 1);
  });

  test('allows removing item from cart', () => {
    renderWithProviders(<Cart />, { shopContextValue: mockShopContext });
    
    const removeButton = screen.getByTestId('remove-item-1');
    fireEvent.click(removeButton);
    
    expect(mockShopContext.updateQuantity).toHaveBeenCalledWith('1', 0);
  });

  test('displays cart summary when items exist', () => {
    renderWithProviders(<Cart />, { shopContextValue: mockShopContext });
    
    expect(screen.getByTestId('cart-summary')).toBeInTheDocument();
    expect(screen.getByTestId('checkout-button')).toBeInTheDocument();
    
    const checkoutButton = screen.getByTestId('checkout-button');
    fireEvent.click(checkoutButton);
    
    expect(mockShopContext.navigate).toHaveBeenCalledWith('/place-order');
  });

  test('displays empty cart message when cart is empty', () => {
    renderWithProviders(<Cart />, { 
      shopContextValue: { 
        ...mockShopContext, 
        cartItems: {} 
      }
    });
    
    expect(screen.getByTestId('empty-cart-message')).toBeInTheDocument();
    expect(screen.getByTestId('empty-cart-message')).toHaveTextContent('Your cart is empty');
    expect(screen.queryByTestId('cart-summary')).not.toBeInTheDocument();
  });
});