import React from 'react';
import { render, screen } from '@testing-library/react';
import PopularBooks from '../src/components/PopularBooks';
import { ShopContext } from '../src/context/ShopContext';

// Mock do componente Item
jest.mock('../src/components/Item', () => {
  return function MockItem({ book }) {
    return <div data-testid="item-component">{book.name}</div>;
  };
});

const mockBooks = [
  { _id: '1', name: 'Livro Popular 1', price: 20, popular: true },
  { _id: '2', name: 'Livro Popular 2', price: 25, popular: true },
  { _id: '3', name: 'Livro Popular 3', price: 30, popular: true },
  { _id: '4', name: 'Livro Popular 4', price: 35, popular: true },
  { _id: '5', name: 'Livro Popular 5', price: 40, popular: true },
  { _id: '6', name: 'Livro Popular 6', price: 45, popular: true }, // Não deve ser mostrado devido ao slice(0,5)
  { _id: '7', name: 'Livro Comum 1', price: 50, popular: false },
  { _id: '8', name: 'Livro Comum 2', price: 55, popular: false },
];

describe('Componente PopularBooks', () => {
  const mockContext = {
    books: mockBooks
  };

  beforeEach(() => {
    render(
      <ShopContext.Provider value={mockContext}>
        <PopularBooks />
      </ShopContext.Provider>
    );
  });

  test('deve renderizar o título corretamente', () => {
    expect(screen.getByText('Popular')).toBeInTheDocument();
    expect(screen.getByText('Books')).toBeInTheDocument();
  });

  test('deve exibir apenas livros populares', () => {
    const componentesLivro = screen.getAllByTestId('item-component');
    
    // Deve mostrar apenas os 5 primeiros livros populares
    expect(componentesLivro).toHaveLength(5);
    
    // Verifica se apenas livros populares são exibidos
    componentesLivro.forEach((item, index) => {
      expect(item).toHaveTextContent(`Livro Popular ${index + 1}`);
    });
    
    // Verifica se livros comuns não são exibidos
    expect(screen.queryByText('Livro Comum 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Livro Comum 2')).not.toBeInTheDocument();
  });
  test('deve limitar a exibição a 5 livros mesmo se houver mais livros populares', () => {
    const componentesLivro = screen.getAllByTestId('item-component');
    expect(componentesLivro).toHaveLength(5);
    expect(screen.queryByText('Livro Popular 6')).not.toBeInTheDocument();
  });

  test('deve renderizar com as classes corretas do grid', () => {
    const containerGrid = document.querySelector('.grid');
    expect(containerGrid).toHaveClass(
      'grid-cols-1',
      'xs:grid-cols-2',
      'md:grid-cols-3',
      'lg:grid-cols-4',
      'xl:grid-cols-5',
      'gap-10'
    );
  });

  test('deve renderizar com os estilos corretos da seção', () => {
    const secao = document.querySelector('section');
    expect(secao).toHaveClass('max-padd-container', 'py-16', 'bg-white');
  });

  test('deve atualizar os livros populares quando os livros do contexto mudarem', () => {
    // Re-renderiza com livros diferentes
    const novosLivros = [
      { _id: '9', name: 'Novo Livro Popular 1', price: 60, popular: true },
      { _id: '10', name: 'Novo Livro Comum', price: 65, popular: false },
    ];    render(
      <ShopContext.Provider value={{ books: novosLivros }}>
        <PopularBooks />
      </ShopContext.Provider>
    );

    const componentesLivro = screen.getAllByTestId('item-component');
    expect(componentesLivro).toHaveLength(1);
    expect(componentesLivro[0]).toHaveTextContent('Novo Livro Popular 1');
    expect(screen.queryByText('Novo Livro Comum')).not.toBeInTheDocument();
  });

  test('deve renderizar o componente Title com as propriedades corretas', () => {
    const containerTitulo = document.querySelector('.pb-10');
    expect(titleContainer).toBeInTheDocument();
  });

  test('handles empty books array', () => {
    render(
      <ShopContext.Provider value={{ books: [] }}>
        <PopularBooks />
      </ShopContext.Provider>
    );

    const itemComponents = screen.queryAllByTestId('item-component');
    expect(itemComponents).toHaveLength(0);
  });

  test('handles no popular books', () => {
    const booksWithNoPopular = [
      { _id: '1', name: 'Regular Book 1', price: 20, popular: false },
      { _id: '2', name: 'Regular Book 2', price: 25, popular: false },
    ];

    render(
      <ShopContext.Provider value={{ books: booksWithNoPopular }}>
        <PopularBooks />
      </ShopContext.Provider>
    );

    const itemComponents = screen.queryAllByTestId('item-component');
    expect(itemComponents).toHaveLength(0);
  });
});
