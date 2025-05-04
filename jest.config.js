/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'], 
    testMatch: [
      '**/tests/**/*.+(spec|test).+(ts|tsx)', 
      '**/?(*.)+(spec|test).+(ts|tsx)'
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transform: {
      '^.+\\.tsx?$': 'ts-jest' 
    },
    testPathIgnorePatterns: ['/node_modules/'], 
    verbose: true, 
    detectOpenHandles: true, 
    maxWorkers: '50%', 
    testTimeout: 30000, 
    collectCoverage: true, 
    coverageReporters: ['text', 'lcov'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
  };