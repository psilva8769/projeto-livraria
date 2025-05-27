import React from 'react';
import { screen } from '@testing-library/react';
import Verify from '../../src/pages/Verify';
import { renderWithProviders } from '../../src/test-utils';
import { ShopContext } from '../../__tests__/mocks/ShopContextMock';

// Mock ShopContext using the mock module
jest.mock('../../src/context/ShopContext', () => {
  return require('../../__tests__/mocks/ShopContextMock');
});

describe('Verify Page Integration Tests', () => {
  test('renders Verify page content', () => {
    renderWithProviders(<Verify />);
    expect(screen.getByTestId('verify-page')).toBeInTheDocument();
  });
});
