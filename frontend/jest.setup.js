// Setup global para import.meta - ensure this is properly defined
global.import = {
  meta: {
    env: {
      VITE_BACKEND_URL: 'http://localhost:5000',
    }
  }
};

// Add import.meta.env directly to the global scope with proper value definition
Object.defineProperty(global, 'import', {
  value: global.import,
  writable: true
});

Object.defineProperty(global.import, 'meta', {
  value: global.import.meta,
  writable: true
});

Object.defineProperty(global.import.meta, 'env', {
  value: global.import.meta.env,
  writable: true
});

Object.defineProperty(global.import.meta.env, 'VITE_BACKEND_URL', {
  value: 'http://localhost:5000',
  writable: true
});

// Mock do window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock do IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};
