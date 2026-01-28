import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Determine the path to the environment-specific JSON file
  const jsonPath = path.resolve(__dirname, `./environments/${mode}.json`);

  // Check if the file exists, otherwise use an empty object
  const envConfig = fs.existsSync(jsonPath) ? JSON.parse(fs.readFileSync(jsonPath, 'utf-8')) : {};

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    optimizeDeps: {
      exclude: ['fsevents'],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // React core libraries
            'react-core': ['react', 'react-dom', 'react-router-dom'],

            // UI component libraries
            'radix-ui': [
              '@radix-ui/react-accordion',
              '@radix-ui/react-avatar',
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-label',
              '@radix-ui/react-popover',
              '@radix-ui/react-progress',
              '@radix-ui/react-radio-group',
              '@radix-ui/react-scroll-area',
              '@radix-ui/react-select',
              '@radix-ui/react-separator',
              '@radix-ui/react-slot',
              '@radix-ui/react-switch',
              '@radix-ui/react-tabs',
              '@radix-ui/react-toast',
              '@radix-ui/react-toggle',
              '@radix-ui/react-toggle-group',
              '@radix-ui/react-tooltip',
            ],

            // blockchain libraries
            'web3-libs': ['@rainbow-me/rainbowkit', 'viem', 'wagmi'],

            // Form handling
            'form-libs': ['react-hook-form', '@hookform/resolvers', 'zod'],

            // Data visualization
            'viz-libs': ['recharts'],

            // Utility libraries
            utils: [
              'date-fns',
              'class-variance-authority',
              'tailwind-merge',
              'zustand',
              '@tanstack/react-query',
            ],

            // Icons and UI utilities
            'ui-utils': ['lucide-react', '@lucide/lab', 'react-day-picker'],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
    test: {
      environment: 'jsdom',
      setupFiles: [path.resolve(__dirname, 'src/test/setup.ts')],
      globals: true,
      include: ['src/**/*.test.{js,ts,jsx,tsx}', 'src/**/*.spec.{js,ts,jsx,tsx}'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        reportsDirectory: './coverage',
        exclude: [
          'node_modules/',
          '**/*.{test,spec}.{js,ts,jsx,tsx}',
          '**/*.d.ts',
          '**/*.config.*',
          'dist/',
          'coverage/',
          '**/src/test/setup.ts',
          '**/src/test/__mocks__/**',
          '**/src/components/base/**',
          '**/src/components/routing/**',
          '**/src/components/debug/**',
          '**/src/components/typography/**',
          '**/src/config/**',
          '**/src/constants/**',
        ],
        clean: false,
      },
    },
    define: {
      __APP_ENV__: JSON.stringify(envConfig),
    },
  };
});
