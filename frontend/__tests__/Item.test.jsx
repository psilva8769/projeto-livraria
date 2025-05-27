import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Item from '../src/components/Item';
const mockBook = {
  _id: '1',
  name: 'Test Book',
  image: 'test-image.jpg',
  category: 'fiction',
  price: 29,
  description: 'A very long test description for the book that should be long enough to test line clamping. This description should definitely be more than two lines long to properly test the line-clamp-2 class.'
};

const mockContext = {
  currency: '$',
  addToCart: jest.fn()
};

// Create a mock context
import { createContext } from 'react';
const MockShopContext = createContext();

jest.mock('../src/context/ShopContext', () => ({
  ShopContext: {
    Provider: MockShopContext.Provider,
    Consumer: MockShopContext.Consumer
  }
}));

describe('Componente Item', () => {
  // Função auxiliar para renderizar componente com contexto
  const renderWithContext = (component) => {
    return render(
      <ShopContext.Provider value={mockContext}>
        {component}
      </ShopContext.Provider>
    );
  };

  // Limpa os mocks antes de cada teste
  beforeEach(() => {
    mockContext.addToCart.mockClear();
  });
  test('should render book information correctly', () => {
    renderWithContext(<Item book={mockBook} />);
    
    // Check basic information
    expect(screen.getByText(mockBook.name)).toBeInTheDocument();
    expect(screen.getByText(mockBook.category)).toBeInTheDocument();
    expect(screen.getByText(`$${mockBook.price}.00`)).toBeInTheDocument();
    
    // Check if description is visible but truncated
    const description = screen.getByText(mockBook.description);
    expect(description).toBeInTheDocument();
    expect(description.className).toContain('line-clamp-2');
    
    // Check if image is rendered with correct attributes
    const image = screen.getByAltText('bookImg');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockBook.image);
    
    // Test shopping bag icon click
    const addToCartButton = screen.getByRole('span');
    fireEvent.click(addToCartButton);
    expect(mockContext.addToCart).toHaveBeenCalledWith(mockBook._id);
  });
  // Verifica se a imagem do livro é renderizada com os atributos corretos
  test('deve renderizar a imagem do livro com os atributos corretos', () => {
    renderWithContext(<Item book={mockBook} />);
    
    const image = screen.getByAltText('bookImg');
    expect(image).toHaveAttribute('src', mockBook.image);
    expect(image).toHaveClass('shadow-xl', 'shadow-slate-900/30', 'rounded-lg');
  });

  // Verifica se a função addToCart é chamada quando o ícone de sacola é clicado
  test('deve chamar addToCart quando o ícone de sacola é clicado', () => {
    renderWithContext(<Item book={mockBook} />);
    
    const addToCartButton = screen.getByRole('span');
    fireEvent.click(addToCartButton);
    
    expect(mockContext.addToCart).toHaveBeenCalledWith(mockBook._id);
  });
  // Verifica se as classes de estilo estão aplicadas corretamente
  test('deve aplicar as classes de estilo corretas', () => {
    renderWithContext(<Item book={mockBook} />);
    
    // Verifica o estilo do container da imagem
    const imageContainer = document.querySelector('.flexCenter.bg-primary');
    expect(imageContainer).toHaveClass('p-6', 'rounded-3xl', 'overflow-hidden');

    // Verifica o estilo do título
    const title = screen.getByText(mockBook.name);
    expect(title).toHaveClass('h4', 'line-clamp-1', '!my-0');

    // Verifica o estilo da descrição
    const description = screen.getByText(mockBook.description);
    expect(description).toHaveClass('line-clamp-2', 'py-1');
  });

  // Verifica se o ícone de sacola de compras é renderizado corretamente
  test('deve renderizar o ícone de sacola de compras', () => {
    renderWithContext(<Item book={mockBook} />);
    
    const iconContainer = document.querySelector('.flexCenter.h-8.w-8');
    expect(iconContainer).toBeInTheDocument();
    expect(iconContainer).toHaveClass('cursor-pointer', 'hover:bg-primary');
  });
  // Verifica se a categoria e o preço do livro são exibidos com o estilo correto
  test('deve exibir a categoria e o preço do livro com o estilo correto', () => {
    renderWithContext(<Item book={mockBook} />);
    
    const category = screen.getByText(mockBook.category);
    expect(category).toHaveClass('font-bold', 'capitalize');
    
    const price = screen.getByText(`R$${mockBook.price}.00`);
    expect(price).toHaveClass('h5', 'text-secondaryOne');
  });
});
