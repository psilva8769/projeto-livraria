import React from 'react';
import { render, screen } from '@testing-library/react';
import Title from '../../src/components/Title';
import { renderWithProviders } from '../../src/test-utils';
import { ShopContext } from '../../__tests__/mocks/ShopContextMock';

// Mock ShopContext using the mock module
jest.mock('../../src/context/ShopContext', () => {
  return require('../../__tests__/mocks/ShopContextMock');
});

describe('Title Integration Tests', () => {
  test('renders title parts correctly', () => {
    renderWithProviders(
      <Title
        title1="First"
        title2="Second"
      />
    );

    expect(screen.getByTestId('title-part1')).toHaveTextContent('First');
    expect(screen.getByTestId('title-part2')).toHaveTextContent('Second');
  });
  
  test('applies custom title styles', () => {
    renderWithProviders(
      <Title
        title1="Test"
        title2="Title"
        titleStyles="custom-title-class"
        title1Styles="custom-title1-class"
      />
    );

    const titleContainer = screen.getByTestId('title-container');
    expect(titleContainer).toHaveClass('custom-title-class');
    
    const title1Element = screen.getByTestId('title-part1');
    expect(title1Element).toHaveClass('custom-title1-class');
  });
  
  test('shows paragraph when paraStyles is set', () => {
    renderWithProviders(
      <Title
        title1="Test"
        title2="Title"
        paraStyles="!block"
      />
    );

    const paragraph = screen.getByTestId('title-paragraph');
    expect(paragraph).toHaveClass('!block');
    expect(paragraph).toBeVisible();
  });

  test('hides paragraph by default', () => {
    renderWithProviders(
      <Title
        title1="Test"
        title2="Title"
      />
    );

    const paragraph = screen.getByTestId('title-paragraph');
    expect(paragraph).toHaveClass('hidden');
  });

  test('applies secondary color to second title part', () => {
    renderWithProviders(
      <Title
        title1="First"
        title2="Second"
      />
    );

    const secondPart = screen.getByTestId('title-part2');
    expect(secondPart).toHaveClass('text-secondary');
    expect(secondPart).toHaveClass('!font-light');
  });

  test('renders with all style props undefined', () => {
    renderWithProviders(
      <Title
        title1="Test"
        title2="Title"
      />
    );

    const titleContainer = screen.getByTestId('title-container');
    expect(titleContainer).toHaveClass('pb-1');
    expect(screen.getByTestId('title-part1')).toHaveClass('h2');
  });

  test('renders multiline paragraph correctly', () => {
    renderWithProviders(
      <Title
        title1="Test"
        title2="Title"
        paraStyles="!block"
      />
    );

    const paragraph = screen.getByTestId('title-paragraph');
    expect(paragraph.innerHTML).toContain('<br');
    expect(paragraph).toHaveTextContent(/perfect read for every moment/);
  });
});
