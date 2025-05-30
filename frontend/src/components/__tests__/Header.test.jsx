import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Header';
import { ShopContext } from '../../context/ShopContext';

// Mock the logo import
jest.mock('../../assets/logo.png', () => 'mockLogoPath');

// Mock the ShopContext
const mockNavigate = jest.fn();
const mockSetToken = jest.fn();
const mockSetCartItems = jest.fn();
const mockGetCartCount = jest.fn().mockReturnValue(2);

const mockShopContextValue = {
  navigate: mockNavigate,
  token: 'mockToken',
  setToken: mockSetToken,
  getCartCount: mockGetCartCount,
  setCartItems: mockSetCartItems
};

describe('Header Component', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <ShopContext.Provider value={mockShopContextValue}>
          <Header />
        </ShopContext.Provider>
      </BrowserRouter>
    );
  });

  test('renders the logo', () => {
    const logoElement = screen.getByAltText(''); // The img has empty alt text
    expect(logoElement).toBeInTheDocument();
  });

  test('displays correct cart count from context', () => {
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
