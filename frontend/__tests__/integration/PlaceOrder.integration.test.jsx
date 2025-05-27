import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PlaceOrder from '../../src/pages/PlaceOrder';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { renderWithProviders } from '../../src/test-utils';
import { ShopContext } from '../../__tests__/mocks/ShopContextMock';

// Mock ShopContext using the mock module
jest.mock('../../src/context/ShopContext', () => {
  return require('../../__tests__/mocks/ShopContextMock');
});

// Mock axios
jest.mock('axios');

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn()
  }
}));

describe('PlaceOrder Page Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Helper function to render component with standard context
  const renderComponent = () => {
    const mockShopContext = {
      cartItems: { '1': 2, '2': 1 },
      getCartAmount: jest.fn().mockReturnValue(70),
      delivery_charges: 5,
      currency: '$',
      token: 'test-token',
      navigate: jest.fn(),
      backendUrl: 'http://localhost:4000',
    };
    
    return renderWithProviders(<PlaceOrder />, {
      shopContextValue: mockShopContext
    });
  };

  test('renders PlaceOrder page content with form elements', () => {
    renderWithProviders(<PlaceOrder />);
    
    // Check page renders
    expect(screen.getByTestId('placeorder-page')).toBeInTheDocument();
    expect(screen.getByTestId('order-form')).toBeInTheDocument();
    
    // Check form inputs
    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Phone Number')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Street')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('City')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('State')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Zip Code')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Country')).toBeInTheDocument();
    
    // Check payment methods
    expect(screen.getByText('Cash on Delivery')).toBeInTheDocument();
    expect(screen.getByText('Stripe')).toBeInTheDocument();
    
    // Check place order button
    expect(screen.getByText('Place Order')).toBeInTheDocument();
  });

  test('allows switching between payment methods', () => {
    renderComponent();
    
    // Default payment method should be COD
    const codButton = screen.getByText('Cash on Delivery');
    const stripeButton = screen.getByText('Stripe');
    
    // COD should be selected by default
    expect(codButton.className).toContain('btn-secondary');
    expect(stripeButton.className).toContain('btn-white');
    
    // Switch to Stripe
    fireEvent.click(stripeButton);
    
    // Stripe should now be selected
    expect(stripeButton.className).toContain('btn-secondary');
    expect(codButton.className).toContain('btn-white');
    
    // Switch back to COD
    fireEvent.click(codButton);
    
    // COD should be selected again
    expect(codButton.className).toContain('btn-secondary');
    expect(stripeButton.className).toContain('btn-white');
  });
});
