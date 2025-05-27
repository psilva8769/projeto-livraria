import React from 'react';
import { render, screen } from '@testing-library/react';
import Features from '../src/components/Features';

// Mock das imagens - substituindo os arquivos de imagem por strings para teste
jest.mock('../assets/features/filter.png', () => 'filter-image-mock');
jest.mock('../assets/features/rating.png', () => 'rating-image-mock');
jest.mock('../assets/features/wishlist.png', () => 'wishlist-image-mock');
jest.mock('../assets/features/secure.png', () => 'secure-image-mock');

describe('Componente Features', () => {
  // Antes de cada teste, renderiza o componente
  beforeEach(() => {
    render(<Features />);
  });

  // Verifica se todos os títulos das funcionalidades são renderizados
  test('deve renderizar todos os títulos das funcionalidades', () => {
    const expectedHeadings = [
      'Advanced Search and Filters',
      'User Reviews and Ratings',
      'Wishlist and Favorites',
      'Secure Online Payments'
    ];

    expectedHeadings.forEach(heading => {
      expect(screen.getByText(heading)).toBeInTheDocument();
    });
  });

  // Verifica se todas as descrições das funcionalidades são renderizadas
  test('deve renderizar todas as descrições das funcionalidades', () => {
    const expectedDescriptions = [
      'Effortlessly search books by title, author, genre, or price range.',
      'Customers can share reviews, rate books, and guide future readers.',
      'Save books to wishlist for future purchases or easy access.',
      'Enjoy seamless checkout with multiple secure payment options.'
    ];

    expectedDescriptions.forEach(description => {
      expect(screen.getByText(description)).toBeInTheDocument();
    });
  });

  // Verifica se todos os ícones das funcionalidades são renderizados corretamente
  test('deve renderizar todos os ícones das funcionalidades', () => {
    const icons = screen.getAllByAltText('featureIcon');
    expect(icons).toHaveLength(4); // Deve ter 4 ícones no total
    
    icons.forEach(icon => {
      expect(icon).toHaveAttribute('height', '44');
      expect(icon).toHaveAttribute('width', '44');
    });
  });

  // Verifica se o layout em grid está com as classes corretas
  test('deve ter as classes corretas para o layout em grid', () => {
    const gridContainer = document.querySelector('.grid');
    expect(gridContainer).toHaveClass(
      'grid-cols-2',     // 2 colunas em mobile
      'md:grid-cols-3',  // 3 colunas em tablets
      'lg:grid-cols-4',   // 4 colunas em desktop
      'gap-5',            // Espaçamento entre os itens da grade
      'gap-y-12'          // Espaçamento vertical entre os itens da grade
    );
  });

  // Verifica se cada funcionalidade tem a estrutura e estilização corretas
  test('deve ter estrutura e estilização corretas em cada funcionalidade', () => {
    const features = document.querySelectorAll('.flexCenter.flex-col.gap-3');
    expect(features).toHaveLength(4); // Deve ter 4 funcionalidades

    features.forEach(feature => {
      // Verifica a imagem
      expect(feature.querySelector('img')).toBeInTheDocument();
      
      // Verifica o container do título
      const headingContainer = feature.querySelector('.flexCenter.flex-col');
      expect(headingContainer).toBeInTheDocument();
      
      // Verifica o título
      expect(headingContainer.querySelector('.h5')).toBeInTheDocument();
      
      // Verifica a linha horizontal decorativa
      const hr = headingContainer.querySelector('hr');
      expect(hr).toHaveClass(
        'w-8',           // Largura de 8 unidades
        'bg-secondary',  // Cor de fundo secundária
        'h-1',          // Altura de 1 unidade
        'rounded-full',  // Bordas totalmente arredondadas
        'border-none'    // Sem borda
      );
      
      // Verifica a descrição
      expect(feature.querySelector('p')).toHaveClass('text-center');
    });
  });
});
