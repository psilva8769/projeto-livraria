import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../src/test-utils';
import Cart from '../../src/pages/Cart';
import { ShopContext } from '../../__tests__/mocks/ShopContextMock';

// Mock ShopContext using the mock module
jest.mock('../../src/context/ShopContext', () => {
  return require('../../__tests__/mocks/ShopContextMock');
});

// Mock icons
jest.mock('react-icons/cg', () => ({
  CgMenuLeft: () => 'MenuIcon'
}));

jest.mock('react-icons/tb', () => ({
  TbUserCircle: () => 'UserIcon',
  TbTrash: () => 'TrashIcon'
}));

jest.mock('react-icons/ri', () => ({
  RiUserLine: () => 'UserLineIcon',
  RiShoppingBag4Line: () => 'ShoppingBagIcon'
}));

jest.mock('react-icons/fa', () => ({
  FaFacebook: () => 'FacebookIcon',
  FaTwitter: () => 'TwitterIcon'
}));

jest.mock('react-icons/fa6', () => ({
  FaMinus: () => 'MinusIcon',
  FaPlus: () => 'PlusIcon'
}));

// Mock assets
jest.mock('../../src/assets/logo.png', () => 'logo-mock');

const mockBooks = [
  {
    _id: '1',
    name: 'Test Book 1',
    author: 'Author 1',
    price: 29.99,
    image: '/test-book-1.jpg',
    category: 'Fiction'
  },
  {
    _id: '2',
    name: 'Test Book 2',
    author: 'Author 2',
    price: 19.99,
    image: '/test-book-2.jpg',
    category: 'Non-Fiction'
  }
];

const createMockShopContext = (overrides = {}) => ({
  books: mockBooks,
  currency: '$',
  cartItems: { '1': 2, '2': 1 },
  getCartAmount: jest.fn(() => 79.97),
  updateQuantity: jest.fn(),
  navigate: jest.fn(),
  ...overrides
});

describe('Cart Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });  test('renders cart with items', async () => {
    const context = createMockShopContext();
    renderWithProviders(<Cart />, { shopContextValue: context });
    
    await waitFor(() => {
      expect(screen.getByTestId('cart-section')).toBeInTheDocument();
      expect(screen.getByTestId('cart-title')).toBeInTheDocument();
      expect(screen.getByTestId('cart-items')).toBeInTheDocument();
      const cartItems = screen.getAllByTestId(/^cart-item-[0-9]+$/);
      expect(cartItems).toHaveLength(2);
    });
  });
  test('displays correct item details', async () => {
    const context = createMockShopContext();
    renderWithProviders(<Cart />, { shopContextValue: context });
    
    mockBooks.forEach(book => {
      expect(screen.getByTestId(`cart-item-${book._id}`)).toBeInTheDocument();
      expect(screen.getByTestId(`cart-item-name-${book._id}`)).toHaveTextContent(book.name);
      expect(screen.getByTestId(`cart-item-category-${book._id}`)).toHaveTextContent(book.category);
      expect(screen.getByTestId(`cart-item-price-${book._id}`)).toHaveTextContent(`${context.currency}${book.price}`);
    });
  });
  test('handles quantity updates', async () => {
    const context = createMockShopContext();
    renderWithProviders(<Cart />, { shopContextValue: context });
    
    const increaseButton = await screen.findByTestId('increase-quantity-1');
    const decreaseButton = await screen.findByTestId('decrease-quantity-1');
    
    fireEvent.click(increaseButton);
    expect(context.updateQuantity).toHaveBeenCalledWith('1', 3);
    
    fireEvent.click(decreaseButton);
    expect(context.updateQuantity).toHaveBeenCalledWith('1', 1);
  });
  test('handles item removal', async () => {
    const context = createMockShopContext();
    renderWithProviders(<Cart />, { shopContextValue: context });
    
    const removeButton = screen.getByTestId('remove-item-1');
    fireEvent.click(removeButton);
    
    expect(context.updateQuantity).toHaveBeenCalledWith('1', 0);
  });
  test('displays empty cart message when no items', async () => {
    const context = createMockShopContext({
      cartItems: {},
      books: []
    });
    
    renderWithProviders(<Cart />, { shopContextValue: context });
    
    await waitFor(() => {
      expect(screen.getByTestId('empty-cart-message')).toBeInTheDocument();
      expect(screen.queryByTestId('cart-summary')).not.toBeInTheDocument();
    });
  });
  test('navigates to checkout when proceed button clicked', async () => {
    const context = createMockShopContext();
    renderWithProviders(<Cart />, { shopContextValue: context });
    
    const checkoutButton = screen.getByTestId('checkout-button');
    fireEvent.click(checkoutButton);
    
    expect(context.navigate).toHaveBeenCalledWith('/place-order');
  });
});
