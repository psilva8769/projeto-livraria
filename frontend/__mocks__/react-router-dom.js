import React, { createContext, useContext, useMemo } from 'react';

// Mock do React Router DOM
const mockNavigate = jest.fn();

// Context for router state
const RouterContext = createContext();

// Mock location state
let mockLocationState = {
  pathname: '/',
  search: '',
  hash: '',
  state: null,
  key: 'default'
};

// Mock router provider
const MockRouterProvider = ({ children, initialEntries = ['/'] }) => {
  const currentPath = initialEntries[initialEntries.length - 1] || '/';
  
  // Update mock location when path changes
  mockLocationState = {
    ...mockLocationState,
    pathname: currentPath
  };

  const routerValue = {
    location: mockLocationState,
    navigate: mockNavigate,
    pathname: currentPath
  };

  return React.createElement(RouterContext.Provider, { value: routerValue }, children);
};

// Mock Routes component that actually matches routes
const MockRoutes = ({ children }) => {
  const router = useContext(RouterContext);
  const currentPath = router?.pathname || '/';
  
  // Convert children to array if it's not already
  const routes = React.Children.toArray(children);
  
  // Find matching route
  for (const route of routes) {
    if (route.props && route.props.path === currentPath) {
      return route.props.element || null;
    }
  }
  
  // No match found, return null
  return null;
};

// Mock Route component (doesn't render anything, just holds props)
const MockRoute = ({ element, path }) => {
  return null; // Routes component handles the rendering
};

module.exports = {
  useNavigate: () => mockNavigate,
  useLocation: () => {
    const router = useContext(RouterContext);
    return router?.location || mockLocationState;
  },
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
  BrowserRouter: ({ children }) => React.createElement(MockRouterProvider, { initialEntries: ['/'] }, children),
  MemoryRouter: ({ children, initialEntries }) => React.createElement(MockRouterProvider, { initialEntries }, children),
  Routes: MockRoutes,
  Route: MockRoute,
  Navigate: ({ to }) => React.createElement('div', { 'data-testid': 'navigate', 'data-to': to }),
  mockNavigate
};
