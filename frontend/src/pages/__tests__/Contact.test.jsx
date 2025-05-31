import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Contact from '../Contact';

// Mock do componente Footer
jest.mock('../../components/Footer', () => {
  return function MockFooter() {
    return <div data-testid="footer-component">Componente de Rodapé</div>;
  };
});

describe('Página de Contato', () => {
  test('renderiza a página de contato', () => {
    render(<Contact />);

    // A página deve ser renderizada sem falhas
    expect(screen.getByTestId('footer-component')).toBeInTheDocument();
  });

  test('renderiza o título da página de contato', () => {
    render(<Contact />);

    // Procure por texto relacionado ao contato
    const contactElements = screen.getAllByText(/contato/i);
    expect(contactElements.length).toBeGreaterThan(0);
  });

  test('renderiza o componente de rodapé', () => {
    render(<Contact />);

    expect(screen.getByTestId('footer-component')).toBeInTheDocument();
  });

  test('renderiza sem falhas', () => {
    expect(() => render(<Contact />)).not.toThrow();
  });
});
