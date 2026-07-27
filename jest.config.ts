import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jest-fixed-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

// msw의 의존성 중 ESM-only 패키지(rettime 등)는 기본 transformIgnorePatterns에서
// 제외되어 있지 않아 Jest가 파싱하지 못하므로, next/jest 기본값을 유지한 채 추가한다.
const nextJestConfig = createJestConfig(config);

export default async () => {
  const resolvedConfig = await nextJestConfig();

  return {
    ...resolvedConfig,
    transformIgnorePatterns: resolvedConfig.transformIgnorePatterns?.map((pattern) =>
      pattern.replace(
        'until-async|geist',
        'until-async|geist|rettime|headers-polyfill|@open-draft|@mswjs|@bundled-es-modules',
      ),
    ),
  };
};
