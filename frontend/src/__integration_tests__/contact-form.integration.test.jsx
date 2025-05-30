import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, defaultContextValue } from '../utils/testUtils';
import Contact from '../pages/Contact';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

// Mock window.scrollTo to avoid errors
window.scrollTo = jest.fn();

// Mock console.log to test form submission
console.log = jest.fn();

describe('Contact Form Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
    test('should navigate to contact page and submit the form successfully', async () => {
    const mockNavigate = jest.fn();
    const mockContextValue = {
      ...defaultContextValue,
      navigate: mockNavigate
    };

    renderWithProviders(
      <App />,
      { 
        contextValue: mockContextValue,
        initialEntries: ['/contact']
      }
    );

    // Fill out the form
    const nameInput = await screen.findByPlaceholderText('Seu nome completo');
    const emailInput = await screen.findByPlaceholderText('seu@email.com');
    const subjectInput = await screen.findByPlaceholderText('Assunto da mensagem');
    const messageInput = await screen.findByPlaceholderText('Escreva sua mensagem aqui...');

    await userEvent.type(nameInput, 'Test User');
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(subjectInput, 'Test Subject');
    await userEvent.type(messageInput, 'This is a test message.');

    // Submit the form
    const submitButton = await screen.findByRole('button', { name: /enviar mensagem/i });
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
  test('should validate required fields in the contact form', async () => {
    renderWithProviders(<App />, {
      initialEntries: ['/contact']
    });

    // Try to submit the form without filling the fields
    const submitButton = await screen.findByRole('button', { name: /enviar mensagem/i });
    fireEvent.click(submitButton);

    // Check if form submission was NOT successful
    expect(console.log).not.toHaveBeenCalledWith(
      expect.stringContaining('Form submitted:'),
      expect.any(Object)
    );
    
    // Verify HTML5 validation is triggered
    // Note: This test will help ensure form fields have the required attribute
    const nameInput = await screen.findByPlaceholderText('Seu nome completo');
    expect(nameInput).toBeRequired();
    
    const emailInput = await screen.findByPlaceholderText('seu@email.com');
    expect(emailInput).toBeRequired();
    
    const subjectInput = await screen.findByPlaceholderText('Assunto da mensagem');
    expect(subjectInput).toBeRequired();
    
    const messageInput = await screen.findByPlaceholderText('Escreva sua mensagem aqui...');
    expect(messageInput).toBeRequired();
  });
});
