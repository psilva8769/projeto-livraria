import React from 'react';
import { screen } from '@testing-library/react';
import Navbar from '../../src/components/Navbar';
import { renderWithProviders } from '../../src/test-utils';
import { ShopContext } from '../../__tests__/mocks/ShopContextMock';

// Mock ShopContext using the mock module
jest.mock('../../src/context/ShopContext', () => {
  return require('../../__tests__/mocks/ShopContextMock');
});

describe('Navbar Integration Tests', () => {
  test('renders Navbar component content', () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByTestId('navbar-container')).toBeInTheDocument();
  });
});
