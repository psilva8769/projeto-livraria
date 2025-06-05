// Setup global para import.meta - garanta que isso esteja devidamente definido
global.import = {
  meta: {
    env: {
      VITE_BACKEND_URL: 'http://localhost:5000',
    }
  }
};

// Adiciona import.meta.env diretamente ao escopo global com definição de valor adequada
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

// Mock de window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // obsoleto
    removeListener: jest.fn(), // obsoleto
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock de IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};
