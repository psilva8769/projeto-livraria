import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../src/components/Header';
import { ShopContext } from '../src/context/ShopContext';

// Mock da logo e ícones
jest.mock('../assets/logo.png', () => 'logo-mock');
jest.mock('react-icons/cg', () => ({
  CgMenuLeft: () => <div data-testid="menu-icon">ÍconeMenu</div>
}));
jest.mock('react-icons/tb', () => ({
  TbUserCircle: () => <div data-testid="user-circle-icon">ÍconeUsuárioCircular</div>
}));
jest.mock('react-icons/ri', () => ({
  RiUserLine: () => <div data-testid="user-line-icon">ÍconeUsuárioLinha</div>,
  RiShoppingBag4Line: () => <div data-testid="shopping-bag-icon">ÍconeSacola</div>
}));

// Mock do componente Navbar
jest.mock('../src/components/Navbar', () => {
  return function MockNavbar(props) {
    return (
      <div data-testid="navbar-component">
        Componente Navbar
        <button onClick={props.toggleMenu}>Alternar Menu</button>
      </div>
    );
  };
});

describe('Componente Header', () => {
  // Mock do contexto com funções simuladas
  const mockContext = {
    navigate: jest.fn(),
    token: 'token-simulado',
    setToken: jest.fn(),
    getCartCount: jest.fn(() => 2),
    setCartItems: jest.fn()
  };

  // Função auxiliar para renderizar componente com contexto
  const renderWithContext = (component) => {
    return render(
      <BrowserRouter>
        <ShopContext.Provider value={mockContext}>
          {component}
        </ShopContext.Provider>
      </BrowserRouter>
    );
  };
  // Antes de cada teste, limpa os mocks e reseta a posição de scroll
  beforeEach(() => {
    // Reseta todos os mocks
    jest.clearAllMocks();
    // Reseta a posição de scroll da janela
    global.window.scrollY = 0;
  });

  // Verifica se o cabeçalho é renderizado com logo e navegação
  test('deve renderizar o cabeçalho com logo e navegação', () => {
    renderWithContext(<Header />);
    
    // Verifica a logo
    const logo = screen.getByRole('img');
    expect(logo).toHaveAttribute('src', 'logo-mock');
    
    // Verifica a barra de navegação
    expect(screen.getByTestId('navbar-component')).toBeInTheDocument();
  });

  // Verifica se o menu é alternado ao clicar no ícone
  test('deve alternar o menu quando o ícone é clicado', () => {
    renderWithContext(<Header />);
    
    const menuButton = screen.getByTestId('menu-icon');
    fireEvent.click(menuButton);
    
    // Menu deve estar aberto
    expect(screen.getByTestId('navbar-component')).toBeInTheDocument();
    
    // Clica novamente para fechar
    fireEvent.click(menuButton);
  });
  test('deve gerenciar o logout corretamente', () => {
    renderWithContext(<Header />);
    
    const botaoLogout = screen.getByText('Log out');
    fireEvent.click(botaoLogout);
    
    expect(mockContext.navigate).toHaveBeenCalledWith('/login');
    expect(mockContext.setToken).toHaveBeenCalledWith('');
    expect(mockContext.setCartItems).toHaveBeenCalledWith({});
  });

  test('deve alterar o estilo do cabeçalho ao rolar a página', () => {
    renderWithContext(<Header />);
    
    // Inicialmente
    const cabecalho = screen.getByRole('banner');
    expect(header.querySelector('div')).toHaveClass('bg-primary', 'py-3');
    
    // Simulate scroll
    act(() => {
      global.window.scrollY = 31;
      global.window.dispatchEvent(new Event('scroll'));
    });
    
    // After scroll
    expect(header.querySelector('div')).toHaveClass('bg-white', 'py-2.5');
  });
  test('deve exibir a quantidade de itens no carrinho', () => {
    mockContext.getCartCount.mockReturnValue(5);
    renderWithContext(<Header />);
    
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  test('deve fechar o menu ao rolar a página', () => {
    renderWithContext(<Header />);
    
    // Abre o menu
    const botaoMenu = screen.getByTestId('menu-icon');
    fireEvent.click(botaoMenu);
    
    // Simula a rolagem
    act(() => {
      global.window.scrollY = 1;
      global.window.dispatchEvent(new Event('scroll'));
    });
    
    // O menu deve estar fechado (isso pode ser verificado por uma classe ou estado dependendo da implementação)
    // Podemos verificar isso através do comportamento ou estado da UI do componente
  });

  test('deve renderizar ações do usuário com base no estado de autenticação', () => {
    // Teste com token (autenticado)
    renderWithContext(<Header />);
    expect(screen.getByText('Log out')).toBeInTheDocument();
    
    // Teste sem token (não autenticado)
    mockContext.token = '';
    renderWithContext(<Header />);
    expect(screen.getByText('Log in')).toBeInTheDocument();
  });

  test('deve ter as classes de estilo corretas', () => {
    renderWithContext(<Header />);
    
    const cabecalho = screen.getByRole('banner');
    expect(cabecalho).toHaveClass('fixed', 'top-0', 'w-full', 'left-0', 'right-0', 'z-50');
    
    const container = cabecalho.firstChild;
    expect(container).toHaveClass('max-padd-container', 'flexBetween', 'border-b', 'border-slate-900/10', 'rounded', 'transition-all', 'duration-300');
  });

  test('deve remover o listener de rolagem na desmontagem', () => {
    const { unmount } = renderWithContext(<Header />);
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });
});
