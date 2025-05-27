import path from 'path';

export default {
  cwd: path.resolve('./frontend'),
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { configFile: path.resolve('./frontend/babel.config.cjs') }]
  },
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  modulePathIgnorePatterns: ["<rootDir>/__tests__/mocks/"],
  moduleNameMapper: {
    '\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
  },
};
