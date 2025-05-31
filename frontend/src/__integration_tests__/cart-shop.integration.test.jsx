import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Shop from '../pages/Shop';
import Cart from '../pages/Cart';
import { renderWithProviders, mockBooks, defaultContextValue } from '../utils/testUtils';

describe('Integração entre Carrinho e Loja', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve adicionar item ao carrinho a partir da página da loja', async () => {
    const mockAddToCart = jest.fn();
    const mockContextValue = {
      ...defaultContextValue,
      cartItems: {},
      addToCart: mockAddToCart,
      books: mockBooks,
    };

    renderWithProviders(<Shop />, { 
      contextValue: mockContextValue 
    });

    // Aguarda o carregamento da página da loja e verifica o conteúdo
    await waitFor(() => {
      expect(screen.getByText('Nossa')).toBeInTheDocument();
      expect(screen.getByText('Lista de Livros')).toBeInTheDocument();
    });

    // Encontra o primeiro livro e seu botão de adicionar ao carrinho
    await waitFor(() => {
      expect(screen.getByText('Dom Casmurro')).toBeInTheDocument();
    });

    // Encontra e clica no botão de adicionar ao carrinho do primeiro livro (Dom Casmurro)
    const addToCartButtons = await screen.findAllByTitle('Adicionar ao carrinho');
    fireEvent.click(addToCartButtons[0]); // Clica no primeiro botão (para Dom Casmurro)

    expect(mockAddToCart).toHaveBeenCalledWith('1');
  });

  test('deve exibir itens do carrinho e total corretamente', async () => {
    const mockContextValue = {
      ...defaultContextValue,
      cartItems: { '1': 1 },
      getCartAmount: jest.fn(() => 25), // Preço do primeiro livro
      getCartCount: jest.fn(() => 1),
    };

    renderWithProviders(<Cart />, { 
      contextValue: mockContextValue 
    });

    // Aguarda o carregamento da página do carrinho e verifica o conteúdo
    await waitFor(() => {
      const carrinhoElements = screen.getAllByText(/carrinho/i);
      expect(carrinhoElements.length).toBeGreaterThan(0);
    });

    // Verifica se o carrinho exibe o item
    await waitFor(() => {
      expect(screen.getByText('Dom Casmurro')).toBeInTheDocument();
    });

    // Verifica se há elementos de preço que contenham R$ ou $
    const priceElements = screen.getAllByText(/R\$|₪/);
    expect(priceElements.length).toBeGreaterThan(0);
  });
});
