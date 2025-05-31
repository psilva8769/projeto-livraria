import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../components/Header';
import { ShopContext } from '../context/ShopContext';

// Mock da funcionalidade do carrinho
const mockCartItems = { '1': 2, '2': 1 };
const mockGetCartCount = jest.fn().mockReturnValue(3);
const mockNavigate = jest.fn();
const mockSetToken = jest.fn();
const mockSetCartItems = jest.fn();

describe('Integração entre Cabeçalho e Carrinho', () => {
  test('exibe a contagem correta do carrinho no cabeçalho', () => {
    render(
      <BrowserRouter>
        <ShopContext.Provider value={{
          cartItems: mockCartItems,
          getCartCount: mockGetCartCount,
          navigate: mockNavigate,
          setToken: mockSetToken,
          setCartItems: mockSetCartItems
        }}>
          <Header />
        </ShopContext.Provider>
      </BrowserRouter>
    );
    
    // Verifica se o ícone do carrinho e a contagem são exibidos corretamente
    const cartCountElement = screen.getByText('3');
    expect(cartCountElement).toBeInTheDocument();
  });

  test('navega para a página de login quando não está logado', () => {
    render(
      <BrowserRouter>
        <ShopContext.Provider value={{
          cartItems: mockCartItems,
          getCartCount: mockGetCartCount,
          navigate: mockNavigate,
          token: null,
          setToken: mockSetToken,
          setCartItems: mockSetCartItems
        }}>
          <Header />
        </ShopContext.Provider>
      </BrowserRouter>
    );
    
    // Clica no botão de login
    const loginButton = screen.getByText('Entrar');
    fireEvent.click(loginButton);
    
    // Verifica se a navegação ocorreu
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
