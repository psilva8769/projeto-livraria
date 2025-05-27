import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from '../src/components/Footer';

// Mock da logo
jest.mock('../assets/logo.png', () => 'logo-mock');

// Mock dos dados do rodapé
jest.mock('../src/assets/data', () => ({  FOOTER_LINKS: [
    {
      title: 'Empresa',
      links: ['Sobre Nós', 'Carreiras', 'Nossa Equipe']
    },
    {
      title: 'Ajuda',
      links: ['Perguntas Frequentes', 'Suporte', 'Contato']
    }
  ],
  FOOTER_CONTACT_INFO: {
    title: 'Fale Conosco',
    links: [
      { label: 'Telefone', value: '+55 (11) 1234-5678' },
      { label: 'Email', value: 'contato@bacala.com.br' }
    ]
  },
  SOCIALS: {
    title: 'Redes Sociais',
    links: [
      { id: 'facebook', icon: 'FacebookIcon' },
      { id: 'twitter', icon: 'TwitterIcon' }
    ]
  }
}));

const FooterColumn = ({ title, children }) => (
  <div>
    <h4>{title}</h4>
    {children}
  </div>
);

describe('Componente Footer', () => {
  // Antes de cada teste, renderiza o componente com o BrowserRouter
  beforeEach(() => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
  });

  // Verifica se o título principal e a descrição são renderizados
  test('deve renderizar o título principal e a descrição', () => {
    expect(screen.getByText('Descubra livros que incendeiam sua imaginação')).toBeInTheDocument();
    expect(screen.getByText(/Lorem ipsum dolor, sit amet consectetur adipisicing elit/)).toBeInTheDocument();
  });
  // Verifica se a logo e o nome da marca são renderizados
  test('deve renderizar a logo e o nome da marca', () => {
    const logo = screen.getByRole('img', { name: '' });
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('height', '36');
    expect(logo).toHaveAttribute('width', '36');
    expect(screen.getByText('Bacala')).toBeInTheDocument();
  });

  // Verifica se o formulário de inscrição por email é renderizado
  test('deve renderizar o formulário de inscrição por email', () => {
    const emailInput = screen.getByPlaceholderText('Digite seu email');
    const subscribeButton = screen.getByText('Inscrever-se');
    
    expect(emailInput).toBeInTheDocument();
    expect(subscribeButton).toBeInTheDocument();
  });
  // Verifica se todas as colunas do rodapé são renderizadas
  test('deve renderizar todas as colunas do rodapé', () => {
    // Seção da Empresa
    expect(screen.getByText('Empresa')).toBeInTheDocument();
    expect(screen.getByText('Sobre Nós')).toBeInTheDocument();
    expect(screen.getByText('Carreiras')).toBeInTheDocument();
    expect(screen.getByText('Nossa Equipe')).toBeInTheDocument();

    // Seção de Ajuda
    expect(screen.getByText('Ajuda')).toBeInTheDocument();
    expect(screen.getByText('Perguntas Frequentes')).toBeInTheDocument();
    expect(screen.getByText('Suporte')).toBeInTheDocument();
    expect(screen.getByText('Contato')).toBeInTheDocument();
  });

  // Verifica se as informações de contato são renderizadas
  test('deve renderizar as informações de contato', () => {
    expect(screen.getByText('Fale Conosco')).toBeInTheDocument();
    expect(screen.getByText('Telefone:')).toBeInTheDocument();
    expect(screen.getByText('+55 (11) 1234-5678')).toBeInTheDocument();
    expect(screen.getByText('Email:')).toBeInTheDocument();
    expect(screen.getByText('contato@bacala.com.br')).toBeInTheDocument();
  });
  // Verifica se a seção de redes sociais é renderizada
  test('deve renderizar a seção de redes sociais', () => {
    expect(screen.getByText('Redes Sociais')).toBeInTheDocument();
    // Aqui testaríamos os ícones de redes sociais se estivessem renderizados adequadamente
  });

  // Verifica se as classes de estilo estão aplicadas corretamente
  test('deve aplicar as classes de estilo corretamente', () => {
    // Container principal do rodapé
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('mb-4');

    // Seção do cabeçalho
    const headerSection = document.querySelector('.rounded-tr-3xl');
    expect(headerSection).toHaveClass(
      'rounded-tl-3xl',  // Borda superior esquerda arredondada
      'pt-12',          // Padding top em telas menores
      'xl:pt-20',       // Padding top em telas xl
      'pb-8'           // Padding bottom
    );

    // Container do formulário de email
    const emailContainer = document.querySelector('.flexBetween');
    expect(emailContainer).toHaveClass(
      'pl-3',          // Padding left
      'h-[3rem]',      // Altura fixa
      'bg-primary',    // Cor de fundo primária
      'rounded-full'   // Totalmente arredondado
    );
  });

  // Verifica se o input de email tem os atributos corretos
  test('deve ter os atributos corretos no input de email', () => {
    const emailInput = screen.getByPlaceholderText('Digite seu email');
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveClass(
      'bg-transparent',    // Fundo transparente
      'border-none',      // Sem borda
      'outline-none'      // Sem outline
    );
  });

  // Verifica se o botão de inscrição tem o estilo correto
  test('deve ter o estilo correto no botão de inscrição', () => {
    const subscribeButton = screen.getByText('Inscrever-se');
    expect(subscribeButton).toHaveClass(
      'btn-secondaryOne',   // Estilo secundário do botão
      'relative',          // Posicionamento relativo
      'right-[24px]'      // Deslocamento à direita
    );
  });
});
