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
    verbose: true  // Mostrar mais detalhes durante os testes
  };