import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    coverage: {
      enabled: true,
      provider: 'v8',
    },
    reporters: process.env.GITHUB_ACTIONS
      ? ['dot', 'github-actions', 'junit']
      : ['default'],
    outputFile: process.env.GITHUB_ACTIONS
      ? 'test-report.junit.xml'
      : undefined,
    testTimeout: 20_000,
    include: ['test/**/*.spec.mjs'],
  },
})
