/**
 * Jest configuration for the monorepo.
 * It ensures that test files inside workspace packages are discovered.
 */
module.exports = {
  // Look for test files in any subdirectory, including workspaces.
  testMatch: ['**/__tests__/**/*.test.[jt]s', '**/?(*.)+(spec|test).[tj]s?(x)'],
  // Transform is not needed as we use plain JavaScript.
  testEnvironment: 'node',
  // Increase timeout for async operations if needed.
  testTimeout: 10000,
};
