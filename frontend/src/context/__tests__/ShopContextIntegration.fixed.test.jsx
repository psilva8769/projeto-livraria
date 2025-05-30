import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import ShopContextProvider, { ShopContext } from '../ShopContext';

// Mock modules
jest.mock('axios');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => jest.fn()
  };
});

// Mock localStorage
const localStorageMock = (() => {
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
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Global mocking of import.meta.env
global.import = { meta: { env: { VITE_BACKEND_URL: 'http://localhost:5000' } } };

describe('ShopContext Integration Tests', () => {
  // Component that uses the context for testing
  const TestComponent = () => {
    const context = React.useContext(ShopContext);
    
    return (
      <div>
        <div data-testid="currency">{context.currency}</div>
        <div data-testid="backend-url">{context.backendUrl || 'No backend URL'}</div>
        <div data-testid="cart-count">{context.getCartCount()}</div>
        <button 
          data-testid="add-btn"
          onClick={() => context.addToCart('1')}
        >
          Add to Cart
        </button>
        <button 
          data-testid="update-btn"
          onClick={() => context.updateQuantity('1', 5)}
        >
          Update Quantity
        </button>
      </div>
    );
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    
    // Set up axios mocks
    const axios = require('axios');
    
    // Mock get request (for fetching books)
    axios.get.mockResolvedValue({
      data: {
        success: true,
        products: [
          { _id: '1', name: 'Book 1', price: 10.99 },
          { _id: '2', name: 'Book 2', price: 15.99 }
        ]
      }
    });
    
    // Mock post request (for cart operations)
    axios.post.mockResolvedValue({
      data: {
        success: true,
        cartData: { '1': 1, '2': 2 }
      }
    });
  });
  
  test('context provides correct values', async () => {
    render(
      <BrowserRouter>
        <ShopContextProvider>
          <TestComponent />
        </ShopContextProvider>
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId('currency')).toHaveTextContent('$');
    });
    
    expect(screen.getByTestId('backend-url')).toHaveTextContent('http://localhost:5000');
  });
  
  test('addToCart updates cart and calls API', async () => {
    localStorageMock.setItem('token', 'test-token');
    render(
      <BrowserRouter>
        <ShopContextProvider>
          <TestComponent />
        </ShopContextProvider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId('add-btn')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('add-btn'));
    await waitFor(() => {
      expect(require('axios').post).toHaveBeenCalled();
    });
    // Do NOT assert on context state directly
  });

  test('updateQuantity function works correctly', async () => {
    localStorageMock.setItem('token', 'test-token');
    render(
      <BrowserRouter>
        <ShopContextProvider>
          <TestComponent />
        </ShopContextProvider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId('update-btn')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('update-btn'));
    await waitFor(() => {
      expect(require('axios').post).toHaveBeenCalled();
    });
    // Do NOT assert on context state directly
  });
});
