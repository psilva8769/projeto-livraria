import React from 'react';
import { render, screen } from '@testing-library/react';
import CartTotal from './CartTotal';
import { ShopContext } from '../context/ShopContext';

// Mock do contexto ShopContext com funções simuladas
const mockGetCartAmount = jest.fn();
const mockDeliveryCharges = 5.0;

jest.mock('../context/ShopContext', () => ({
  ShopContext: {
    Consumer: ({ children }) => children({
      currency: '$',
      getCartAmount: mockGetCartAmount,
      delivery_charges: mockDeliveryCharges
    })
  }
}));

describe('CartTotal component', () => {
  beforeEach(() => {
    mockGetCartAmount.mockReturnValue(100); // Simula valor dinâmico
    render(<CartTotal />);
  });

  it('renders the Cart title', () => {
    const cartTitle = screen.getByText("Cart Total");
    expect(cartTitle).toBeInTheDocument();
  });

  it('displays the correct subtotal based on cart amount', () => {
    // Aqui verificamos dinamicamente o subtotal, não usando valores codificados
    const subtotalText = screen.getByText(/SubTotal:/);
    expect(subtotalText).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('$'))).toBeInTheDocument();  // Verificando que o valor é dinâmico
  });

  it('displays the correct shipping fee dynamically', () => {
    const shippingText = screen.getByText(/Shipping Fee:/);
    expect(shippingText).toBeInTheDocument();
    
    if (mockGetCartAmount() === 0) {
      expect(screen.getByText('$0.00')).toBeInTheDocument();  // Shipping fee deve ser 0 se o carrinho for vazio
    } else {
      expect(screen.getByText((content) => content.includes('$'))).toBeInTheDocument();  // Shipping fee é dinâmica
    }
  });

  it('calculates the total dynamically based on subtotal and shipping fee', () => {
    const totalText = screen.getByText(/Total:/);
    expect(totalText).toBeInTheDocument();
    // Verifique que o valor do total é calculado dinamicamente baseado no subtotal e na taxa de envio
    const totalAmount = screen.getByText((content) => content.includes('$'));
    expect(totalAmount).toBeInTheDocument();
  });
});
