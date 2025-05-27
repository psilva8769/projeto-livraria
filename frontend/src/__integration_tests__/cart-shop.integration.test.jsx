import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';
import { renderWithProviders, mockBooks, defaultContextValue } from '../utils/testUtils';

describe('Cart-Shop Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should add item to cart from shop and validate in cart page', async () => {
    const mockAddToCart = jest.fn();
    const mockContextValue = {
      ...defaultContextValue,
      cartItems: {},
      addToCart: mockAddToCart,
    };

    renderWithProviders(<App />, { 
      contextValue: mockContextValue 
    });

    // Navigate to shop
    const shopLink = await waitFor(() => screen.getByText(/shop/i));
    fireEvent.click(shopLink);

    // Find and click add to cart button for first book
    const addToCartButton = await screen.findByRole('button', { name: /adicionar ao carrinho/i });
    fireEvent.click(addToCartButton);

    expect(mockAddToCart).toHaveBeenCalledWith('1');
  });
  test('should update cart total when adding items', async () => {
    const mockContextValue = {
      ...defaultContextValue,
      cartItems: { '1': 1 },
      getCartAmount: jest.fn(() => 25), // Price of first book
    };

    renderWithProviders(
      <App />,
      { contextValue: mockContextValue }
    );

    // Navigate to cart
    const cartLink = screen.getByRole('link', { name: /cart/i });
    fireEvent.click(cartLink);

    // Check if total includes product price and delivery
    const totalElement = await screen.findByText('R$35.00');
    expect(totalElement).toBeInTheDocument();
  });
});
