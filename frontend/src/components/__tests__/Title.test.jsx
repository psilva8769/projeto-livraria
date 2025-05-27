import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Title from '../Title';

describe('Title Component', () => {
  const defaultProps = {
    title1: 'Nossa',
    title2: 'Livraria',
    titleStyles: 'custom-title-styles',
    title1Styles: 'custom-title1-styles',
    paraStyles: 'custom-para-styles'
  };

  test('renders title component with all props', () => {
    render(<Title {...defaultProps} />);
    
    // Check if title1 and title2 are rendered
    expect(screen.getByText('Nossa')).toBeInTheDocument();
    expect(screen.getByText('Livraria')).toBeInTheDocument();
    
    // Check if the default description is rendered
    expect(screen.getByText(/Dos clássicos atemporais às obras-primas modernas/)).toBeInTheDocument();
  });

  test('applies custom CSS classes correctly', () => {
    render(<Title {...defaultProps} />);
    
    const titleContainer = screen.getByText('Nossa').closest('div');
    expect(titleContainer).toHaveClass('custom-title-styles', 'pb-6', 'text-center');
    
    const titleElement = screen.getByText('Nossa');
    expect(titleElement).toHaveClass('custom-title1-styles', 'h2');
  });

  test('renders with minimal props', () => {
    render(<Title title1="Test" title2="Title" />);
    
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
  });

  test('renders gradient line divider', () => {
    render(<Title {...defaultProps} />);
    
    const divider = document.querySelector('.w-24.h-1.bg-gradient-to-r');
    expect(divider).toBeInTheDocument();
  });

  test('renders with empty titles', () => {
    render(<Title title1="" title2="" />);
    
    // The component should still render the structure
    expect(screen.getByText(/Dos clássicos atemporais/)).toBeInTheDocument();
  });

  test('applies gradient text effects', () => {
    render(<Title {...defaultProps} />);
    
    const title1 = screen.getByText('Nossa');
    expect(title1).toHaveClass('bg-gradient-to-r', 'from-tertiary', 'to-secondary', 'bg-clip-text', 'text-transparent');
    
    const title2 = screen.getByText('Livraria');
    expect(title2).toHaveClass('bg-gradient-to-r', 'from-secondary', 'to-navy', 'bg-clip-text', 'text-transparent');
  });
});
