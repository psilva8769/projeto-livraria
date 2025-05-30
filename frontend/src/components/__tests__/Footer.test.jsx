import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from '../Footer';

// Mock the data imported by Footer
jest.mock('../../assets/data', () => ({
  FOOTER_CONTACT_INFO: {
    title: 'Contatos',
    links: [
      { label: 'Email', value: 'info@example.com' },
      { label: 'Telefone', value: '+1 234 567 890' }
    ]
  },
  FOOTER_LINKS: [
    {
      title: 'Links Rápidos',
      links: ['Home', 'Loja']
    }
  ],
  SOCIALS: {
    title: 'Redes Sociais',
    links: [
      { id: 1, icon: 'mockIcon' },
      { id: 2, icon: 'mockIcon' }
    ]
  }
}));

// Mock the logo import
jest.mock('../../assets/logo.png', () => 'mockLogoPath');

describe('Footer Component', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
  });

  test('renders the main heading correctly', () => {
    expect(screen.getByText('Descubra livros que despertam sua imaginação')).toBeInTheDocument();
  });

  test('renders footer links section', () => {
    expect(screen.getByText('Links Rápidos')).toBeInTheDocument();
  });
});
