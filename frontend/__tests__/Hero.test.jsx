import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Hero from '../src/components/Hero';

// Mock das imagens - substituindo os arquivos de imagem por strings simples para teste
jest.mock('../assets/bg.png', () => 'bg-image-mock');
jest.mock('../assets/pencil.png', () => 'pencil-image-mock');

describe('Componente Hero', () => {
  // Antes de cada teste, renderiza o componente Hero dentro do BrowserRouter
  beforeEach(() => {
    render(
      <BrowserRouter>
        <Hero />
      </BrowserRouter>
    );
  });

  // Verifica se o título principal é renderizado corretamente com todas as suas partes
  test('deve renderizar o título principal corretamente', () => {
    expect(screen.getByText('Discover')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('ooks')).toBeInTheDocument();
    expect(screen.getByText('That Inspire Your World')).toBeInTheDocument();
  });

  // Verifica se o texto de descrição está presente
  test('deve renderizar o texto de descrição', () => {
    const description = screen.getByText(/Explore a world of stories, knowledge, and inspiration/);
    expect(description).toBeInTheDocument();
  });

  // Verifica se o botão "Explore Now" está presente e tem o link correto
  test('deve renderizar o botão Explore Now com o link correto', () => {
    const exploreButton = screen.getByText('Explore Now');
    expect(exploreButton).toBeInTheDocument();
    expect(exploreButton).toHaveClass('btn-secondaryOne');
    expect(exploreButton.closest('a')).toHaveAttribute('href', '/store');
  });
  // Verifica se as imagens do herói são renderizadas com os atributos corretos
  test('deve renderizar as imagens do herói', () => {
    const pencilImage = screen.getByAltText('pencilImg');
    expect(pencilImage).toBeInTheDocument();
    expect(pencilImage).toHaveAttribute('height', '49');
    expect(pencilImage).toHaveAttribute('width', '49');

    const bgImage = screen.getByRole('img', { name: '' });
    expect(bgImage).toBeInTheDocument();
    expect(bgImage).toHaveAttribute('height', '588');
    expect(bgImage).toHaveAttribute('width', '588');
  });

  // Verifica se as classes de layout estão aplicadas corretamente
  test('deve ter as classes de layout corretas', () => {
    // Check main container
    const section = document.querySelector('.max-padd-container');
    expect(section).toHaveClass('py-20', 'xl:py-36');

    // Check flex container
    const flexContainer = document.querySelector('.flexCenter');
    expect(flexContainer).toHaveClass('gap-12', 'flex-col', 'xl:flex-row');

    // Check left side container
    const leftSide = document.querySelector('.flex-1.flex-col');
    expect(leftSide).toHaveClass('pt-12', 'xl:pt-32');

    // Check right side container
    const rightSide = document.querySelector('.flex.flex-1');
    expect(rightSide).toHaveClass('relative', 'z-10', 'top-12');
  });
  // Verifica se a letra B tem todas as classes de estilo necessárias
  test('deve ter o estilo correto na letra B', () => {
    const letterB = screen.getByText('B');
    expect(letterB).toHaveClass(
      'inline-flex',      // Flexbox com alinhamento inline
      'items-center',     // Centraliza itens verticalmente
      'justify-center',   // Centraliza itens horizontalmente
      'p-5',             // Padding em todos os lados
      'h-16',            // Altura fixa
      'w-16',            // Largura fixa
      'bg-secondary',    // Cor de fundo secundária
      'text-white',      // Texto branco
      '-rotate-[31deg]', // Rotação negativa de 31 graus
      'rounded-full'     // Borda totalmente arredondada
    );
  });

  // Verifica se o título tem a largura máxima correta
  test('deve ter a largura máxima correta no título', () => {
    const title = document.querySelector('.h1');
    expect(title).toHaveClass('max-w-[46rem]');
  });
});
