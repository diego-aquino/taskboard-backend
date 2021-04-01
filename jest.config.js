module.exports = {
  clearMocks: true,
  coverageProvider: 'v8',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^~/(.*)': '<rootDir>/src/$1',
    '^~/tests/(.*)': '<rootDir>/tests/$1',
  },
};
