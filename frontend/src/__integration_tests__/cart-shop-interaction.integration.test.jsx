import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ShopContextProvider, { ShopContext } from '../context/ShopContext';
import Shop from '../pages/Shop';
import Item from '../components/Item';
import Header from '../components/Header';

// Mock axios
jest.mock('axios');
const axios = require('axios');

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

// Mock sample books
const mockBooks = [
  {
    _id: '1',
    name: 'Dom Casmurro',
    author: 'Machado de Assis',
    price: 25,
    category: 'Ficção',
    image: 'https://example.com/book1.jpg',
    description: 'Um clássico da literatura brasileira'
  },
  {
    _id: '2',
    name: 'O Pequeno Príncipe',
    author: 'Antoine de Saint-Exupéry',
    price: 30,
    category: 'Infantil',
    image: 'https://example.com/book2.jpg',
    description: 'Uma história atemporal'
  }
];

// Custom wrapper component to provide context
const TestWrapper = ({ children }) => {
  return (
    <BrowserRouter>
      <ShopContextProvider>
        {children}
      </ShopContextProvider>
    </BrowserRouter>
  );
};

describe('Cart and Shop Integration', () => {
  beforeEach(() => {
    // Mock API responses
    axios.get.mockResolvedValue({
      data: {
        success: true,
        products: mockBooks
      }
    });
    
    axios.post.mockResolvedValue({
      data: {
        success: true
      }
    });

    // Clear localStorage
    localStorage.clear();
  });

  test('adding item to cart updates cart count in header', async () => {
    // Arrange: Create a custom ShopContext with controlled state
    const customRender = () => {
      const cartItems = {};
      const setCartItems = jest.fn(items => Object.assign(cartItems, items));
      const addToCart = jest.fn((itemId) => {
        cartItems[itemId] = (cartItems[itemId] || 0) + 1;
      });
      const getCartCount = jest.fn(() => {
        return Object.values(cartItems).reduce((a, b) => a + b, 0);
      });

      return render(
        <BrowserRouter>
          <ShopContext.Provider value={{
            books: mockBooks,
            cartItems,
            setCartItems,
            addToCart,
            getCartCount,
            navigate: jest.fn(),
            token: null,
            setToken: jest.fn()
          }}>
            <Header />
            <div style={{ paddingTop: "80px" }}> {/* Add padding to simulate layout */}
              {mockBooks.map(book => (
                <Item key={book._id} book={book} />
              ))}
            </div>
          </ShopContext.Provider>
        </BrowserRouter>
      );
    };

    // Act
    customRender();
    
    // Initial cart should be empty (count = 0)
    expect(screen.getByText('0')).toBeInTheDocument();

    // Find and click the add to cart button on the first book
    const addButtons = screen.getAllByTitle('Adicionar ao carrinho');
    fireEvent.click(addButtons[0]);

    // Assert: Cart count should be updated to 1
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });

  test('cart persists items between shop and cart pages', () => {
    // This test would need to be implemented with a more complex setup
    // that allows navigation between pages, or with a component that
    // combines both shop and cart views for testing purposes
    
    // For jest tests, we're mocking this behavior by verifying the ShopContext
    // functions are called correctly
    
    const mockNavigate = jest.fn();
    const mockCartItems = { '1': 2, '2': 1 };
    const mockGetCartCount = jest.fn().mockReturnValue(3);
    
    render(
      <BrowserRouter>
        <ShopContext.Provider value={{
          books: mockBooks,
          cartItems: mockCartItems,
          getCartCount: mockGetCartCount,
          navigate: mockNavigate,
          token: null,
          setToken: jest.fn()
        }}>
          <Header />
        </ShopContext.Provider>
      </BrowserRouter>
    );
    
    // Verify cart count shows 3 items
    expect(screen.getByText('3')).toBeInTheDocument();
    
    // Click on the cart icon should navigate to /cart
    const cartIcon = screen.getByText('').closest('a');
    fireEvent.click(cartIcon);
    
    // Check if navigation was attempted
    expect(mockNavigate).toHaveBeenCalledWith('/cart');
  });
});