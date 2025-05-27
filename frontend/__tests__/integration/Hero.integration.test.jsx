import React from 'react';
import { screen } from '@testing-library/react';
import Hero from '../../src/components/Hero';
import { renderWithProviders } from '../../src/test-utils';
import { ShopContext } from '../../__tests__/mocks/ShopContextMock';

// Mock ShopContext using the mock module
jest.mock('../../src/context/ShopContext', () => {
  return require('../../__tests__/mocks/ShopContextMock');
});

describe('Hero Integration Tests', () => {  test('renders Hero component content', () => {
    renderWithProviders(<Hero />);
    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('hero-content')).toBeInTheDocument();
  });
});
