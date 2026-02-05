const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
  
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
  
  forceExit: true,
  detectOpenHandles: false,
}

module.exports = async () => {
  const jestConfig = await createJestConfig(customJestConfig)()
  return {
    ...jestConfig,
    transformIgnorePatterns: [
      '/node_modules/(?!(msw|@mswjs|until-async)/)',
    ],
  }
}