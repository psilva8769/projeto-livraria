module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  extensionsToTreatAsEsm: ['.jsx'],
  setupFilesAfterEnv: [
    '@testing-library/jest-dom',
    '<rootDir>/jest.setup.js', // Se você já tiver o arquivo jest.setup.js
  ],
  setupFiles: ['<rootDir>/jest.setup.js'], // Se precisar adicionar arquivos de setup
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'mjs'],
  transform: {
    '^.+\\.(js|jsx|mjs)$': 'babel-jest',
  },  transformIgnorePatterns: [
    '/node_modules/(?!(swiper|ssr-window|dom7|react-router|react-router-dom)/)'
  ],
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
    "^@/(.*)$": "<rootDir>/src/$1",
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^swiper/react$': '<rootDir>/__mocks__/swiperMock.js',
    '^swiper/css$': '<rootDir>/__mocks__/swiperMock.js',
    '^swiper/css/pagination$': '<rootDir>/__mocks__/swiperMock.js'
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/main.jsx',
    '!src/**/*.test.{js,jsx}',
    '!src/**/__tests__/**',
    '!src/**/__mocks__/**',
    '!**/node_modules/**',
    '!**/coverage/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json']
};
