import React from 'react';
import { render, screen } from '@testing-library/react';
import Title from '../src/components/Title';

describe('Componente Title', () => {
  const defaultProps = {
    title1: 'Principal',
    title2: 'Título',
    titleStyles: 'custom-title',
    title1Styles: 'custom-title1',
    paraStyles: 'custom-para'
  };

  test('deve renderizar os títulos corretamente', () => {
    render(<Title {...defaultProps} />);
    
    expect(screen.getByText('Principal')).toBeInTheDocument();
    expect(screen.getByText('Título')).toBeInTheDocument();
  });

  test('deve renderizar o texto do subtítulo corretamente', () => {
    render(<Title {...defaultProps} />);

    const subtitle = screen.getByText(/From timeless classics to modern masterpieces/);
    expect(subtitle).toBeInTheDocument();
    expect(subtitle).toHaveClass('hidden');
  });

  test('deve aplicar os estilos personalizados corretamente', () => {
    render(<Title {...defaultProps} />);

    const container = screen.getByRole('heading').parentElement;
    expect(container).toHaveClass('custom-title', 'pb-1');
    expect(screen.getByRole('heading')).toHaveClass('custom-title1', 'h2');
    expect(screen.getByText(/From timeless classics/)).toHaveClass('custom-para');
  });

  test('deve renderizar o título secundário com estilo correto', () => {
    render(<Title {...defaultProps} />);

    const title2Element = screen.getByText('Título');
    expect(title2Element).toHaveClass('text-secondary', '!font-light');
  });
});
