require('@testing-library/jest-dom')

// Set NODE_ENV to test for ResponsiveModal component
process.env.NODE_ENV = 'test'

// Mock Next.js components
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    const { src, alt, ...rest } = props
    return React.createElement('img', { src, alt, ...rest })
  }
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: (props) => {
    const { href, children, ...rest } = props
    return React.createElement('a', { href, ...rest }, children)
  }
}))

// Mock browser APIs
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}))

global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}))

global.matchMedia = jest.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn()
}))

global.scrollTo = jest.fn()

// Suppress console errors and warnings in tests
const originalError = console.error
const originalWarn = console.warn

console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
     args[0].includes('Warning: An update to') ||
     args[0].includes('Warning: A component is `contentEditable`'))
  ) {
    return
  }
  originalError.call(console, ...args)
}

console.warn = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning: Missing `Description` or `aria-describedby={undefined}` for {DialogContent}') ||
     args[0].includes('Warning: An update to'))
  ) {
    return
  }
  originalWarn.call(console, ...args)
}