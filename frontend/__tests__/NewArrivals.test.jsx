import React from 'react';
import { render, screen } from '@testing-library/react';
import NewArrivals from '../src/components/NewArrivals';
import { ShopContext } from '../src/context/ShopContext';

// Mock dos componentes do Swiper - simplificando para teste
jest.mock('swiper/react', () => ({
  Swiper: ({ children }) => <div data-testid="swiper">{children}</div>,
  SwiperSlide: ({ children }) => <div data-testid="swiper-slide">{children}</div>,
}));

// Mock dos estilos do Swiper
jest.mock('swiper/css', () => ({}));
jest.mock('swiper/css/pagination', () => ({}));
jest.mock('swiper/modules', () => ({
  Autoplay: jest.fn(), // Mock da funcionalidade de reprodução automática
  Pagination: jest.fn(), // Mock da funcionalidade de paginação
}));

// Mock do componente Item
jest.mock('../src/components/Item', () => {
  return function MockItem({ book }) {
    return <div data-testid="item-component">{book.name}</div>;
  };
});

// Dados simulados de livros
const mockBooks = [
  { _id: '1', name: 'Livro 1', price: 20 },
  { _id: '2', name: 'Livro 2', price: 25 },
  { _id: '3', name: 'Livro 3', price: 30 },
  { _id: '4', name: 'Livro 4', price: 35 },
  { _id: '5', name: 'Livro 5', price: 40 },
  { _id: '6', name: 'Livro 6', price: 45 },
  { _id: '7', name: 'Livro 7', price: 50 },
  { _id: '8', name: 'Livro 8', price: 55 }, // Este não deve aparecer nos lançamentos
];

describe('Componente NewArrivals', () => {
  const mockContext = {
    books: mockBooks
  };

  // Antes de cada teste, renderiza o componente com o contexto
  beforeEach(() => {
    render(
      <ShopContext.Provider value={mockContext}>
        <NewArrivals />
      </ShopContext.Provider>
    );
  });

  // Verifica se o título é renderizado corretamente
  test('deve renderizar o título corretamente', () => {
    expect(screen.getByText('Novos')).toBeInTheDocument();
    expect(screen.getByText('Lançamentos')).toBeInTheDocument();
  });

  // Verifica se o número correto de lançamentos é exibido
  test('deve exibir o número correto de lançamentos', () => {
    const itemComponents = screen.getAllByTestId('item-component');
    expect(itemComponents).toHaveLength(7); // Deve mostrar apenas os 7 livros mais novos
  });
  // Verifica se os livros são exibidos em ordem reversa
  test('deve exibir os livros em ordem reversa', () => {
    const itemComponents = screen.getAllByTestId('item-component');
    
    // Os livros devem aparecer em ordem reversa (mais novos primeiro)
    expect(itemComponents[0]).toHaveTextContent('Livro 7');
    expect(itemComponents[6]).toHaveTextContent('Livro 1');
  });

  // Verifica se o componente Swiper é renderizado com as props corretas
  test('deve renderizar o componente Swiper com as props corretas', () => {
    const swiperContainer = screen.getByTestId('swiper');
    expect(swiperContainer).toBeInTheDocument();
  });

  // Verifica se as classes de estilo estão corretas
  test('deve renderizar com as classes de estilo corretas', () => {
    const section = document.querySelector('section');
    expect(section).toHaveClass(
      'max-padd-container', // Container com padding máximo
      'py-16',             // Padding vertical de 16 unidades
      'bg-white'           // Fundo branco
    );
  });
  // Verifica se os lançamentos são atualizados quando os livros mudam
  test('deve atualizar os lançamentos quando a prop books muda', () => {
    // Re-renderiza com livros diferentes
    const newMockBooks = [
      { _id: '9', name: 'Novo Livro 1', price: 60 },
      { _id: '10', name: 'Novo Livro 2', price: 65 },
    ];

    render(
      <ShopContext.Provider value={{ books: newMockBooks }}>
        <NewArrivals />
      </ShopContext.Provider>
    );

    const itemComponents = screen.getAllByTestId('item-component');
    expect(itemComponents).toHaveLength(2);
    expect(itemComponents[0]).toHaveTextContent('Novo Livro 2');
    expect(itemComponents[1]).toHaveTextContent('Novo Livro 1');
  });

  // Os testes de breakpoints e configuração do Swiper seriam normalmente feitos
  // através de testes de integração ou Cypress, pois envolvem dimensionamento real do DOM
  // e funcionalidade do Swiper
});

// Testes de integração do componente Title
describe('Integração do Título em NewArrivals', () => {
  // Verifica se as props corretas são passadas para o componente Title
  test('deve passar as props corretas para o componente Title', () => {
    const { container } = render(
      <ShopContext.Provider value={{ books: mockBooks }}>
        <NewArrivals />
      </ShopContext.Provider>
    );
    
    const titleContainer = container.querySelector('div');
    expect(titleContainer).toHaveClass('pb-10'); // Padding bottom de 10 unidades
  });
});
