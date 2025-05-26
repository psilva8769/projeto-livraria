import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Features from '../Features';

// Mock the image imports
jest.mock('../../assets/features/filter.png', () => 'filter-icon.png');
jest.mock('../../assets/features/rating.png', () => 'rating-icon.png');
jest.mock('../../assets/features/wishlist.png', () => 'wishlist-icon.png');
jest.mock('../../assets/features/secure.png', () => 'secure-icon.png');

describe('Features Component', () => {
  test('renders all feature sections', () => {
    render(<Features />);
      // Check for feature titles
    expect(screen.getByText('Busca Avançada e Filtros')).toBeInTheDocument();
    expect(screen.getByText('Avaliações e Comentários')).toBeInTheDocument();
    expect(screen.getByText('Lista de Desejos e Favoritos')).toBeInTheDocument();
    expect(screen.getByText('Pagamentos Online Seguros')).toBeInTheDocument();
  });

  test('renders feature descriptions', () => {
    render(<Features />);
      expect(screen.getByText(/Encontre livros facilmente por título/)).toBeInTheDocument();
    expect(screen.getByText(/Clientes podem compartilhar opiniões/)).toBeInTheDocument();
    expect(screen.getByText(/Salve livros na lista de desejos para/)).toBeInTheDocument();
    expect(screen.getByText(/Finalize sua compra com diversas opções/)).toBeInTheDocument();
  });

  test('renders feature icons with correct alt text', () => {
    render(<Features />);
    
    const featureIcons = screen.getAllByAltText('featureIcon');
    expect(featureIcons).toHaveLength(4);
    
    // Check that all icons are rendered
    featureIcons.forEach(icon => {
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('height', '44');
      expect(icon).toHaveAttribute('width', '44');
    });
  });

  test('applies correct grid layout classes', () => {
    render(<Features />);
    
    const gridContainer = screen.getByText('Busca Avançada e Filtros').closest('.grid');
    expect(gridContainer).toHaveClass('grid-cols-2', 'md:grid-cols-3', 'lg:grid-cols-4');
  });

  test('applies hover effects classes', () => {
    render(<Features />);
    
    // Check for group classes that enable hover effects
    const featureContainers = document.querySelectorAll('.group');
    expect(featureContainers.length).toBeGreaterThan(0);
    
    featureContainers.forEach(container => {
      expect(container).toHaveClass('group');
    });
  });

  test('renders gradient background', () => {
    render(<Features />);
    
    const backgroundElement = document.querySelector('.absolute.inset-0.bg-gradient-to-br');
    expect(backgroundElement).toBeInTheDocument();
    expect(backgroundElement).toHaveClass('from-primary/5', 'to-secondary/5');
  });

  test('renders decorative lines under titles', () => {
    render(<Features />);
    
    const decorativeLines = document.querySelectorAll('hr');
    expect(decorativeLines).toHaveLength(4);
    
    decorativeLines.forEach(line => {
      expect(line).toHaveClass('w-12', 'bg-gradient-to-r', 'from-secondary', 'to-tertiary');
    });
  });

  test('applies correct styling to feature titles', () => {
    render(<Features />);
    
    const titles = [      screen.getByText('Busca Avançada e Filtros'),
      screen.getByText('Avaliações e Comentários'),
      screen.getByText('Lista de Desejos e Favoritos'),
      screen.getByText('Pagamentos Online Seguros')
    ];
    
    titles.forEach(title => {
      expect(title).toHaveClass('h5', 'text-center', 'text-navy');
    });
  });

  test('applies correct styling to feature descriptions', () => {
    render(<Features />);
    
    const descriptions = document.querySelectorAll('p.text-center.text-tertiary');
    expect(descriptions).toHaveLength(4);
    
    descriptions.forEach(description => {
      expect(description).toHaveClass('text-center', 'text-tertiary', 'leading-relaxed');
    });
  });

  test('renders with responsive design classes', () => {
    render(<Features />);
    
    const section = screen.getByText('Busca Avançada e Filtros').closest('section');
    expect(section).toHaveClass('max-padd-container', 'py-20', 'relative');
  });

  test('icon containers have gradient backgrounds', () => {
    render(<Features />);
    
    const iconContainers = document.querySelectorAll('.p-4.bg-gradient-to-br');
    expect(iconContainers).toHaveLength(4);
    
    // Check different gradient combinations
    expect(iconContainers[0]).toHaveClass('from-primary/10', 'to-secondary/10');
    expect(iconContainers[1]).toHaveClass('from-secondary/10', 'to-tertiary/10');
    expect(iconContainers[2]).toHaveClass('from-tertiary/10', 'to-accent/10');
  });

  test('renders without crashing', () => {
    expect(() => render(<Features />)).not.toThrow();
  });

  test('has proper semantic structure', () => {
    render(<Features />);
    
    // Should be wrapped in a section element
    const section = screen.getByText('Busca Avançada e Filtros').closest('section');
    expect(section).toBeInTheDocument();
    
    // Should have proper heading hierarchy
    const headings = screen.getAllByRole('heading');
    expect(headings).toHaveLength(4);
  });
});
