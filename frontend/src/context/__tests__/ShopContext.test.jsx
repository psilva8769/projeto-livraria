import React from 'react';
import { render, act } from '@testing-library/react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';
import ShopContextProvider, { ShopContext } from '../ShopContext';

// Mock axios
jest.mock('axios');

// Mock localStorage
const mockLocalStorage = (function() {
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

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

// Mock book data
const mockBooks = [
  { _id: '1', name: 'Book 1', price: 10.99 },
  { _id: '2', name: 'Book 2', price: 15.99 }
];

describe('ShopContext', () => {
  // Setup backendUrl for tests
  const backendUrl = 'http://localhost:5000';
  
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    // Mock successful API responses
    axios.get.mockResolvedValue({
      data: {
        success: true,
        products: mockBooks
      }
    });

    axios.post.mockResolvedValue({
      data: {
        success: true,
        cartData: { '1': 2, '2': 1 }
      }
    });
    
    // Ensure the backendUrl is properly mocked for each test
    // This is the critical fix for the failing tests
    global.import = global.import || {};
    global.import.meta = global.import.meta || {};
    global.import.meta.env = global.import.meta.env || {};
    
    // Use Object.defineProperty to ensure the value is correctly set
    Object.defineProperty(global.import.meta.env, 'VITE_BACKEND_URL', {
      value: backendUrl,
      writable: true,
      configurable: true
    });
  });

  test('is defined', () => {
    expect(ShopContext).toBeDefined();
  });

  test('is a valid context object', () => {
    expect(ShopContext.Provider).toBeDefined();
    expect(ShopContext.Consumer).toBeDefined();
  });

  test('initializes with default values', async () => {
    let contextValue;
    
    await act(async () => {
      render(
        <BrowserRouter>
          <ShopContextProvider>
            <ShopContext.Consumer>
              {value => {
                contextValue = value;
                return null;
              }}
            </ShopContext.Consumer>
          </ShopContextProvider>
        </BrowserRouter>
      );
    });

    expect(contextValue).toHaveProperty('currency', '$');
    expect(contextValue).toHaveProperty('delivery_charges', 5);
    expect(contextValue).toHaveProperty('token', '');
    expect(contextValue).toHaveProperty('cartItems');
    expect(typeof contextValue.addToCart).toBe('function');
    expect(typeof contextValue.getCartCount).toBe('function');
    expect(typeof contextValue.getCartAmount).toBe('function');
    expect(typeof contextValue.updateQuantity).toBe('function');
  });

  test('fetches books on mount', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <ShopContextProvider>
            <ShopContext.Consumer>
              {value => null}
            </ShopContext.Consumer>
          </ShopContextProvider>
        </BrowserRouter>
      );
    });

    expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/api/product/list');
  });

  test('retrieves token from localStorage on mount', async () => {
    localStorage.setItem('token', 'test-token');

    await act(async () => {
      render(
        <BrowserRouter>
          <ShopContextProvider>
            <ShopContext.Consumer>
              {value => null}
            </ShopContext.Consumer>
          </ShopContextProvider>
        </BrowserRouter>
      );
    });

    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:5000/api/cart/get',
      {},
      { headers: { token: 'test-token' } }
    );
  });

  test('addToCart updates cart items and calls API with token', async () => {
    let contextValue;
    
    await act(async () => {
      render(
        <BrowserRouter>
          <ShopContextProvider>
            <ShopContext.Consumer>
              {value => {
                contextValue = value;
                return null;
              }}
            </ShopContext.Consumer>
          </ShopContextProvider>
        </BrowserRouter>
      );
    });

    // Set token
    await act(async () => {
      contextValue.setToken('test-token');
    });

    // Add item to cart
    await act(async () => {
      await contextValue.addToCart('1');
    });

    // Check if cart items were updated
    expect(contextValue.cartItems['1']).toBe(1);

    // Should call API with token
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:5000/api/cart/add',
      { itemId: '1' },
      { headers: { token: 'test-token' } }
    );
  });

  test('addToCart increments existing items', async () => {
    let contextValue;
    
    await act(async () => {
      render(
        <BrowserRouter>
          <ShopContextProvider>
            <ShopContext.Consumer>
              {value => {
                contextValue = value;
                return null;
              }}
            </ShopContext.Consumer>
          </ShopContextProvider>
        </BrowserRouter>
      );
    });

    // Set initial cart items
    await act(async () => {
      contextValue.setCartItems({ '1': 1 });
    });

    // Add the same item again
    await act(async () => {
      await contextValue.addToCart('1');
    });

    // Should increment the count
    expect(contextValue.cartItems['1']).toBe(2);
  });

  test('getCartCount returns correct total count', async () => {
    let contextValue;
    
    await act(async () => {
      render(
        <BrowserRouter>
          <ShopContextProvider>
            <ShopContext.Consumer>
              {value => {
                contextValue = value;
                return null;
              }}
            </ShopContext.Consumer>
          </ShopContextProvider>
        </BrowserRouter>
      );
    });

    // Set some items in the cart
    await act(async () => {
      contextValue.setCartItems({ '1': 2, '2': 3, '3': 0 });
    });

    // Should sum only positive quantities
    expect(contextValue.getCartCount()).toBe(5);
  });

  test('getCartAmount returns correct total amount', async () => {
    let contextValue;
    
    await act(async () => {
      render(
        <BrowserRouter>
          <ShopContextProvider>
            <ShopContext.Consumer>
              {value => {
                contextValue = value;
                return null;
              }}
            </ShopContext.Consumer>
          </ShopContextProvider>
        </BrowserRouter>
      );
    });

    // Wait for books to be loaded
    await act(async () => {
      contextValue.books = mockBooks;
    });

    // Set some items in the cart
    await act(async () => {
      contextValue.setCartItems({ '1': 2, '2': 1 });
    });

    // Book 1: $10.99 * 2 = $21.98
    // Book 2: $15.99 * 1 = $15.99
    // Total: $37.97
    expect(contextValue.getCartAmount()).toBeCloseTo(37.97, 2);
  });

  test('getCartAmount handles missing book info gracefully', async () => {
    let contextValue;
    
    await act(async () => {
      render(
        <BrowserRouter>
          <ShopContextProvider>
            <ShopContext.Consumer>
              {value => {
                contextValue = value;
                return null;
              }}
            </ShopContext.Consumer>
          </ShopContextProvider>
        </BrowserRouter>
      );
    });

    // Save original books
    const originalBooks = [...contextValue.books];
    
    // Set books to an empty array (no matching books)
    await act(async () => {
      contextValue.books = [];
    });

    // Set cart items with IDs that won't have matching books
    await act(async () => {
      contextValue.setCartItems({ '999': 2 }); // Use an ID that does not exist in books
    });

    // Should return 0 if book info not found
    expect(contextValue.getCartAmount()).toBe(0);
    
    // Restore books for other tests
    await act(async () => {
      contextValue.books = originalBooks;
    });
  });

  test('updateQuantity updates cart items and calls API with token', async () => {
    let contextValue;
    
    await act(async () => {
      render(
        <BrowserRouter>
          <ShopContextProvider>
            <ShopContext.Consumer>
              {value => {
                contextValue = value;
                return null;
              }}
            </ShopContext.Consumer>
          </ShopContextProvider>
        </BrowserRouter>
      );
    });

    // Set token
    await act(async () => {
      contextValue.setToken('test-token');
    });

    // Update quantity
    await act(async () => {
      await contextValue.updateQuantity('1', 5);
    });

    // Check if cart items were updated
    expect(contextValue.cartItems['1']).toBe(5);

    // Should call API with token
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:5000/api/cart/update',
      { itemId: '1', quantity: 5 },
      { headers: { token: 'test-token' } }
    );
  });

  test('handles API errors gracefully in getProductsData', async () => {
    // Mock API error
    axios.get.mockRejectedValueOnce(new Error('Network error'));

    await act(async () => {
      render(
        <BrowserRouter>
          <ShopContextProvider>
            <ShopContext.Consumer>
              {value => null}
            </ShopContext.Consumer>
          </ShopContextProvider>
        </BrowserRouter>
      );
    });

    // Should show error toast
    expect(toast.error).toHaveBeenCalledWith('Network error');
  });

  test('handles API errors gracefully in updateQuantity', async () => {
    let contextValue;
    
    await act(async () => {
      render(
        <BrowserRouter>
          <ShopContextProvider>
            <ShopContext.Consumer>
              {value => {
                contextValue = value;
                return null;
              }}
            </ShopContext.Consumer>
          </ShopContextProvider>
        </BrowserRouter>
      );
    });

    // Set token
    await act(async () => {
      contextValue.setToken('test-token');
    });

    // Mock API error for this specific call
    axios.post.mockRejectedValueOnce(new Error('Update failed'));

    // Update quantity
    await act(async () => {
      await contextValue.updateQuantity('1', 5);
    });

    // Should still update local cart
    expect(contextValue.cartItems['1']).toBe(5);

    // Should show error toast
    expect(toast.error).toHaveBeenCalledWith('Update failed');
  });

  test('handles API errors gracefully in addToCart', async () => {
    let contextValue;
    
    await act(async () => {
      render(
        <BrowserRouter>
          <ShopContextProvider>
            <ShopContext.Consumer>
              {value => {
                contextValue = value;
                return null;
              }}
            </ShopContext.Consumer>
          </ShopContextProvider>
        </BrowserRouter>
      );
    });

    // Set token
    await act(async () => {
      contextValue.setToken('test-token');
    });

    // Mock API error for this specific call
    axios.post.mockRejectedValueOnce(new Error('Add to cart failed'));

    // Add to cart
    await act(async () => {
      await contextValue.addToCart('1');
    });

    // Should still update local cart
    expect(contextValue.cartItems['1']).toBe(1);

    // Should show error toast
    expect(toast.error).toHaveBeenCalledWith('Add to cart failed');
  });

  test('handles failed product response', async () => {
    // Mock unsuccessful API response
    axios.get.mockResolvedValueOnce({
      data: {
        success: false,
        message: 'Failed to fetch products'
      }
    });

    await act(async () => {
      render(
        <BrowserRouter>
          <ShopContextProvider>
            <ShopContext.Consumer>
              {value => null}
            </ShopContext.Consumer>
          </ShopContextProvider>
        </BrowserRouter>
      );
    });

    // Should show error toast with the message from API
    expect(toast.error).toHaveBeenCalledWith('Failed to fetch products');
  });
});
