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
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(swiper|ssr-window|dom7)/)'
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
};
