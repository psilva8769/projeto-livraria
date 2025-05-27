import React from 'react';
import { screen } from '@testing-library/react';
import Login from '../../src/pages/Login';
import { renderWithProviders } from '../../src/test-utils';
import { ShopContext } from '../../__tests__/mocks/ShopContextMock';

// Mock ShopContext using the mock module
jest.mock('../../src/context/ShopContext', () => {
  return require('../../__tests__/mocks/ShopContextMock');
});

describe('Login Page Integration Tests', () => {
  test('renders Login page content', () => {
    renderWithProviders(<Login />);
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });
});
