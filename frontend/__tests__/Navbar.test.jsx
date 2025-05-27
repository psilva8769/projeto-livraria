import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../src/components/Navbar';

// Mock icons
jest.mock('react-icons/tb', () => ({
  TbHomeFilled: () => <div data-testid="home-icon">HomeIcon</div>
}));
jest.mock('react-icons/io5', () => ({
  IoLibrary: () => <div data-testid="library-icon">LibraryIcon</div>,
  IoMailOpen: () => <div data-testid="mail-icon">MailIcon</div>
}));
jest.mock('react-icons/fa', () => ({
  FaRegWindowClose: () => <div data-testid="close-icon">CloseIcon</div>
}));

describe('Navbar Component', () => {
  const mockToggleMenu = jest.fn();
  const defaultProps = {
    containerStyles: 'test-container-style',
    toggleMenu: mockToggleMenu,
    menuOpened: false
  };

  const renderNavbar = (props = {}) => {
    return render(
      <BrowserRouter>
        <Navbar {...defaultProps} {...props} />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    mockToggleMenu.mockClear();
  });

  test('renders all navigation items', () => {
    renderNavbar();

    // Check for all nav items
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Shop')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();

    // Check for all icons
    expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    expect(screen.getByTestId('library-icon')).toBeInTheDocument();
    expect(screen.getByTestId('mail-icon')).toBeInTheDocument();
  });

  test('applies container styles correctly', () => {
    renderNavbar();
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('test-container-style');
  });

  test('renders close button and logo when menu is opened', () => {
    renderNavbar({ menuOpened: true });
    
    const closeIcon = screen.getByTestId('close-icon');
    expect(closeIcon).toBeInTheDocument();
    expect(screen.getByText('Bacala')).toBeInTheDocument();
  });

  test('does not render close button and logo when menu is closed', () => {
    renderNavbar({ menuOpened: false });
    
    expect(screen.queryByTestId('close-icon')).not.toBeInTheDocument();
    expect(screen.queryByText('Bacala')).not.toBeInTheDocument();
  });

  test('calls toggleMenu when close button is clicked', () => {
    renderNavbar({ menuOpened: true });
    
    const closeButton = screen.getByTestId('close-icon');
    fireEvent.click(closeButton);
    expect(mockToggleMenu).toHaveBeenCalled();
  });

  test('renders correct link types for navigation items', () => {
    renderNavbar();

    // Internal links should use NavLink
    const homeLink = screen.getByText('Home').closest('a');
    const shopLink = screen.getByText('Shop').closest('a');
    expect(homeLink).toHaveAttribute('href', '/');
    expect(shopLink).toHaveAttribute('href', '/shop');

    // External link (Contact) should use regular anchor
    const contactLink = screen.getByText('Contact').closest('a');
    expect(contactLink).toHaveAttribute('href', 'mailto:info@bacala.com');
  });

  test('applies active link styling', () => {
    renderNavbar();
    
    // Home link should be active by default (we're at '/' in BrowserRouter)
    const homeLink = screen.getByText('Home').closest('a');
    expect(homeLink).toHaveClass('active-link');
  });

  test('renders with correct flex styling for items', () => {
    renderNavbar();
    
    const navItems = screen.getAllByRole('link');
    navItems.forEach(item => {
      expect(item).toHaveClass('flexCenter', 'gap-x-2');
    });
  });
});
