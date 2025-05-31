import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../Home';

// Mock de todos os componentes usados na página inicial
jest.mock('../../components/Hero', () => {
  return function MockHero() {
    return <div data-testid="hero-component">Componente Hero</div>;
  };
});

jest.mock('../../components/NewArrivals', () => {
  return function MockNewArrivals() {
    return <div data-testid="new-arrivals-component">Componente Novidades</div>;
  };
});

jest.mock('../../components/About', () => {
  return function MockAbout() {
    return <div data-testid="about-component">Componente Sobre</div>;
  };
});

jest.mock('../../components/PopularBooks', () => {
  return function MockPopularBooks() {
    return <div data-testid="popular-books-component">Componente Livros Populares</div>;
  };
});

jest.mock('../../components/Features', () => {
  return function MockFeatures() {
    return <div data-testid="features-component">Componente Recursos</div>;
  };
});

jest.mock('../../components/Footer', () => {
  return function MockFooter() {
    return <div data-testid="footer-component">Componente de Rodapé</div>;
  };
});

describe('Página Inicial', () => {
  test('renderiza todos os componentes principais', () => {
    render(<Home />);

    // Verifique se todos os componentes principais são renderizados
    expect(screen.getByTestId('hero-component')).toBeInTheDocument();
    expect(screen.getByTestId('new-arrivals-component')).toBeInTheDocument();
    expect(screen.getByTestId('about-component')).toBeInTheDocument();
    expect(screen.getByTestId('popular-books-component')).toBeInTheDocument();
  });

  test('renderiza o componente de rodapé', () => {
    render(<Home />);

    expect(screen.getByTestId('footer-component')).toBeInTheDocument();
  });

  test('renderiza sem falhas', () => {
    expect(() => render(<Home />)).not.toThrow();
  });
});
