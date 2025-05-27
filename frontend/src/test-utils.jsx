import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ShopContext } from './context/ShopContext';

const defaultShopContext = {
    books: [],
    currency: '$',
    navigate: jest.fn(),
    token: '',
    setToken: jest.fn(),
    cartItems: {},
    setCartItems: jest.fn(),
    addToCart: jest.fn(),
    getCartCount: jest.fn(() => 0),
    getCartAmount: jest.fn(() => 0),
    updateQuantity: jest.fn(),
    delivery_charges: 5,
    backendUrl: 'http://localhost:4000',
    filterCategory: [],
    setFilterCategory: jest.fn(),
    sortOrder: 'relevant',
    setSortOrder: jest.fn(),
    getCartItemCount: jest.fn(() => 0)
};

export function renderWithProviders(
    ui,
    {
        shopContextValue = defaultShopContext,
        ...renderOptions
    } = {}
) {
    function Wrapper({ children }) {
        return (
            <BrowserRouter>
                <ShopContext.Provider value={shopContextValue}>
                    {children}
                </ShopContext.Provider>
            </BrowserRouter>
        );
    }
    return render(ui, { wrapper: Wrapper, ...renderOptions });
}
