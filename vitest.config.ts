import { defineConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default defineConfig(({ mode }) => {
  return {
    ...viteConfig,
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
    },
  };
});
