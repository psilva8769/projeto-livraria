import React from 'react';
import { screen } from '@testing-library/react';
import Header from '../../src/components/Header';
import { renderWithProviders } from '../../src/test-utils';
import { ShopContext } from '../../__tests__/mocks/ShopContextMock';

// Mock ShopContext using the mock module
jest.mock('../../src/context/ShopContext', () => {
  return require('../../__tests__/mocks/ShopContextMock');
});

describe('Header Integration Tests', () => {
  test('renders Header component content', () => {
    renderWithProviders(<Header />);
    expect(screen.getByTestId('header-container')).toBeInTheDocument();
  });
});
