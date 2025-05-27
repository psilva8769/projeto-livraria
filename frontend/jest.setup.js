import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock IntersectionObserver
class IntersectionObserver {
  observe() { return null; }
  disconnect() { return null; }
  unobserve() { return null; }
}
global.IntersectionObserver = IntersectionObserver;

// Mock window.scrollTo
global.scrollTo = jest.fn();

// Mock import.meta
global.import = {};
global.import.meta = {
  env: {
    VITE_BACKEND_URL: 'http://localhost:4000'
  }
};
