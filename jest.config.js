const path  = require('path');

module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/__tests__'],
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  testMatch: ['**/*.test.ts?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
    '\\.(gif|ttf|eot|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '^@mocks/(.*)$': path.resolve(__dirname, './__mocks__/$1'),
    '^@tests/(.*)$': path.resolve(__dirname, './__tests__/$1'),
    '^@store$': path.resolve(__dirname, './src/store/index.ts'),
    '^@ducks/(.*)$': path.resolve(__dirname, './src/store/ducks/$1'),
    '^@components/(.*)$': path.resolve(__dirname, './src/components/$1'),
    '^@services/(.*)$': path.resolve(__dirname, './src/services/$1'),
  },
};
