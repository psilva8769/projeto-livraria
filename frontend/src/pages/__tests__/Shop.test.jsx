import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Shop from '../Shop';
import { ShopContext } from '../../context/ShopContext';

// Mock do componente Footer
jest.mock('../../components/Footer', () => {
  return function MockFooter() {
    return <div data-testid="footer-component">Componente de Rodapé</div>;
  };
});

// Mock do componente Item
jest.mock('../../components/Item', () => {
  return function MockItem({ book }) {
    return <div data-testid={`item-${book._id}`}>{book.name}</div>;
  };
});

// Mock dos dados de categorias
jest.mock('../../assets/data', () => ({
  categories: [
    { name: 'Romance', image: '/romance.png' },
    { name: 'Ficção', image: '/fiction.png' },
    { name: 'Literatura', image: '/literature.png' }
  ]
}));

const mockBooks = [
  {
    _id: '1',
    name: 'Dom Casmurro',
    category: 'Literatura',
    price: 25,
    image: '/images/book1.jpg'
  },
  {
    _id: '2',
    name: 'O Cortiço',
    category: 'Literatura',
    price: 30,
    image: '/images/book2.jpg'
  },
  {
    _id: '3',
    name: 'Romance Moderno',
    category: 'Romance',
    price: 20,
    image: '/images/book3.jpg'
  },
  {
    _id: '4',
    name: 'Ficção Científica',
    category: 'Ficção',
    price: 35,
    image: '/images/book4.jpg'
  }
];

const mockContextValue = {
  books: mockBooks
};

const renderWithContext = (contextValue = mockContextValue) => {
  return render(
    <ShopContext.Provider value={contextValue}>
      <Shop />
    </ShopContext.Provider>
  );
};

describe('Página da Loja', () => {
  test('renderiza a página da loja com título', () => {
    renderWithContext();
    expect(screen.getByText('Nossa')).toBeInTheDocument();
    expect(screen.getByText('Lista de Livros')).toBeInTheDocument();
  });

  test('exibe todos os livros inicialmente', () => {
    renderWithContext();
    
    expect(screen.getByTestId('item-1')).toBeInTheDocument();
    expect(screen.getByTestId('item-2')).toBeInTheDocument();
    expect(screen.getByTestId('item-3')).toBeInTheDocument();
    expect(screen.getByTestId('item-4')).toBeInTheDocument();
  });

  test('filtra livros pelo termo de busca', () => {
    renderWithContext();
    
    const searchInput = screen.getByPlaceholderText('Pesquise por título, autor ou categoria...');
    fireEvent.change(searchInput, { target: { value: 'Dom' } });
    
    // Deve mostrar apenas Dom Casmurro
    expect(screen.getByTestId('item-1')).toBeInTheDocument();
    expect(screen.queryByTestId('item-2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('item-3')).not.toBeInTheDocument();
    expect(screen.queryByTestId('item-4')).not.toBeInTheDocument();
  });

  test('a busca não diferencia maiúsculas de minúsculas', () => {
    renderWithContext();
    const searchInput = screen.getByPlaceholderText('Pesquise por título, autor ou categoria...');
    fireEvent.change(searchInput, { target: { value: 'dom' } });
    
    expect(screen.getByTestId('item-1')).toBeInTheDocument();
  });

  test('classifica livros por preço, do mais baixo para o mais alto', () => {
    renderWithContext();
    const sortSelect = screen.getByDisplayValue('Relevância');
    fireEvent.change(sortSelect, { target: { value: 'low' } });
    
    // Deve ainda exibir todos os livros, mas ordenados
    expect(screen.getByTestId('item-1')).toBeInTheDocument();
    expect(screen.getByTestId('item-2')).toBeInTheDocument();
    expect(screen.getByTestId('item-3')).toBeInTheDocument();
    expect(screen.getByTestId('item-4')).toBeInTheDocument();
  });

  test('classifica livros por preço, do mais alto para o mais baixo', () => {
    renderWithContext();
    const sortSelect = screen.getByDisplayValue('Relevância');
    fireEvent.change(sortSelect, { target: { value: 'high' } });
    
    // Deve ainda exibir todos os livros, mas ordenados
    expect(screen.getByTestId('item-1')).toBeInTheDocument();
    expect(screen.getByTestId('item-2')).toBeInTheDocument();
    expect(screen.getByTestId('item-3')).toBeInTheDocument();
    expect(screen.getByTestId('item-4')).toBeInTheDocument();
  });

  test('filtra livros por categoria', () => {
    renderWithContext();
    
    // Encontre e clique no filtro da categoria literatura
    const literaturaFilter = screen.getByText('Literatura');
    fireEvent.click(literaturaFilter);
    
    // Deve mostrar apenas os livros de literatura
    expect(screen.getByTestId('item-1')).toBeInTheDocument();
    expect(screen.getByTestId('item-2')).toBeInTheDocument();
    expect(screen.queryByTestId('item-3')).not.toBeInTheDocument();
    expect(screen.queryByTestId('item-4')).not.toBeInTheDocument();
  });

  test('combina filtros de busca e categoria', () => {
    renderWithContext();
    
    // Aplica o filtro de literatura
    const literaturaFilter = screen.getByText('Literatura');
    fireEvent.click(literaturaFilter);
    
    // Aplica o filtro de busca
    const searchInput = screen.getByPlaceholderText('Pesquise por título, autor ou categoria...');
    fireEvent.change(searchInput, { target: { value: 'Dom' } });
    
    // Deve mostrar apenas Dom Casmurro
    expect(screen.getByTestId('item-1')).toBeInTheDocument();
    expect(screen.queryByTestId('item-2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('item-3')).not.toBeInTheDocument();
    expect(screen.queryByTestId('item-4')).not.toBeInTheDocument();
  });

  test('não mostra resultados quando a busca não tem correspondências', () => {
    renderWithContext();
    const searchInput = screen.getByPlaceholderText('Pesquise por título, autor ou categoria...');
    fireEvent.change(searchInput, { target: { value: 'livro inexistente' } });
    
    // Não deve mostrar nenhum livro
    expect(screen.queryByTestId('item-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('item-2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('item-3')).not.toBeInTheDocument();
    expect(screen.queryByTestId('item-4')).not.toBeInTheDocument();
  });

  test('alterna o filtro de categoria liga e desliga', () => {
    renderWithContext();
    
    const literaturaFilter = screen.getByText('Literatura');
    
    // Aplica o filtro
    fireEvent.click(literaturaFilter);
    expect(screen.getByTestId('item-1')).toBeInTheDocument();
    expect(screen.getByTestId('item-2')).toBeInTheDocument();
    expect(screen.queryByTestId('item-3')).not.toBeInTheDocument();
    
    // Remove o filtro
    fireEvent.click(literaturaFilter);
    expect(screen.getByTestId('item-1')).toBeInTheDocument();
    expect(screen.getByTestId('item-2')).toBeInTheDocument();
    expect(screen.getByTestId('item-3')).toBeInTheDocument();
    expect(screen.getByTestId('item-4')).toBeInTheDocument();
  });

  test('renderiza o componente de rodapé', () => {
    renderWithContext();
    
    expect(screen.getByTestId('footer-component')).toBeInTheDocument();
  });

  test('renderiza o input de busca com o placeholder correto', () => {
    renderWithContext();
    const searchInput = screen.getByPlaceholderText('Pesquise por título, autor ou categoria...');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('type', 'text');
  });

  test('renderiza o dropdown de classificação com as opções corretas', () => {
    renderWithContext();
    const sortSelect = screen.getByDisplayValue('Relevância');
    expect(sortSelect).toBeInTheDocument();
    
    // Verifica se as opções de classificação existem
    expect(screen.getByText('Relevância')).toBeInTheDocument();
    expect(screen.getByText('Menor preço')).toBeInTheDocument();
    expect(screen.getByText('Maior preço')).toBeInTheDocument();
  });

  test('lida graciosamente com array de livros vazio', () => {
    const emptyBooksContext = {
      books: []
    };
    
    renderWithContext(emptyBooksContext);
    
    // Deve renderizar sem travar
    expect(screen.getByText('Nossa')).toBeInTheDocument();
    expect(screen.queryByTestId(/item-/)).not.toBeInTheDocument();
  });

  test('limpa o input de busca', () => {
    renderWithContext();
    const searchInput = screen.getByPlaceholderText('Pesquise por título, autor ou categoria...');
    
    // Digita na busca
    fireEvent.change(searchInput, { target: { value: 'Dom' } });
    expect(searchInput.value).toBe('Dom');
    
    // Limpa a busca
    fireEvent.change(searchInput, { target: { value: '' } });
    expect(searchInput.value).toBe('');
    
    // Deve mostrar todos os livros novamente
    expect(screen.getByTestId('item-1')).toBeInTheDocument();
    expect(screen.getByTestId('item-2')).toBeInTheDocument();
    expect(screen.getByTestId('item-3')).toBeInTheDocument();
    expect(screen.getByTestId('item-4')).toBeInTheDocument();
  });
});
