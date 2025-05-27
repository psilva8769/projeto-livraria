import React from 'react';
import { screen } from '@testing-library/react';
import Features from '../../src/components/Features';
import { renderWithProviders } from '../../src/test-utils';
import { ShopContext } from '../../__tests__/mocks/ShopContextMock';

// Mock ShopContext using the mock module
jest.mock('../../src/context/ShopContext', () => {
  return require('../../__tests__/mocks/ShopContextMock');
});

describe('Features Integration Tests', () => {
  test('renders Features component content', () => {
    renderWithProviders(<Features />);
    expect(screen.getByTestId('features-container')).toBeInTheDocument();
  });
});
