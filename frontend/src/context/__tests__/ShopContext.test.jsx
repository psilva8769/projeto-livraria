import React from 'react';
import { render, act } from '@testing-library/react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';
import ShopContextProvider, { ShopContext } from '../ShopContext';

// Mock do axios
jest.mock('axios');

// Mock do localStorage
const mockLocalStorage = (function() {
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
  value: mockLocalStorage
});

// Mock do react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

// Mock dos dados de livros
const mockBooks = [
  { _id: '1', name: 'Livro 1', price: 10.99 },
  { _id: '2', name: 'Livro 2', price: 15.99 }
];

describe('ShopContext', () => {
  // Configura backendUrl para os testes
  const backendUrl = 'http://localhost:5000';

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    // Mock de respostas bem-sucedidas da API
    axios.get.mockResolvedValue({
      data: {
        success: true,
        products: mockBooks
      }
    });

    axios.post.mockResolvedValue({
      data: {
        success: true,
        cartData: { '1': 2, '2': 1 }
      }
    });

    // Garante que o backendUrl seja corretamente mockado para cada teste
    // Esta é a correção crítica para os testes que falham
    global.import = global.import || {};
    global.import.meta = global.import.meta || {};
    global.import.meta.env = global.import.meta.env || {};

    // Usa Object.defineProperty para garantir que o valor seja corretamente definido
    Object.defineProperty(global.import.meta.env, 'VITE_BACKEND_URL', {
      value: backendUrl,
      writable: true,
      configurable: true
    });
  });

  test('está definido', () => {
    expect(ShopContext).toBeDefined();
  });

  test('é um objeto de contexto válido', () => {
    expect(ShopContext.Provider).toBeDefined();
    expect(ShopContext.Consumer).toBeDefined();
  });

  test('inicializa com valores padrão', async () => {
    let contextValue;

    await act(async () => {
      render(
        <BrowserRouter>
          <ShopContextProvider>
            <ShopContext.Consumer>
              {value => {
                contextValue = value;
                return null;
              }}
            </ShopContext.Consumer>
          </ShopContextProvider>
        </BrowserRouter>
      );
    });

    expect(contextValue).toHaveProperty('currency', '$');
    expect(contextValue).toHaveProperty('delivery_charges', 5);
    expect(contextValue).toHaveProperty('token', '');
    expect(contextValue).toHaveProperty('cartItems');
    expect(typeof contextValue.addToCart).toBe('function');
    expect(typeof contextValue.getCartCount).toBe('function');
    expect(typeof contextValue.getCartAmount).toBe('function');
    expect(typeof contextValue.updateQuantity).toBe('function');
  });

  test('busca livros ao montar', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <ShopContextProvider>
            <ShopContext.Consumer>
              {value => null}
            </ShopContext.Consumer>
          </ShopContextProvider>
        </BrowserRouter>
      );
    });

    expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/api/product/list');
  });

  test('recupera token do localStorage ao montar', async () => {
    localStorage.setItem('token', 'test-token');

    await act(async () => {
      render(
        <BrowserRouter>
          <ShopContextProvider>
            <ShopContext.Consumer>
              {value => null}
            </ShopContext.Consumer>
          </ShopContextProvider>
        </BrowserRouter>
      );
    });

    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:5000/api/cart/get',
      {},
      { headers: { token: 'test-token' } }
    );
  });

  test('addToCart atualiza itens do carrinho e chama API com token', async () => {
    let contextValue;

    await act(async () => {
      render(
        <BrowserRouter>
          <ShopContextProvider>
            <ShopContext.Consumer>
              {value => {
                contextValue = value;
                return null;
              }}
            </ShopContext.Consumer>
          </ShopContextProvider>
        </BrowserRouter>
      );
    });

    // Define token
    await act(async () => {
      contextValue.setToken('test-token');
    });

    // Adiciona item ao carrinho
    await act(async () => {
      await contextValue.addToCart('1');
    });

    // Verifica se os itens do carrinho foram atualizados
    expect(contextValue.cartItems['1']).toBe(1);

    // Deve chamar API com token
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:5000/api/cart/add',
      { itemId: '1' },
      { headers: { token: 'test-token' } }
    );
  });

  test('addToCart incrementa itens existentes', async () => {
    let contextValue;

    await act(async () => {
      render(
        <BrowserRouter>
          <ShopContextProvider>
            <ShopContext.Consumer>
              {value => {
                contextValue = value;
                return null;
              }}
            </ShopContext.Consumer>
          </ShopContextProvider>
        </BrowserRouter>
      );
    });

    // Define itens iniciais do carrinho
    await act(async () => {
      contextValue.setCartItems({ '1': 1 });
    });

    // Adiciona o mesmo item novamente
    await act(async () => {
      await contextValue.addToCart('1');
    });

    // Deve incrementar a quantidade
    expect(contextValue.cartItems['1']).toBe(2);
  });

  test('getCartCount retorna contagem total correta', async () => {
    let contextValue;

    await act(async () => {
      render(
        <BrowserRouter>
          <ShopContextProvider>
            <ShopContext.Consumer>
              {value => {
                contextValue = value;
                return null;
              }}
            </ShopContext.Consumer>
          </ShopContextProvider>
        </BrowserRouter>
      );
    });

    // Define alguns itens no carrinho
    await act(async () => {
      contextValue.setCartItems({ '1': 2, '2': 3, '3': 0 });
    });

    // Deve somar apenas quantidades positivas
    expect(contextValue.getCartCount()).toBe(5);
  });

  test('getCartAmount retorna valor total correto', async () => {
    let contextValue;

    await act(async () => {
      render(
        <BrowserRouter>
          <ShopContextProvider>
            <ShopContext.Consumer>
              {value => {
                contextValue = value;
                return null;
              }}
            </ShopContext.Consumer>
          </ShopContextProvider>
        </BrowserRouter>
      );
    });

    // Aguarda os livros serem carregados
    await act(async () => {
      contextValue.books = mockBooks;
    });

    // Define alguns itens no carrinho
    await act(async () => {
      contextValue.setCartItems({ '1': 2, '2': 1 });
    });

    // Livro 1: $10.99 * 2 = $21.98
    // Livro 2: $15.99 * 1 = $15.99
    // Total: $37.97
    expect(contextValue.getCartAmount()).toBeCloseTo(37.97, 2);
  });

  test('getCartAmount lida com informações de livros ausentes de forma adequada', async () => {
    let contextValue;

    await act(async () => {
      render(
        <BrowserRouter>
          <ShopContextProvider>
            <ShopContext.Consumer>
              {value => {
                contextValue = value;
                return null;
              }}
            </ShopContext.Consumer>
          </ShopContextProvider>
        </BrowserRouter>
      );
    });

    // Salva os livros originais
    const originalBooks = [...contextValue.books];

    // Define livros como um array vazio (sem livros correspondentes)
    await act(async () => {
      contextValue.books = [];
    });

    // Define itens do carrinho com IDs que não terão livros correspondentes
    await act(async () => {
      contextValue.setCartItems({ '999': 2 }); // Usa um ID que não existe nos livros
    });

    // Deve retornar 0 se as informações do livro não forem encontradas
    expect(contextValue.getCartAmount()).toBe(0);

    // Restaura os livros para outros testes
    await act(async () => {
      contextValue.books = originalBooks;
    });
  });

  test('updateQuantity atualiza itens do carrinho e chama API com token', async () => {
    let contextValue;

    await act(async () => {
      render(
        <BrowserRouter>
          <ShopContextProvider>
            <ShopContext.Consumer>
              {value => {
                contextValue = value;
                return null;
              }}
            </ShopContext.Consumer>
          </ShopContextProvider>
        </BrowserRouter>
      );
    });

    // Define token
    await act(async () => {
      contextValue.setToken('test-token');
    });

    // Atualiza quantidade
    await act(async () => {
      await contextValue.updateQuantity('1', 5);
    });

    // Verifica se os itens do carrinho foram atualizados
    expect(contextValue.cartItems['1']).toBe(5);

    // Deve chamar API com token
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:5000/api/cart/update',
      { itemId: '1', quantity: 5 },
      { headers: { token: 'test-token' } }
    );
  });

  test('lida com erros de API de forma adequada em getProductsData', async () => {
    // Mock de erro de API
    axios.get.mockRejectedValueOnce(new Error('Erro de rede'));

    await act(async () => {
      render(
        <BrowserRouter>
          <ShopContextProvider>
            <ShopContext.Consumer>
              {value => null}
            </ShopContext.Consumer>
          </ShopContextProvider>
        </BrowserRouter>
      );
    });

    // Deve exibir toast de erro
    expect(toast.error).toHaveBeenCalledWith('Erro de rede');
  });

  test('lida com erros de API de forma adequada em updateQuantity', async () => {
    let contextValue;

    await act(async () => {
      render(
        <BrowserRouter>
          <ShopContextProvider>
            <ShopContext.Consumer>
              {value => {
                contextValue = value;
                return null;
              }}
            </ShopContext.Consumer>
          </ShopContextProvider>
        </BrowserRouter>
      );
    });

    // Define token
    await act(async () => {
      contextValue.setToken('test-token');
    });

    // Mock de erro de API para esta chamada específica
    axios.post.mockRejectedValueOnce(new Error('Falha na atualização'));

    // Atualiza quantidade
    await act(async () => {
      await contextValue.updateQuantity('1', 5);
    });

    // Deve ainda atualizar o carrinho local
    expect(contextValue.cartItems['1']).toBe(5);

    // Deve exibir toast de erro
    expect(toast.error).toHaveBeenCalledWith('Falha na atualização');
  });

  test('lida com erros de API de forma adequada em addToCart', async () => {
    let contextValue;

    await act(async () => {
      render(
        <BrowserRouter>
          <ShopContextProvider>
            <ShopContext.Consumer>
              {value => {
                contextValue = value;
                return null;
              }}
            </ShopContext.Consumer>
          </ShopContextProvider>
        </BrowserRouter>
      );
    });

    // Define token
    await act(async () => {
      contextValue.setToken('test-token');
    });

    // Mock de erro de API para esta chamada específica
    axios.post.mockRejectedValueOnce(new Error('Falha ao adicionar ao carrinho'));

    // Adiciona ao carrinho
    await act(async () => {
      await contextValue.addToCart('1');
    });

    // Deve ainda atualizar o carrinho local
    expect(contextValue.cartItems['1']).toBe(1);

    // Deve exibir toast de erro
    expect(toast.error).toHaveBeenCalledWith('Falha ao adicionar ao carrinho');
  });

  test('lida com resposta de produtos falhada', async () => {
    // Mock de resposta de API sem sucesso
    axios.get.mockResolvedValueOnce({
      data: {
        success: false,
        message: 'Falha ao buscar produtos'
      }
    });

    await act(async () => {
      render(
        <BrowserRouter>
          <ShopContextProvider>
            <ShopContext.Consumer>
              {value => null}
            </ShopContext.Consumer>
          </ShopContextProvider>
        </BrowserRouter>
      );
    });

    // Deve exibir toast de erro com a mensagem da API
    expect(toast.error).toHaveBeenCalledWith('Falha ao buscar produtos');
  });
});
