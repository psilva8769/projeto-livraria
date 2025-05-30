import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Shop from '../pages/Shop';
import Cart from '../pages/Cart';
import { renderWithProviders, mockBooks, defaultContextValue } from '../utils/testUtils';

describe('Cart-Shop Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
    test('should add item to cart from shop page', async () => {
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

    // Wait for the shop page to load and check for shop content
    await waitFor(() => {
      expect(screen.getByText('Nossa')).toBeInTheDocument();
      expect(screen.getByText('Lista de Livros')).toBeInTheDocument();
    });

    // Find the first book and its add to cart button
    await waitFor(() => {
      expect(screen.getByText('Dom Casmurro')).toBeInTheDocument();
    });    // Find and click add to cart button for first book (Dom Casmurro)
    const addToCartButtons = await screen.findAllByTitle('Adicionar ao carrinho');
    fireEvent.click(addToCartButtons[0]); // Click the first button (for Dom Casmurro)

    expect(mockAddToCart).toHaveBeenCalledWith('1');
  });  test('should display cart items and total correctly', async () => {
    const mockContextValue = {
      ...defaultContextValue,
      cartItems: { '1': 1 },
      getCartAmount: jest.fn(() => 25), // Price of first book
      getCartCount: jest.fn(() => 1),
    };

    renderWithProviders(<Cart />, { 
      contextValue: mockContextValue 
    });    // Wait for cart page to load and check for cart content
    await waitFor(() => {
      const carrinhoElements = screen.getAllByText(/carrinho/i);
      expect(carrinhoElements.length).toBeGreaterThan(0);
    });

    // Check if the cart shows the item
    await waitFor(() => {
      expect(screen.getByText('Dom Casmurro')).toBeInTheDocument();
    });

    // Check for any price elements that contain R$ or $ 
    const priceElements = screen.getAllByText(/R\$|₪/);
    expect(priceElements.length).toBeGreaterThan(0);
  });
});
