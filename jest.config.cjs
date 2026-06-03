/**
 * Jest configuration for the library's unit tests.
 *
 * - jsdom environment so DOM APIs are available (used by later modules).
 * - ts-jest transforms TS/TSX (classic React JSX runtime, matching tsconfig).
 */
/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts?(x)'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react',
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          verbatimModuleSyntax: false,
        },
      },
    ],
  },
  clearMocks: true,
}
