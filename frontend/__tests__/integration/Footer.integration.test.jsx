import React from 'react';
import { screen } from '@testing-library/react';
import Footer from '../../src/components/Footer';
import { renderWithProviders } from '../../src/test-utils';
import { ShopContext } from '../../__tests__/mocks/ShopContextMock';

// Mock ShopContext using the mock module
jest.mock('../../src/context/ShopContext', () => {
  return require('../../__tests__/mocks/ShopContextMock');
});

describe('Footer Integration Tests', () => {
  test('renders Footer component content', () => {
    renderWithProviders(<Footer />);
    expect(screen.getByTestId('footer-container')).toBeInTheDocument();
  });
});
