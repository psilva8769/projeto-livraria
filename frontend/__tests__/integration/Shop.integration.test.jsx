import React from 'react';
import { screen } from '@testing-library/react';
import Shop from '../../src/pages/Shop';
import { renderWithProviders } from '../../src/test-utils';
import { ShopContext } from '../../__tests__/mocks/ShopContextMock';

// Mock ShopContext using the mock module
jest.mock('../../src/context/ShopContext', () => {
  return require('../../__tests__/mocks/ShopContextMock');
});

describe('Shop Page Integration Tests', () => {
  test('renders Shop page content', () => {
    renderWithProviders(<Shop />);
    expect(screen.getByTestId('shop-page')).toBeInTheDocument();
  });
});
