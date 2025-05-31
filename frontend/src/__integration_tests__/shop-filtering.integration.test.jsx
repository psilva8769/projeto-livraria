import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, defaultContextValue, mockBooks } from '../utils/testUtils';
import App from '../App';

// Mock do window.scrollTo
window.scrollTo = jest.fn();

describe('Integração de Filtro e Ordenação na Página da Loja', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve navegar para a página da loja e filtrar livros por categoria', async () => {
    const mockContextValue = {
      ...defaultContextValue,
      books: mockBooks,
    };

    renderWithProviders(
      <App />,
      { 
        contextValue: mockContextValue,
        initialEntries: ['/shop']
      }
    );

    // Verifica se a página da loja foi carregada
    await waitFor(() => {
      expect(screen.getByText('Nossa')).toBeInTheDocument();
      expect(screen.getByText('Lista de Livros')).toBeInTheDocument();
    });

    // Todos os livros de mockBooks devem estar visíveis inicialmente
    expect(screen.getByText('Dom Casmurro')).toBeInTheDocument();
    
    // Seleciona uma categoria - direciona especificamente para o filtro de categoria, não os badges de categoria dos livros
    const categoryFilters = screen.getAllByText('Ficção');
    // O primeiro deve ser o checkbox do filtro de categoria, os outros são badges de categoria dos livros
    const categoryFilterLabel = categoryFilters.find(element => 
      element.classList.contains('medium-14') && 
      element.closest('label')?.querySelector('input[type="checkbox"]')
    );
    expect(categoryFilterLabel).toBeTruthy();
    fireEvent.click(categoryFilterLabel);
    
    // Verifica se o filtro de categoria foi aplicado - apenas livros dessa categoria devem ser exibidos
    await waitFor(() => {
      const categoryCheckbox = categoryFilterLabel.closest('label').querySelector('input');
      expect(categoryCheckbox).toBeChecked();
    });
  });

  test('deve buscar e ordenar livros', async () => {
    // Adiciona livros adicionais com preços variados para o teste de ordenação
    const extendedMockBooks = [
      ...mockBooks,
      {
        _id: '4',
        name: 'Livro de Baixo Preço',
        category: 'Ficção',
        price: 10,
        description: 'Este é um livro de preço baixo.',
        image: '/images/book4.jpg'
      },
      {
        _id: '5',
        name: 'Livro de Alto Preço',
        category: 'Ficção',
        price: 50,
        description: 'Este é um livro de preço alto.',
        image: '/images/book5.jpg'
      }
    ];
    
    const mockContextValue = {
      ...defaultContextValue,
      books: extendedMockBooks,
    };

    renderWithProviders(
      <App />,
      { 
        contextValue: mockContextValue,
        initialEntries: ['/shop']
      }
    );

    // Busca por um livro específico
    const searchInput = await screen.findByPlaceholderText(/pesquise por título/i);
    await userEvent.type(searchInput, 'Dom');
    
    // Aguarda os resultados da busca
    await waitFor(() => {
      // Apenas 'Dom Casmurro' deve estar visível após a busca
      expect(screen.getByText('Dom Casmurro')).toBeInTheDocument();
      expect(screen.queryByText('Livro de Alto Preço')).not.toBeInTheDocument();
    });
    
    // Limpa a busca e ordena por preço (menor para maior)
    await userEvent.clear(searchInput);
    const sortSelect = await screen.findByRole('combobox');
    fireEvent.change(sortSelect, { target: { value: 'low' } });
    
    // Aguarda a aplicação da ordenação
    await waitFor(() => {
      // Os livros devem estar ordenados por preço ascendente
      const bookElements = screen.getAllByText(/Livro de/);
      expect(bookElements[0].textContent).toContain('Livro de Baixo Preço');
    });
    
    // Ordena por preço (maior para menor)
    fireEvent.change(sortSelect, { target: { value: 'high' } });
    
    // Aguarda a aplicação da ordenação
    await waitFor(() => {
      // Os livros devem estar ordenados por preço descendente
      const bookElements = screen.getAllByText(/Livro de/);
      expect(bookElements[0].textContent).toContain('Livro de Alto Preço');
    });
  });
});
