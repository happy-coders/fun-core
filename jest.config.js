module.exports = {
  testEnvironment: 'node',
  testRegex: '.spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  rootDir: '.',
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
  moduleNameMapper: {
    '@/tests/(.*)': '<rootDir>/tests/$1',
    '@/(.*)': '<rootDir>/src/$1'
  },
  modulePathIgnorePatterns: ["storage.json"],
  setupFilesAfterEnv: ['jest-extended', './tests/setup.ts'],
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
};