import type { Config } from '@jest/types';
import path from 'path';

const commonModuleNameMapper = {
  'react-audio-voice-recorder': path.join(
    __dirname,
    '__mocks__/react-audio-voice-recorder.ts'
  ),
  'iconify-icon': path.join(__dirname, '__mocks__/iconify.tsx'),
  '@langchain/google-genai': path.join(__dirname, '__mocks__/google-genai.ts'),
  '@langchain/ollama': path.join(__dirname, '__mocks__/ollama.ts'),
  '@langchain/core/runnables': path.join(__dirname, '__mocks__/runnable.ts'),
  openai: path.join(__dirname, '__mocks__/openai.ts'),
  '@openassistant/core/(.*)': '<rootDir>/packages/core/src/$1',
  '@openassistant/core': '<rootDir>/packages/core/src',
};

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  rootDir: './',
  coverageDirectory: '<rootDir>/coverage',
  testPathIgnorePatterns: ['<rootDir>/node_modules'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transform: {
    '^.+\\.(ts|tsx)?$': ['ts-jest', {}],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageReporters: ['html', 'json', 'lcov', 'text'],
  projects: [
    {
      displayName: 'core',
      testEnvironment: 'jsdom',
      transform: {
        '^.+\\.ts?$': ['ts-jest', {}],
      },
      testMatch: ['<rootDir>/packages/core/__tests__/**/*.test.ts'],
      testPathIgnorePatterns: ['<rootDir>/packages/core/dist'],
      moduleNameMapper: {
        ...commonModuleNameMapper,
      },
      setupFiles: [path.join(__dirname, 'jest.setup.ts')],
      collectCoverageFrom: [
        '<rootDir>/packages/core/**/*.{ts,tsx}',
        '!**/*.d.ts',
        '!**/node_modules/**',
      ],
    },
    {
      displayName: 'ui',
      testEnvironment: 'jsdom',
      transform: {
        '^.+\\.(ts|tsx|js|jsx)?$': ['ts-jest', { useESM: true }],
      },
      testMatch: [
        '<rootDir>/packages/ui/__tests__/**/*.test.ts',
        '<rootDir>/packages/ui/__tests__/**/*.test.tsx',
      ],
      testPathIgnorePatterns: ['<rootDir>/packages/ui/dist'],
      moduleNameMapper: {
        ...commonModuleNameMapper,
      },
      setupFiles: [path.join(__dirname, 'jest.setup.ts')],
      collectCoverageFrom: [
        '<rootDir>/packages/ui/**/*.{ts,tsx}',
        '!**/*.d.ts',
        '!**/node_modules/**',
      ],
    },
  ],
  moduleDirectories: ['node_modules', 'packages'],
};

export default config;
