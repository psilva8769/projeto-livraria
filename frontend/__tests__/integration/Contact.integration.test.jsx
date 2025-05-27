import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Contact from '../../src/pages/Contact';
import { BrowserRouter } from 'react-router-dom';

// Use explicit mock to avoid issues with import.meta
jest.mock('../../src/context/ShopContext', () => ({
  ShopContext: {
    Provider: ({ children }) => children,
    Consumer: (props) => props.children({})
  }
}));

describe('Contact Form Integration Tests', () => {
  beforeEach(() => {
    // Mock setTimeout to execute immediately
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <Contact />
      </BrowserRouter>
    );
  };

  test('renders Contact form content', () => {
    renderComponent();
    expect(screen.getByTestId('contact-form')).toBeInTheDocument();
    expect(screen.getByTestId('name-input')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('message-input')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  test('validates form fields and shows error messages', () => {
    renderComponent();
    
    // Submit empty form
    fireEvent.click(screen.getByTestId('submit-button'));
    
    // Error messages should appear
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Message is required')).toBeInTheDocument();
  });

  test('clears error messages when user starts typing', () => {
    renderComponent();
    
    // Submit empty form
    fireEvent.click(screen.getByTestId('submit-button'));
    
    // Error messages should appear
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    
    // Type in name field
    fireEvent.change(screen.getByTestId('name-input'), { 
      target: { name: 'name', value: 'John Doe' } 
    });
    
    // Name error should disappear
    expect(screen.queryByText('Name is required')).not.toBeInTheDocument();
    
    // Other errors should still be visible
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Message is required')).toBeInTheDocument();
  });

  test('submits form successfully when all fields are filled', async () => {
    renderComponent();
    
    // Fill out form
    fireEvent.change(screen.getByTestId('name-input'), { 
      target: { name: 'name', value: 'John Doe' } 
    });
    
    fireEvent.change(screen.getByTestId('email-input'), { 
      target: { name: 'email', value: 'john@example.com' } 
    });
    
    fireEvent.change(screen.getByTestId('message-input'), { 
      target: { name: 'message', value: 'This is a test message' } 
    });
    
    // Submit form
    fireEvent.click(screen.getByTestId('submit-button'));
    
    // Fast-forward timer to complete the setTimeout
    jest.runAllTimers();
    
    // Success message should appear
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Message sent successfully!')).toBeInTheDocument();
    });
    
    // Form should be reset
    expect(screen.getByTestId('name-input')).toHaveValue('');
    expect(screen.getByTestId('email-input')).toHaveValue('');
    expect(screen.getByTestId('message-input')).toHaveValue('');
  });
});
