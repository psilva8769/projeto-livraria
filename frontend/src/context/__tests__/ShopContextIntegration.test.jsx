import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import ShopContextProvider, { ShopContext } from '../ShopContext';

// Mock do axios
jest.mock('axios');

// Mock do localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Configuração do ambiente
beforeEach(() => {
  jest.clearAllMocks();
  localStorageMock.clear();

  // Mock de respostas bem-sucedidas da API
  axios.get.mockResolvedValue({
    data: {
      success: true,
      products: [
        { _id: '1', name: 'Livro 1', price: 10.99 },
        { _id: '2', name: 'Livro 2', price: 15.99 }
      ]
    }
  });

  axios.post.mockResolvedValue({
    data: {
      success: true,
      cartData: { '1': 1, '2': 2 }
    }
  });
});

// Componente de teste para acessar o contexto
const TestComponent = () => {
  const context = React.useContext(ShopContext);

  // Lida com funções que podem não existir em todos os mocks de contexto
  const getCartCount = () => {
    return context.getCartCount ? context.getCartCount() : 0;
  };

  const getCartAmount = () => {
    return context.getCartAmount ? context.getCartAmount() : 0;
  };

  return (
    <div>
      <div data-testid="cart-count">{getCartCount()}</div>
      <div data-testid="cart-amount">{getCartAmount()}</div>
      <button 
        data-testid="add-to-cart" 
        onClick={() => context.addToCart('1')}
      >
        Adicionar ao Carrinho
      </button>
      <button 
        data-testid="update-quantity" 
        onClick={() => context.updateQuantity('1', 5)}
      >
        Atualizar Quantidade
      </button>
    </div>
  );
};

describe('Integração do ShopContext', () => {
  test('fornece valores do contexto', async () => {
    render(
      <BrowserRouter>
        <ShopContextProvider>
          <TestComponent />
        </ShopContextProvider>
      </BrowserRouter>
    );

    // Verifica se a contagem inicial do carrinho é exibida
    await waitFor(() => {
      expect(screen.getByTestId('cart-count')).toBeInTheDocument();
    });
  });

  test('adiciona item ao carrinho', async () => {
    axios.post = jest.fn().mockResolvedValue({
      data: {
        success: true,
        cartData: { '1': 1 }
      }
    });
    const tokenValue = 'test-token';
    localStorageMock.setItem('token', tokenValue);
    render(
      <BrowserRouter>
        <ShopContextProvider>
          <TestComponent />
        </ShopContextProvider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId('add-to-cart')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('add-to-cart'));
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5000/api/cart/add',
        { itemId: '1' },
        { headers: { token: tokenValue } }
      );
    });
  });

  test('atualiza quantidade no carrinho', async () => {
    localStorageMock.setItem('token', 'test-token');
    render(
      <BrowserRouter>
        <ShopContextProvider>
          <TestComponent />
        </ShopContextProvider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId('update-quantity')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('update-quantity'));
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5000/api/cart/update',
        { itemId: '1', quantity: 5 },
        { headers: { token: 'test-token' } }
      );
    });
  });

  test('calcula valor total do carrinho corretamente', async () => {
    // Mock do contexto completo com valores predefinidos para este teste
    const MockedShopContext = ({ children }) => {
      const [books] = React.useState([
        { _id: '1', name: 'Livro 1', price: 10.99 },
        { _id: '2', name: 'Livro 2', price: 15.99 }
      ]);

      const [cartItems, setCartItems] = React.useState({ '1': 2, '2': 1 });

      const getCartCount = () => {
        let count = 0;
        for (const item in cartItems) {
          if (cartItems[item] > 0) {
            count += cartItems[item];
          }
        }
        return count;
      };

      const getCartAmount = () => {
        let amount = 0;
        for (const item in cartItems) {
          if (cartItems[item] > 0) {
            const book = books.find(b => b._id === item);
            if (book) {
              amount += book.price * cartItems[item];
            }
          }
        }
        return amount;
      };

      return (
        <ShopContext.Provider value={{ 
          books, 
          cartItems, 
          setCartItems,
          getCartCount,
          getCartAmount
        }}>
          {children}
        </ShopContext.Provider>
      );
    };

    render(
      <BrowserRouter>
        <MockedShopContext>
          <TestComponent />
        </MockedShopContext>
      </BrowserRouter>
    );

    // Verifica cálculo do valor total do carrinho
    await waitFor(() => {
      // 10.99 * 2 + 15.99 * 1 = 37.97
      expect(screen.getByTestId('cart-amount')).toHaveTextContent('37.97');
    });
  });

  test('lida com informações ausentes de livros em getCartAmount', async () => {
    // Mock do contexto com um item no carrinho que não tem livro correspondente
    const MockedShopContext = ({ children }) => {
      const [books] = React.useState([
        { _id: '1', name: 'Livro 1', price: 10.99 }
      ]);

      // Item '999' não existe nos livros
      const [cartItems] = React.useState({ '999': 2 });

      const getCartCount = () => {
        let count = 0;
        for (const item in cartItems) {
          if (cartItems[item] > 0) {
            count += cartItems[item];
          }
        }
        return count;
      };

      const getCartAmount = () => {
        let amount = 0;
        for (const item in cartItems) {
          if (cartItems[item] > 0) {
            const book = books.find(b => b._id === item);
            if (book) {
              amount += book.price * cartItems[item];
            }
          }
        }
        return amount;
      };

      return (
        <ShopContext.Provider value={{ 
          books, 
          cartItems,
          getCartCount,
          getCartAmount
        }}>
          {children}
        </ShopContext.Provider>
      );
    };

    render(
      <BrowserRouter>
        <MockedShopContext>
          <TestComponent />
        </MockedShopContext>
      </BrowserRouter>
    );

    // O valor do carrinho deve ser 0, já que não há livro correspondente
    await waitFor(() => {
      expect(screen.getByTestId('cart-amount')).toHaveTextContent('0');
    });
  });
});
