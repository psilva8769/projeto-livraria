import React from 'react';
import { render, screen } from '@testing-library/react';
import About from '../About';

describe('About Component', () => {
  beforeEach(() => {
    render(<About />);
  });

  test('renders the main title correctly', () => {
    expect(screen.getByText("Descubra as")).toBeInTheDocument();
    expect(screen.getByText("principais vantagens da nossa loja!")).toBeInTheDocument();
  });

  test('renders all feature sections', () => {
    // Check all feature headings
    expect(screen.getByText('Processo de Devolução Fácil')).toBeInTheDocument();
    expect(screen.getByText('Opções de Pagamento Seguras')).toBeInTheDocument();
    expect(screen.getByText('Atendimento ao Cliente em Tempo Real')).toBeInTheDocument();
  });

  test('renders feature icons', () => {
    // Check if all TbTruckReturn icons are rendered
    const icons = document.querySelectorAll('.text-2xl');
    expect(icons).toHaveLength(3);
  });

  test('renders about image', () => {
    const image = screen.getByAltText('aboutImg');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('height', '244');
    expect(image).toHaveAttribute('width', '244');
  });

  test('has correct styling classes', () => {
    // Check for main section styling
    expect(document.querySelector('.max-padd-container')).toBeInTheDocument();
    expect(document.querySelector('.py-16')).toBeInTheDocument();
    
    // Check for feature container styling
    const featureContainers = document.querySelectorAll('.flexCenter.gap-x-6');
    expect(featureContainers).toHaveLength(3);

    // Check for image container styling
    expect(document.querySelector('.bg-gradient-to-br')).toBeInTheDocument();
  });

  test('renders all feature descriptions', () => {
    // Check the first feature description
    expect(screen.getByText(/Não ficou satisfeito\? Oferecemos um processo de devolução simples/)).toBeInTheDocument();
    
    // Check the second feature description
    expect(screen.getByText(/Seus dados estão protegidos com criptografia SSL/)).toBeInTheDocument();
    
    // Check the third feature description
    expect(screen.getByText(/Nossa equipe está sempre disponível para ajudar você/)).toBeInTheDocument();
  });
});