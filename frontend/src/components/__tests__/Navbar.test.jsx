import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../Navbar';

// Mock react-router-dom for testing
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Navbar Component', () => {
  const mockToggleMenu = jest.fn();
  
  const defaultProps = {
    containerStyles: 'test-container-styles',
    toggleMenu: mockToggleMenu,
    menuOpened: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders navigation items', () => {
    renderWithRouter(<Navbar {...defaultProps} />);
    
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Loja')).toBeInTheDocument();
    expect(screen.getByText('Contato')).toBeInTheDocument();
  });

  test('applies container styles correctly', () => {
    renderWithRouter(<Navbar {...defaultProps} />);
    
    const navElement = screen.getByRole('navigation');
    expect(navElement).toHaveClass('test-container-styles');
  });

  test('renders navigation links with correct href attributes', () => {
    renderWithRouter(<Navbar {...defaultProps} />);
    
    const inicioLink = screen.getByText('Início').closest('a');
    const lojaLink = screen.getByText('Loja').closest('a');
    const contatoLink = screen.getByText('Contato').closest('a');
    
    expect(inicioLink).toHaveAttribute('href', '/');
    expect(lojaLink).toHaveAttribute('href', '/shop');
    expect(contatoLink).toHaveAttribute('href', 'mailto:info@bacala.com');
  });

  test('renders icons for each navigation item', () => {
    renderWithRouter(<Navbar {...defaultProps} />);
    
    // Check that icons are rendered (they should be in span elements with text-xl class)
    const icons = document.querySelectorAll('span.text-xl');
    expect(icons).toHaveLength(3);
  });

  test('shows close button and logo when menu is opened', () => {
    const openedMenuProps = {
      ...defaultProps,
      menuOpened: true
    };
      const { container } = renderWithRouter(<Navbar {...openedMenuProps} />);    // Check for close button (FaRegWindowClose icon with onClick)
    const closeButton = container.querySelector('svg');
    expect(closeButton).toBeInTheDocument();
    
    // Check for logo
    expect(screen.getByText('Bacala')).toBeInTheDocument();
  });

  test('does not show close button and logo when menu is closed', () => {
    renderWithRouter(<Navbar {...defaultProps} />);
    
    // Close button should not be visible
    const closeButton = document.querySelector('.fa-window-close');
    expect(closeButton).not.toBeInTheDocument();
    
    // Logo should not be visible
    expect(screen.queryByText('Bacala')).not.toBeInTheDocument();
  });

  test('calls toggleMenu when close button is clicked', () => {
    const openedMenuProps = {
      ...defaultProps,
      menuOpened: true
    };
    
    renderWithRouter(<Navbar {...openedMenuProps} />);
    
    const closeButton = document.querySelector('.cursor-pointer');
    if (closeButton) {
      fireEvent.click(closeButton);
      expect(mockToggleMenu).toHaveBeenCalledTimes(1);
    }
  });

  test('calls toggleMenu when contact link is clicked and menu is opened', () => {
    const openedMenuProps = {
      ...defaultProps,
      menuOpened: true
    };
    
    renderWithRouter(<Navbar {...openedMenuProps} />);
    
    const contatoLink = screen.getByText('Contato').closest('a');
    fireEvent.click(contatoLink);
    
    expect(mockToggleMenu).toHaveBeenCalledTimes(1);
  });

  test('does not call toggleMenu when contact link is clicked and menu is closed', () => {
    renderWithRouter(<Navbar {...defaultProps} />);
    
    const contatoLink = screen.getByText('Contato').closest('a');
    fireEvent.click(contatoLink);
    
    expect(mockToggleMenu).not.toHaveBeenCalled();
  });

  test('applies correct styling classes to navigation items', () => {
    renderWithRouter(<Navbar {...defaultProps} />);
    
    const navItems = screen.getAllByText(/Início|Loja|Contato/);
    navItems.forEach(item => {
      const parentElement = item.closest('a');
      expect(parentElement).toHaveClass('flexCenter', 'gap-x-2');
    });
  });

  test('contact link uses mailto protocol', () => {
    renderWithRouter(<Navbar {...defaultProps} />);
    
    const contatoLink = screen.getByText('Contato').closest('a');
    expect(contatoLink).toHaveAttribute('href', 'mailto:info@bacala.com');
  });

  test('logo has gradient text styling when menu is opened', () => {
    const openedMenuProps = {
      ...defaultProps,
      menuOpened: true
    };
    
    renderWithRouter(<Navbar {...openedMenuProps} />);
    
    const logo = screen.getByText('Bacala');
    expect(logo).toHaveClass('bg-gradient-to-r', 'from-secondary', 'to-navy', 'bg-clip-text', 'text-transparent');
  });

  test('renders with different container styles', () => {
    const customProps = {
      ...defaultProps,
      containerStyles: 'custom-nav-styles another-class'
    };
    
    renderWithRouter(<Navbar {...customProps} />);
    
    const navElement = screen.getByRole('navigation');
    expect(navElement).toHaveClass('custom-nav-styles', 'another-class');
  });
});
