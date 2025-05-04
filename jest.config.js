/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],  // Procurar testes a partir da pasta src
    testMatch: [
      '**/tests/**/*.+(spec|test).+(ts|tsx)',  // Encontrar testes em pastas de teste
      '**/?(*.)+(spec|test).+(ts|tsx)'  // Encontrar testes com nomes terminando em .test.ts ou .spec.ts
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transform: {
      '^.+\\.tsx?$': 'ts-jest'  // Usar ts-jest para transpilar TypeScript
    },
    testPathIgnorePatterns: ['/node_modules/'],  // Ignorar pasta node_modules
    verbose: true,  // Mostrar mais detalhes durante os testes
    detectOpenHandles: true,  // Detectar handles abertos
    maxWorkers: '50%',  // Limitar número de workers
    testTimeout: 30000,  // Aumentar timeout para 30 segundos
    collectCoverage: true,  // Coletar cobertura de código
    coverageReporters: ['text', 'lcov'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js']  // Arquivo de configuração adicional
  };