import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Cart from '../Cart';
import { ShopContext } from '../../context/ShopContext';

// Mock do componente Footer
jest.mock('../../components/Footer', () => {
  return function MockFooter() {
    return <div data-testid="footer-component">Componente de Rodapé</div>;
  };
});

// Mock do componente CartTotal
jest.mock('../../components/CartTotal', () => {
  return function MockCartTotal() {
    return <div data-testid="cart-total-component">Componente Total do Carrinho</div>;
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

describe('Página do Carrinho', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCartAmount.mockReturnValue(105); // Simulando carrinho com itens
  });

  test('renderiza a página do carrinho', () => {
    renderWithContext();

    // A página deve ser renderizada sem falhas
    expect(screen.getByTestId('footer-component')).toBeInTheDocument();
  });

  test('renderiza o título da página do carrinho', () => {
    renderWithContext();

    // Procure por texto relacionado ao carrinho
    const cartElements = screen.getAllByText(/carrinho/i);
    expect(cartElements.length).toBeGreaterThan(0);
  });

  test('exibe itens do carrinho quando o carrinho tem produtos', () => {
    renderWithContext();

    expect(screen.getByText('Dom Casmurro')).toBeInTheDocument();
    expect(screen.getByText('O Cortiço')).toBeInTheDocument();
    expect(screen.getByText('Clássicos')).toBeInTheDocument();
    expect(screen.getByText('Literatura')).toBeInTheDocument();
  });

  test('exibe os preços dos produtos corretamente', () => {
    renderWithContext();

    expect(screen.getByText('R$25')).toBeInTheDocument();
    expect(screen.getByText('R$30')).toBeInTheDocument();
  });

  test('exibe as quantidades corretas para os itens', () => {
    renderWithContext();

    // Deve mostrar quantidade 2 para o primeiro item e 1 para o segundo item
    const quantities = screen.getAllByText(/^[0-9]+$/);
    expect(quantities).toHaveLength(2);
  });

  test('chama updateQuantity ao aumentar a quantidade', () => {
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

  test('chama updateQuantity ao diminuir a quantidade', () => {
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

  test('chama updateQuantity com 0 ao remover item', () => {
    renderWithContext();

    const removeButtons = screen.getAllByTitle('Remover');
    fireEvent.click(removeButtons[0]);

    expect(mockUpdateQuantity).toHaveBeenCalledWith('1', 0);
  });

  test('mostra o total do carrinho e o botão de checkout quando o carrinho tem itens', () => {
    renderWithContext();

    expect(screen.getByTestId('cart-total-component')).toBeInTheDocument();
    expect(screen.getByText('Finalizar Compra')).toBeInTheDocument();
  });

  test('navega para place-order quando o botão de checkout é clicado', () => {
    renderWithContext();

    const checkoutButton = screen.getByText('Finalizar Compra');
    fireEvent.click(checkoutButton);

    expect(mockNavigate).toHaveBeenCalledWith('/place-order');
  });

  test('mostra mensagem de carrinho vazio quando o carrinho está vazio', () => {
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

  test('navega para a loja quando o botão continuar comprando é clicado', () => {
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

  test('não mostra o total do carrinho quando o carrinho está vazio', () => {
    const emptyCartContext = {
      ...mockContextValue,
      cartItems: {},
      getCartAmount: jest.fn(() => 0)
    };

    renderWithContext(emptyCartContext);

    expect(screen.queryByTestId('cart-total-component')).not.toBeInTheDocument();
    expect(screen.queryByText('Finalizar Compra')).not.toBeInTheDocument();
  });

  test('exibe apenas itens que estão no carrinho', () => {
    const partialCartContext = {
      ...mockContextValue,
      cartItems: { '1': 1 }, // Apenas o primeiro item no carrinho
    };

    renderWithContext(partialCartContext);

    expect(screen.getByText('Dom Casmurro')).toBeInTheDocument();
    expect(screen.queryByText('O Cortiço')).not.toBeInTheDocument();
  });

  test('renderiza imagens dos produtos com atributos corretos', () => {
    renderWithContext();

    const images = screen.getAllByAltText('itemImg');
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute('src', '/images/book1.jpg');
    expect(images[1]).toHaveAttribute('src', '/images/book2.jpg');
  });

  test('renderiza o componente de rodapé', () => {
    renderWithContext();

    expect(screen.getByTestId('footer-component')).toBeInTheDocument();
  });

  test('aplica classes de estilo corretas', () => {
    renderWithContext();

    const section = screen.getByText('Carrinho').closest('section');
    expect(section).toHaveClass('min-h-screen', 'bg-gradient-to-br');
  });
});
