module.exports = {
  preset: '@shelf/jest-mongodb',
  coverageProvider: 'v8',

  clearMocks: true,
  watchPathIgnorePatterns: ['globalConfig'],
  transformIgnorePatterns: [
    // prevent jest error (https://github.com/facebook/jest/issues/9503)
    '<rootDir>/node_modules/@babel',
    '<rootDir>/node_modules/@jest',
    'signal-exit',
  ],
  moduleNameMapper: {
    '^~/(.*)': '<rootDir>/src/$1',
    '^~/tests/(.*)': '<rootDir>/tests/$1',
  },
};
