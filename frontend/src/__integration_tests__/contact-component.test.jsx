import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Contact from '../pages/Contact';

// Mock console.log
console.log = jest.fn();

// Mock window.scrollTo
window.scrollTo = jest.fn();

describe('Contact Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render contact form and submit successfully', async () => {
    render(<Contact />);
    
    // Check if key elements are rendered
    expect(screen.getByText('Entre em')).toBeInTheDocument();
    expect(screen.getByText('Contato')).toBeInTheDocument();
    
    // Fill out the form
    const nameInput = screen.getByPlaceholderText('Seu nome completo');
    const emailInput = screen.getByPlaceholderText('seu@email.com');
    const subjectInput = screen.getByPlaceholderText('Assunto da mensagem');
    const messageInput = screen.getByPlaceholderText('Escreva sua mensagem aqui...');

    await userEvent.type(nameInput, 'Test User');
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(subjectInput, 'Test Subject');
    await userEvent.type(messageInput, 'This is a test message.');

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /enviar mensagem/i });
    fireEvent.click(submitButton);

    // Check if form submission was successful (console.log was called with form data)
    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith('Form submitted:', {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'This is a test message.'
      });
    });

    // Verify form is cleared after submission
    await waitFor(() => {
      expect(nameInput).toHaveValue('');
      expect(emailInput).toHaveValue('');
      expect(subjectInput).toHaveValue('');
      expect(messageInput).toHaveValue('');
    });
  });

  test('should validate required fields', async () => {
    render(<Contact />);

    // Try to submit the form without filling the fields
    const submitButton = screen.getByRole('button', { name: /enviar mensagem/i });
    fireEvent.click(submitButton);

    // Check if form submission was NOT successful
    expect(console.log).not.toHaveBeenCalledWith(
      expect.stringContaining('Form submitted:'),
      expect.any(Object)
    );
    
    // Verify HTML5 validation is triggered
    const nameInput = screen.getByPlaceholderText('Seu nome completo');
    expect(nameInput).toBeRequired();
    
    const emailInput = screen.getByPlaceholderText('seu@email.com');
    expect(emailInput).toBeRequired();
    
    const subjectInput = screen.getByPlaceholderText('Assunto da mensagem');
    expect(subjectInput).toBeRequired();
    
    const messageInput = screen.getByPlaceholderText('Escreva sua mensagem aqui...');
    expect(messageInput).toBeRequired();
  });
});
