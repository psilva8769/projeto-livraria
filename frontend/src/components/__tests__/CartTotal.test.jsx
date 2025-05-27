import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CartTotal from '../CartTotal';
import { ShopContext } from '../../context/ShopContext';

const mockContextValue = {
  currency: 'R$',
  getCartAmount: jest.fn(() => 100),
  delivery_charges: 15,
  cartItems: { '1': 2, '2': 1 }
};

const renderWithContext = (contextValue = mockContextValue) => {
  return render(
    <ShopContext.Provider value={contextValue}>
      <CartTotal />
    </ShopContext.Provider>
  );
};

describe('CartTotal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders cart total with title', () => {
    renderWithContext();
    
    expect(screen.getByText('Carrinho')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
  });

  test('displays subtotal correctly', () => {
    renderWithContext();
    
    expect(screen.getByText('Subtotal:')).toBeInTheDocument();
    expect(screen.getByText('R$100.00')).toBeInTheDocument();
  });

  test('displays delivery charges when cart has items', () => {
    renderWithContext();
    
    expect(screen.getByText('Frete:')).toBeInTheDocument();
    expect(screen.getByText('R$15.00')).toBeInTheDocument();
  });

  test('shows zero delivery charges when cart is empty', () => {
    const emptyCartContext = {
      ...mockContextValue,
      getCartAmount: jest.fn(() => 0)
    };
    
    renderWithContext(emptyCartContext);
    
    expect(screen.getByText('Frete:')).toBeInTheDocument();
    expect(screen.getByText('0.00')).toBeInTheDocument();
  });

  test('calculates total correctly with items', () => {
    renderWithContext();
    
    expect(screen.getByText('Total:')).toBeInTheDocument();
    // Should display subtotal + delivery: 100 + 15 = 115
    expect(screen.getByText('R$115.00')).toBeInTheDocument();
  });

  test('shows zero total when cart is empty', () => {
    const emptyCartContext = {
      ...mockContextValue,
      getCartAmount: jest.fn(() => 0)
    };
    
    renderWithContext(emptyCartContext);
    
    expect(screen.getByText('Total:')).toBeInTheDocument();
    expect(screen.getByText('0.00')).toBeInTheDocument();
  });

  test('uses correct currency symbol', () => {
    const dollarContext = {
      ...mockContextValue,
      currency: '$'
    };
    
    renderWithContext(dollarContext);
    
    expect(screen.getByText('$100.00')).toBeInTheDocument();
    expect(screen.getByText('$15.00')).toBeInTheDocument();
    expect(screen.getByText('$115.00')).toBeInTheDocument();
  });

  test('applies correct CSS classes for styling', () => {
    renderWithContext();
    
    const container = screen.getByText('Carrinho').closest('.bg-white\\/80');
    expect(container).toHaveClass('backdrop-blur-sm', 'rounded-2xl', 'shadow-lg');
  });

  test('calls getCartAmount function', () => {
    renderWithContext();
    
    expect(mockContextValue.getCartAmount).toHaveBeenCalled();
  });

  test('handles different delivery charges', () => {
    const customDeliveryContext = {
      ...mockContextValue,
      delivery_charges: 25
    };
    
    renderWithContext(customDeliveryContext);
    
    expect(screen.getByText('R$25.00')).toBeInTheDocument();
    // Total should be 100 + 25 = 125
    expect(screen.getByText('R$125.00')).toBeInTheDocument();
  });

  test('renders gradient styling elements', () => {
    renderWithContext();
    
    // Check for gradient background classes
    const subtotalRow = screen.getByText('Subtotal:').closest('.flexBetween');
    expect(subtotalRow).toHaveClass('bg-gradient-to-r', 'from-primary/5', 'to-secondary/5');
    
    const deliveryRow = screen.getByText('Frete:').closest('.flexBetween');
    expect(deliveryRow).toHaveClass('bg-gradient-to-r', 'from-secondary/5', 'to-tertiary/5');
    
    const totalRow = screen.getByText('Total:').closest('.flexBetween');
    expect(totalRow).toHaveClass('bg-gradient-to-r', 'from-navy/10', 'to-secondary/10');
  });
});
