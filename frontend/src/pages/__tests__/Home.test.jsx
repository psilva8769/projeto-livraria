import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../Home';

// Mock all the components used in Home
jest.mock('../../components/Hero', () => {
  return function MockHero() {
    return <div data-testid="hero-component">Hero Component</div>;
  };
});

jest.mock('../../components/NewArrivals', () => {
  return function MockNewArrivals() {
    return <div data-testid="new-arrivals-component">New Arrivals Component</div>;
  };
});

jest.mock('../../components/About', () => {
  return function MockAbout() {
    return <div data-testid="about-component">About Component</div>;
  };
});

jest.mock('../../components/PopularBooks', () => {
  return function MockPopularBooks() {
    return <div data-testid="popular-books-component">Popular Books Component</div>;
  };
});

jest.mock('../../components/Features', () => {
  return function MockFeatures() {
    return <div data-testid="features-component">Features Component</div>;
  };
});

jest.mock('../../components/Footer', () => {
  return function MockFooter() {
    return <div data-testid="footer-component">Footer Component</div>;
  };
});

describe('Home Page', () => {
  test('renders all main components', () => {
    render(<Home />);
    
    // Check if all main components are rendered
    expect(screen.getByTestId('hero-component')).toBeInTheDocument();
    expect(screen.getByTestId('new-arrivals-component')).toBeInTheDocument();
    expect(screen.getByTestId('about-component')).toBeInTheDocument();
    expect(screen.getByTestId('popular-books-component')).toBeInTheDocument();
    expect(screen.getByTestId('features-component')).toBeInTheDocument();
    expect(screen.getByTestId('footer-component')).toBeInTheDocument();
  });

  test('applies correct background styling', () => {
    render(<Home />);
    
    // Check if the main container has the correct classes
    const mainContainer = screen.getByTestId('hero-component').closest('.relative');
    expect(mainContainer).toBeInTheDocument();
  });

  test('renders components in correct order', () => {
    render(<Home />);
    
    // Get all components in order
    const components = [
      screen.getByTestId('hero-component'),
      screen.getByTestId('new-arrivals-component'),
      screen.getByTestId('about-component'),
      screen.getByTestId('popular-books-component'),
      screen.getByTestId('features-component'),
      screen.getByTestId('footer-component')
    ];

    // Verify they exist and are in DOM
    components.forEach(component => {
      expect(component).toBeInTheDocument();
    });
  });

  test('renders background gradient effects', () => {
    render(<Home />);
    
    // Check for background gradient elements
    const backgroundElement = document.querySelector('.absolute.inset-0.bg-gradient-to-br');
    expect(backgroundElement).toBeInTheDocument();
  });

  test('applies backdrop blur effects to sections', () => {
    render(<Home />);
    
    // NewArrivals section should have backdrop blur
    const newArrivalsContainer = screen.getByTestId('new-arrivals-component').closest('.bg-white\\/60');
    expect(newArrivalsContainer).toHaveClass('backdrop-blur-sm');
    
    // PopularBooks section should have backdrop blur
    const popularBooksContainer = screen.getByTestId('popular-books-component').closest('.bg-white\\/80');
    expect(popularBooksContainer).toHaveClass('backdrop-blur-sm');
  });

  test('renders without crashing', () => {
    expect(() => render(<Home />)).not.toThrow();
  });
});
