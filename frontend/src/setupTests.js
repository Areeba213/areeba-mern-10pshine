import '@testing-library/jest-dom';

// Mock localStorage - use globalThis.jest for ES modules
const localStorageMock = {
  getItem: globalThis.jest.fn(),
  setItem: globalThis.jest.fn(),
  removeItem: globalThis.jest.fn(),
  clear: globalThis.jest.fn(),
};
global.localStorage = localStorageMock;

// Mock fetch
global.fetch = globalThis.jest.fn();

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: globalThis.jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: globalThis.jest.fn(),
    removeListener: globalThis.jest.fn(),
    addEventListener: globalThis.jest.fn(),
    removeEventListener: globalThis.jest.fn(),
    dispatchEvent: globalThis.jest.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = globalThis.jest.fn().mockImplementation(() => ({
  observe: globalThis.jest.fn(),
  unobserve: globalThis.jest.fn(),
  disconnect: globalThis.jest.fn(),
}));