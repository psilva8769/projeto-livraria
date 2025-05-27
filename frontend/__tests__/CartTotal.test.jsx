import React from 'react';
import { render, screen } from '@testing-library/react';
import CartTotal from '../src/components/CartTotal';
// Mock do contexto com valores simulados
const mockContext = {
  currency: '$',
  getCartAmount: jest.fn(),
  delivery_charges: 5
};

// Create a mock context
import { createContext } from 'react';
const MockShopContext = createContext();

jest.mock('../src/context/ShopContext', () => ({
  ShopContext: {
    Provider: MockShopContext.Provider,
    Consumer: MockShopContext.Consumer
  }
}));

describe('Componente CartTotal', () => {
  beforeEach(() => {
    // Reseta as chamadas da função mock antes de cada teste
    mockContext.getCartAmount.mockReset();
  });

  // Função auxiliar para renderizar o componente com o contexto
  const renderWithContext = (component) => {
    return render(
      <ShopContext.Provider value={mockContext}>
        {component}
      </ShopContext.Provider>
    );
  };
  test('should render cart total with items', () => {
    mockContext.getCartAmount.mockReturnValue(100);
    renderWithContext(<CartTotal />);

    // Check section titles
    expect(screen.getByText('Cart Total')).toBeInTheDocument();
    expect(screen.getByText('SubTotal:')).toBeInTheDocument();
    expect(screen.getByText('Shipping Fee:')).toBeInTheDocument();
    expect(screen.getByText('Total:')).toBeInTheDocument();

    // Check monetary values
    expect(screen.getByText('$100.00')).toBeInTheDocument(); // Subtotal
    expect(screen.getByText('$5.00')).toBeInTheDocument(); // Shipping fee
    expect(screen.getByText('$105.00')).toBeInTheDocument(); // Total
  });
  test('should render cart total with no items', () => {
    mockContext.getCartAmount.mockReturnValue(0);
    renderWithContext(<CartTotal />);

    // Check monetary values
    expect(screen.getByText('$0.00')).toBeInTheDocument(); // Subtotal
    expect(screen.getByText('0.00')).toBeInTheDocument(); // Shipping fee (no currency symbol when 0)
    expect(screen.getByText('$0.00')).toBeInTheDocument(); // Total
  });

  // Verifica se as classes de estilo estão aplicadas corretamente  test('should render with correct style classes', () => {
    renderWithContext(<CartTotal />);
    
    const container = screen.getByTestId('cart-total');
    expect(container).toHaveClass('w-full');
    
    // Check flex containers
    const flexContainers = container.querySelectorAll('.flexBetween');
    expect(flexContainers).toHaveLength(3);
    
    // Check horizontal rules
    const horizontalRules = container.querySelectorAll('hr');
    expect(horizontalRules).toHaveLength(3);
  });
});
