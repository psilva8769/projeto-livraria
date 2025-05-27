import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import PlaceOrder from '../../src/pages/PlaceOrder';
import { renderWithProviders } from '../../src/test-utils';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShopContext } from '../../__tests__/mocks/ShopContextMock';

// Mock ShopContext using the mock module
jest.mock('../../src/context/ShopContext', () => {
  return require('../../__tests__/mocks/ShopContextMock');
});

// Mock dependencies
jest.mock('axios');
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn()
  }
}));

describe('Order Placement Integration Tests', () => {
  const mockBooks = [
    { _id: '1', name: 'Book 1', price: 30 }
  ];
  
  const mockShopContext = {
    cartItems: { '1': 1 },
    books: mockBooks,
    currency: '$',
    getCartAmount: jest.fn().mockReturnValue(30),
    delivery_charges: 5,
    setCartItems: jest.fn(),
    navigate: jest.fn(),
    token: 'test-token',
    backendUrl: 'http://localhost:4000'
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('should display delivery information form and cart total', () => {
    renderWithProviders(<PlaceOrder />, { 
      shopContextValue: mockShopContext 
    });
    
    // Check for form fields
    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Phone Number')).toBeInTheDocument();
    
    // Check for CartTotal component
    expect(screen.getByTestId('cart-total-container')).toBeInTheDocument();
    expect(screen.getByTestId('subtotal-amount')).toHaveTextContent('$30.00');
    expect(screen.getByTestId('shipping-amount')).toHaveTextContent('$5.00');
    expect(screen.getByTestId('total-amount')).toHaveTextContent('$35.00');
  });

  test('should place order successfully with COD method', async () => {
    axios.post.mockResolvedValueOnce({ 
      data: { success: true }
    });
    
    renderWithProviders(<PlaceOrder />, { 
      shopContextValue: mockShopContext 
    });
    
    // Fill the form
    fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Phone Number'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByPlaceholderText('Street'), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByPlaceholderText('City'), { target: { value: 'Anytown' } });
    fireEvent.change(screen.getByPlaceholderText('State'), { target: { value: 'CA' } });
    fireEvent.change(screen.getByPlaceholderText('Zip Code'), { target: { value: '12345' } });
    fireEvent.change(screen.getByPlaceholderText('Country'), { target: { value: 'USA' } });    // Submit the form
    const form = screen.getByTestId('order-form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(mockShopContext.setCartItems).toHaveBeenCalledWith({});
      expect(mockShopContext.navigate).toHaveBeenCalledWith('/orders');
    });
  });

  test('should handle order placement failure', async () => {
    const errorMessage = 'Order failed';
    axios.post.mockRejectedValueOnce(new Error(errorMessage));
    
    renderWithProviders(<PlaceOrder />, { 
      shopContextValue: mockShopContext 
    });
    
    // Fill the form with minimal required fields
    fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Phone Number'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByPlaceholderText('Street'), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByPlaceholderText('City'), { target: { value: 'Anytown' } });
    fireEvent.change(screen.getByPlaceholderText('State'), { target: { value: 'CA' } });
    fireEvent.change(screen.getByPlaceholderText('Zip Code'), { target: { value: '12345' } });
    fireEvent.change(screen.getByPlaceholderText('Country'), { target: { value: 'USA' } });    // Submit the form
    const form = screen.getByTestId('order-form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });
});
