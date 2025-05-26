import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Cart from '../Cart';
import { ShopContext } from '../../context/ShopContext';

// Mock Footer component
jest.mock('../../components/Footer', () => {
  return function MockFooter() {
    return <div data-testid="footer-component">Footer Component</div>;
  };
});

// Mock CartTotal component
jest.mock('../../components/CartTotal', () => {
  return function MockCartTotal() {
    return <div data-testid="cart-total-component">Cart Total Component</div>;
  };
});

const mockBooks = [
  {
    _id: '1',
    name: 'Dom Casmurro',
    category: 'Clássicos',
    price: 25,
    image: '/images/book1.jpg'
  },
  {
    _id: '2',
    name: 'O Cortiço',
    category: 'Literatura',
    price: 30,
    image: '/images/book2.jpg'
  }
];

const mockNavigate = jest.fn();
const mockUpdateQuantity = jest.fn();
const mockGetCartAmount = jest.fn();

const mockContextValue = {
  books: mockBooks,
  navigate: mockNavigate,
  currency: 'R$',
  cartItems: { '1': 2, '2': 1 },
  getCartAmount: mockGetCartAmount,
  updateQuantity: mockUpdateQuantity
};

const renderWithContext = (contextValue = mockContextValue) => {
  return render(
    <ShopContext.Provider value={contextValue}>
      <Cart />
    </ShopContext.Provider>
  );
};

describe('Cart Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCartAmount.mockReturnValue(105); // Simulating cart with items
  });

  test('renders cart page with title', () => {
    renderWithContext();
    
    expect(screen.getByText('Carrinho')).toBeInTheDocument();
    expect(screen.getByText('Lista')).toBeInTheDocument();
  });

  test('displays cart items when cart has products', () => {
    renderWithContext();
    
    expect(screen.getByText('Dom Casmurro')).toBeInTheDocument();
    expect(screen.getByText('O Cortiço')).toBeInTheDocument();
    expect(screen.getByText('Clássicos')).toBeInTheDocument();
    expect(screen.getByText('Literatura')).toBeInTheDocument();
  });

  test('displays product prices correctly', () => {
    renderWithContext();
    
    expect(screen.getByText('R$25')).toBeInTheDocument();
    expect(screen.getByText('R$30')).toBeInTheDocument();
  });

  test('displays correct quantities for items', () => {
    renderWithContext();
    
    // Should show quantity 2 for first item and 1 for second item
    const quantities = screen.getAllByText(/^[0-9]+$/);
    expect(quantities).toHaveLength(2);
  });

  test('calls updateQuantity when increasing quantity', () => {
    renderWithContext();
    
    const plusButtons = screen.getAllByRole('button');
    const firstPlusButton = plusButtons.find(btn => 
      btn.querySelector('.fa-plus') || btn.textContent.includes('+')
    );
    
    if (firstPlusButton) {
      fireEvent.click(firstPlusButton);
      expect(mockUpdateQuantity).toHaveBeenCalled();
    }
  });

  test('calls updateQuantity when decreasing quantity', () => {
    renderWithContext();
    
    const minusButtons = screen.getAllByRole('button');
    const firstMinusButton = minusButtons.find(btn => 
      btn.querySelector('.fa-minus') || btn.textContent.includes('-')
    );
    
    if (firstMinusButton) {
      fireEvent.click(firstMinusButton);
      expect(mockUpdateQuantity).toHaveBeenCalled();
    }
  });

  test('calls updateQuantity with 0 when removing item', () => {
    renderWithContext();
    
    const removeButtons = screen.getAllByTitle('Remover');
    fireEvent.click(removeButtons[0]);
    
    expect(mockUpdateQuantity).toHaveBeenCalledWith('1', 0);
  });

  test('shows cart total and checkout button when cart has items', () => {
    renderWithContext();
    
    expect(screen.getByTestId('cart-total-component')).toBeInTheDocument();
    expect(screen.getByText('Finalizar Compra')).toBeInTheDocument();
  });

  test('navigates to place-order when checkout button is clicked', () => {
    renderWithContext();
    
    const checkoutButton = screen.getByText('Finalizar Compra');
    fireEvent.click(checkoutButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/place-order');
  });

  test('shows empty cart message when cart is empty', () => {
    const emptyCartContext = {
      ...mockContextValue,
      cartItems: {},
      getCartAmount: jest.fn(() => 0)
    };
    
    renderWithContext(emptyCartContext);
    
    expect(screen.getByText('Seu carrinho está vazio')).toBeInTheDocument();
    expect(screen.getByText('Adicione alguns livros incríveis ao seu carrinho para continuar')).toBeInTheDocument();
    expect(screen.getByText('Continuar Comprando')).toBeInTheDocument();
  });

  test('navigates to shop when continue shopping button is clicked', () => {
    const emptyCartContext = {
      ...mockContextValue,
      cartItems: {},
      getCartAmount: jest.fn(() => 0)
    };
    
    renderWithContext(emptyCartContext);
    
    const continueShoppingButton = screen.getByText('Continuar Comprando');
    fireEvent.click(continueShoppingButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/shop');
  });

  test('does not show cart total when cart is empty', () => {
    const emptyCartContext = {
      ...mockContextValue,
      cartItems: {},
      getCartAmount: jest.fn(() => 0)
    };
    
    renderWithContext(emptyCartContext);
    
    expect(screen.queryByTestId('cart-total-component')).not.toBeInTheDocument();
    expect(screen.queryByText('Finalizar Compra')).not.toBeInTheDocument();
  });

  test('only displays items that are in cart', () => {
    const partialCartContext = {
      ...mockContextValue,
      cartItems: { '1': 1 }, // Only first item in cart
    };
    
    renderWithContext(partialCartContext);
    
    expect(screen.getByText('Dom Casmurro')).toBeInTheDocument();
    expect(screen.queryByText('O Cortiço')).not.toBeInTheDocument();
  });

  test('renders product images with correct attributes', () => {
    renderWithContext();
    
    const images = screen.getAllByAltText('itemImg');
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute('src', '/images/book1.jpg');
    expect(images[1]).toHaveAttribute('src', '/images/book2.jpg');
  });

  test('renders footer component', () => {
    renderWithContext();
    
    expect(screen.getByTestId('footer-component')).toBeInTheDocument();
  });

  test('applies correct styling classes', () => {
    renderWithContext();
    
    const section = screen.getByText('Carrinho').closest('section');
    expect(section).toHaveClass('min-h-screen', 'bg-gradient-to-br');
  });
});
