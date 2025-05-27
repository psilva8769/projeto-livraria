import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../components/Header';
import { ShopContext } from '../context/ShopContext';

// Mock cart functionality
const mockCartItems = { '1': 2, '2': 1 };
const mockGetCartCount = jest.fn().mockReturnValue(3);
const mockNavigate = jest.fn();
const mockSetToken = jest.fn();
const mockSetCartItems = jest.fn();

describe('Header and Cart Integration', () => {
  test('displays correct cart count in header', () => {
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
    
    // Check if cart icon and count are displayed correctly
    const cartCountElement = screen.getByText('3');
    expect(cartCountElement).toBeInTheDocument();
  });

  test('navigates to login page when not logged in', () => {
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
    
    // Click on login button
    const loginButton = screen.getByText('Entrar');
    fireEvent.click(loginButton);
    
    // Check if navigation happened
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
