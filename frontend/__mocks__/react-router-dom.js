import React from 'react';

// Mock do React Router DOM
const mockNavigate = jest.fn();
const mockLocation = {
  pathname: '/',
  search: '',
  hash: '',
  state: null,
  key: 'default'
};

module.exports = {
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
  Link: ({ children, to, ...props }) => {
    return React.createElement('a', { href: to, ...props }, children);
  },
  NavLink: ({ children, to, className, ...props }) => {
    // Mock NavLink to always render as active for testing
    const computedClassName = typeof className === 'function' 
      ? className({ isActive: false, isPending: false }) 
      : className;
    return React.createElement('a', { 
      href: to, 
      className: computedClassName,
      'data-testid': 'navlink',
      ...props 
    }, children);
  },
  BrowserRouter: ({ children }) => children,
  Routes: ({ children }) => children,
  Route: ({ children }) => children,
  Navigate: ({ to }) => React.createElement('div', { 'data-testid': 'navigate', 'data-to': to }),
  mockNavigate
};
