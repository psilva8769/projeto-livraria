import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Item from '../Item';
import { ShopContext } from '../../context/ShopContext';

const mockBook = {
  _id: '1',
  name: 'Dom Casmurro',
  category: 'Clássicos',
  price: 25,
  description: 'Uma das mais importantes obras da literatura brasileira, escrita por Machado de Assis.',
  image: '/images/book1.jpg'
};

const mockContextValue = {
  currency: 'R$',
  addToCart: jest.fn(),
  cartItems: {},
  getCartAmount: jest.fn(() => 0),
  delivery_charges: 10
};

const renderWithContext = (component, contextValue = mockContextValue) => {
  return render(
    <ShopContext.Provider value={contextValue}>
      {component}
    </ShopContext.Provider>
  );
};

describe('Item Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders book item with all information', () => {
    renderWithContext(<Item book={mockBook} />);
    
    // Check if book information is displayed
    expect(screen.getByText('Dom Casmurro')).toBeInTheDocument();
    expect(screen.getByText('Clássicos')).toBeInTheDocument();
    expect(screen.getByText('R$25.00')).toBeInTheDocument();
    expect(screen.getByText(/Uma das mais importantes obras/)).toBeInTheDocument();
  });

  test('renders book image with correct alt text', () => {
    renderWithContext(<Item book={mockBook} />);
    
    const image = screen.getByAltText('Imagem do livro');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/images/book1.jpg');
  });

  test('calls addToCart when add to cart button is clicked', () => {
    renderWithContext(<Item book={mockBook} />);
    
    const addToCartButton = screen.getByTitle('Adicionar ao carrinho');
    fireEvent.click(addToCartButton);
    
    expect(mockContextValue.addToCart).toHaveBeenCalledWith('1');
    expect(mockContextValue.addToCart).toHaveBeenCalledTimes(1);
  });

  test('displays rating stars', () => {
    renderWithContext(<Item book={mockBook} />);
    
    const stars = screen.getAllByText('⭐');
    expect(stars).toHaveLength(5);
    
    const rating = screen.getByText('(4.5)');
    expect(rating).toBeInTheDocument();
  });

  test('applies hover effects classes', () => {
    renderWithContext(<Item book={mockBook} />);
    
    const itemContainer = screen.getByText('Dom Casmurro').closest('.bg-white\\/80');
    expect(itemContainer).toHaveClass('group', 'hover:shadow-xl', 'transition-all');
  });

  test('renders with different currency', () => {
    const contextWithDifferentCurrency = {
      ...mockContextValue,
      currency: '$'
    };
    
    renderWithContext(<Item book={mockBook} />, contextWithDifferentCurrency);
    
    expect(screen.getByText('$25.00')).toBeInTheDocument();
  });

  test('truncates long book names correctly', () => {
    const bookWithLongName = {
      ...mockBook,
      name: 'Este é um título muito longo que deveria ser truncado na interface'
    };
    
    renderWithContext(<Item book={bookWithLongName} />);
    
    const titleElement = screen.getByText(/Este é um título muito longo/);
    expect(titleElement).toHaveClass('line-clamp-1');
  });

  test('truncates long descriptions correctly', () => {
    const bookWithLongDescription = {
      ...mockBook,
      description: 'Esta é uma descrição muito longa que deveria ser truncada na interface do usuário para manter a consistência visual e não quebrar o layout do componente.'
    };
    
    renderWithContext(<Item book={bookWithLongDescription} />);
    
    const descriptionElement = screen.getByText(/Esta é uma descrição muito longa/);
    expect(descriptionElement).toHaveClass('line-clamp-2');
  });

  test('handles missing book properties gracefully', () => {
    const incompleteBook = {
      _id: '2',
      name: 'Test Book'
    };
    
    renderWithContext(<Item book={incompleteBook} />);
    
    expect(screen.getByText('Test Book')).toBeInTheDocument();
    // Should still render without crashing
  });
});
