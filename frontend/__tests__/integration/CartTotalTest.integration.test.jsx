import React from 'react';
import { render, screen } from '@testing-library/react';
import CartTotal from '../../src/components/CartTotal';
import { ShopContext } from '../../__tests__/mocks/ShopContextMock';

// Mock ShopContext using the mock module
jest.mock('../../src/context/ShopContext', () => {
  return require('../../__tests__/mocks/ShopContextMock');
});

describe('CartTotal Integration Tests', () => {
  // Mock ShopContext values for each test
  const mockGetCartAmount = jest.fn();
  
  beforeEach(() => {
    // Reset mock function before each test
    mockGetCartAmount.mockReset();
  });
  test('renders cart total with zero amount', () => {
    // Setup mock to return 0 for cart amount
    mockGetCartAmount.mockReturnValue(0);
    
    const customContextValue = {
      getCartAmount: mockGetCartAmount,
      currency: '$'
    };

    render(
      <ShopContext.Provider value={customContextValue}>
        <CartTotal />
      </ShopContext.Provider>
    );

    // Check components are rendered
    expect(screen.getByTestId('cart-total-container')).toBeInTheDocument();
    expect(screen.getByTestId('subtotal-row')).toBeInTheDocument();
    expect(screen.getByTestId('shipping-row')).toBeInTheDocument();
    expect(screen.getByTestId('total-row')).toBeInTheDocument();    // Check amounts
    expect(screen.getByTestId('subtotal-amount')).toHaveTextContent('$0.00');
    expect(screen.getByTestId('shipping-amount')).toHaveTextContent('0.00');
    expect(screen.getByTestId('total-amount')).toHaveTextContent('$0.00');
  });  test('renders cart total with non-zero amount', () => {
    // Setup mock to return 100 for cart amount
    mockGetCartAmount.mockReturnValue(100);
    
    const customContextValue = {
      getCartAmount: mockGetCartAmount,
      currency: '$',
      delivery_charges: 5
    };

    render(
      <ShopContext.Provider value={customContextValue}>
        <CartTotal />
      </ShopContext.Provider>
    );

    // Check amounts
    expect(screen.getByTestId('subtotal-amount')).toHaveTextContent('$100.00');
    expect(screen.getByTestId('shipping-amount')).toHaveTextContent('$5.00');
    expect(screen.getByTestId('total-amount')).toHaveTextContent('$105.00');
  });
});
