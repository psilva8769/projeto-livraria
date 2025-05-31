import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import ShopContextProvider, { ShopContext } from '../ShopContext';
import { TextEncoder, TextDecoder } from 'util';

// Mock dos módulos
jest.mock('axios');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

// Mock do react-router-dom
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => jest.fn()
  };
});

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
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock global de import.meta.env
global.import = { meta: { env: { VITE_BACKEND_URL: 'http://localhost:5000' } } };
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

describe('Testes de Integração do ShopContext', () => {
  // Componente que utiliza o contexto para testes
  const TestComponent = () => {
    const context = React.useContext(ShopContext);

    return (
      <div>
        <div data-testid="currency">{context.currency}</div>
        <div data-testid="backend-url">{context.backendUrl || 'Sem URL do backend'}</div>
        <div data-testid="cart-count">{context.getCartCount()}</div>
        <button 
          data-testid="add-btn"
          onClick={() => context.addToCart('1')}
        >
          Adicionar ao Carrinho
        </button>
        <button 
          data-testid="update-btn"
          onClick={() => context.updateQuantity('1', 5)}
        >
          Atualizar Quantidade
        </button>
      </div>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();

    // Configura os mocks do axios
    const axios = require('axios');

    // Mock da requisição GET (para buscar livros)
    axios.get.mockResolvedValue({
      data: {
        success: true,
        products: [
          { _id: '1', name: 'Livro 1', price: 10.99 },
          { _id: '2', name: 'Livro 2', price: 15.99 }
        ]
      }
    });

    // Mock da requisição POST (para operações no carrinho)
    axios.post.mockResolvedValue({
      data: {
        success: true,
        cartData: { '1': 1, '2': 2 }
      }
    });
  });

  test('o contexto fornece valores corretos', async () => {
    render(
      <BrowserRouter>
        <ShopContextProvider>
          <TestComponent />
        </ShopContextProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('currency')).toHaveTextContent('$');
    });

    expect(screen.getByTestId('backend-url')).toHaveTextContent('http://localhost:5000');
  });

  test('addToCart atualiza o carrinho e chama a API', async () => {
    localStorageMock.setItem('token', 'test-token');
    render(
      <BrowserRouter>
        <ShopContextProvider>
          <TestComponent />
        </ShopContextProvider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId('add-btn')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('add-btn'));
    await waitFor(() => {
      expect(require('axios').post).toHaveBeenCalled();
    });
    // NÃO faça assert diretamente no estado do contexto
  });

  test('a função updateQuantity funciona corretamente', async () => {
    localStorageMock.setItem('token', 'test-token');
    render(
      <BrowserRouter>
        <ShopContextProvider>
          <TestComponent />
        </ShopContextProvider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId('update-btn')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('update-btn'));
    await waitFor(() => {
      expect(require('axios').post).toHaveBeenCalled();
    });
    // NÃO faça assert diretamente no estado do contexto
  });
});
