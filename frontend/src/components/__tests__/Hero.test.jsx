import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Hero from '../Hero';

// Mock the background and pencil image imports
jest.mock('../../assets/bg.png', () => 'mockBgPath');
jest.mock('../../assets/pencil.png', () => 'mockPencilPath');

describe('Hero Component', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <Hero />
      </BrowserRouter>
    );
  });

  test('renders the library badge text', () => {
    expect(screen.getByText('Biblioteca Digital Moderna')).toBeInTheDocument();
  });

  test('renders the call-to-action button', () => {
    expect(screen.getByText('Explorar Agora')).toBeInTheDocument();
  });
});
