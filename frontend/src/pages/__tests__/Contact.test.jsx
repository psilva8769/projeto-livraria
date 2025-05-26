import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Contact from '../Contact';

// Mock Footer component
jest.mock('../../components/Footer', () => {
  return function MockFooter() {
    return <div data-testid="footer-component">Footer Component</div>;
  };
});

describe('Contact Page', () => {
  test('renders contact page', () => {
    render(<Contact />);
    
    // The page should render without crashing
    expect(screen.getByTestId('footer-component')).toBeInTheDocument();
  });

  test('renders contact page title', () => {
    render(<Contact />);
    
    // Look for contact-related text
    const contactElements = screen.getAllByText(/contato/i);
    expect(contactElements.length).toBeGreaterThan(0);
  });

  test('renders footer component', () => {
    render(<Contact />);
    
    expect(screen.getByTestId('footer-component')).toBeInTheDocument();
  });

  test('renders without crashing', () => {
    expect(() => render(<Contact />)).not.toThrow();
  });
});
