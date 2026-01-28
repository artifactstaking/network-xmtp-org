import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import React from 'react';

// Mock ENVIRONMENT_CONFIG for tests
const testingConfig = {
  settlementChain: {
    chainId: 84532,
    publicRpcUrl: 'https://base-sepolia.g.alchemy.com/v2/demo',
    nodeRegistry: '0xBC7fc04570397c4170D2dCe4927aa6395f3dED4A',
  },
};

vi.stubGlobal('__APP_ENV__', testingConfig);

globalThis.React = React;

// Mock ResizeObserver
global.ResizeObserver =
  global.ResizeObserver ||
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };

// Mock window dimensions for testing environment
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1024,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: 768,
  });
}

// Mock matchMedia
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string) => {
    const width = window.innerWidth;
    let matches = false;
    if (query.includes('max-width: 575px')) matches = width <= 575;
    else if (query.includes('min-width: 576px') && query.includes('max-width'))
      matches = width >= 576 && width <= 991;
    else if (query.includes('min-width: 992px') && query.includes('max-width'))
      matches = width >= 992 && width <= 1199;
    else if (query.includes('min-width: 1200px')) matches = width >= 1200;
    return {
      matches,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    } as MediaQueryList;
  };
}

// Suppress common test environment warnings
const originalWarn = console.warn;
const originalError = console.error;

console.warn = (...args: unknown[]) => {
  const message = args[0];
  if (
    typeof message === 'string' &&
    (message.includes('WalletConnect') ||
      message.includes('was not wrapped in act') ||
      message.includes('Warning: An update to'))
  ) {
    return;
  }
  originalWarn.apply(console, args);
};

console.error = (...args: unknown[]) => {
  const message = args[0];
  if (
    typeof message === 'string' &&
    (message.includes('was not wrapped in act') ||
      message.includes('Warning: An update to') ||
      message.includes('A function component cannot be given refs'))
  ) {
    return;
  }
  originalError.apply(console, args);
};

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
