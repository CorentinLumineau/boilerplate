# Testing Architecture & Best Practices

## Overview

This turborepo implements a comprehensive testing strategy using **Jest** as the primary testing framework, with full coverage across all packages and applications. The testing infrastructure is designed to provide fast, reliable, and maintainable tests with comprehensive coverage reporting.

## 🏗️ **Testing Architecture**

### **Framework Choice: Jest**
- **Primary Testing Framework**: Jest 29.7.0
- **TypeScript Support**: Full TypeScript support with ts-jest
- **React Testing**: @testing-library/react for component testing
- **DOM Testing**: jest-environment-jsdom for browser-like environment
- **Coverage**: Built-in coverage reporting with customizable thresholds

### **Package Structure**
```
├── apps/web/                    # Next.js web application
│   ├── __tests__/              # Test files
│   ├── jest.config.js          # Jest configuration
│   └── jest.setup.js           # Test setup and mocks
├── packages/config/             # Configuration package
│   ├── __tests__/              # Test files
│   └── jest.config.js          # Jest configuration
├── packages/types/              # Types package
│   ├── __tests__/              # Test files
│   └── jest.config.js          # Jest configuration
└── scripts/run-tests.js        # Custom test runner
```

## 🚀 **Getting Started**

### **Installation**
The testing dependencies are already installed in the root and individual packages:

```bash
# Root dependencies
pnpm add -D jest @types/jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom ts-jest

# Individual packages have their own testing dependencies
```

### **Running Tests**

#### **Root Level Commands**
```bash
# Run all tests across all packages
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run tests for CI environment
pnpm test:ci
```

#### **Individual Package Commands**
```bash
# Test specific package
pnpm --filter @boilerplate/web test
pnpm --filter @boilerplate/config test
pnpm --filter @boilerplate/types test

# With coverage
pnpm --filter @boilerplate/web test:coverage
```

#### **Make Commands**
```bash
# Run all tests
make test

# Run tests in watch mode
make test-watch

# Run tests with coverage
make test-coverage

# Run tests for CI
make test-ci
```

#### **Custom Test Runner**
```bash
# Run all tests with custom runner
node scripts/run-tests.js

# With coverage
node scripts/run-tests.js --coverage

# For CI environment
node scripts/run-tests.js --ci
```

## 📋 **Test Organization**

### **Test File Naming Convention**
- **Unit Tests**: `*.test.ts` or `*.test.tsx`
- **Integration Tests**: `*.spec.ts` or `*.spec.tsx`
- **Test Directories**: `__tests__/` folders

### **Test Structure**
```typescript
import { render, screen } from '../utils/test-utils'
import { ComponentName } from '../ComponentName'

describe('ComponentName', () => {
  beforeEach(() => {
    // Setup for each test
  })

  it('should render correctly', () => {
    render(<ComponentName />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })

  it('should handle user interactions', () => {
    // Test user interactions
  })

  it('should handle edge cases', () => {
    // Test edge cases and error conditions
  })
})
```

## 🧪 **Testing Utilities**

### **Custom Test Utils** (`apps/web/__tests__/utils/test-utils.tsx`)
```typescript
import { render, screen } from '../utils/test-utils'

// Custom render with providers
const customRender = (ui, options = {}) => {
  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders>
        {children}
      </AllTheProviders>
    ),
    ...options,
  })
}

// Mock data and utilities
export const mockUser = { /* ... */ }
export const mockSession = { /* ... */ }
export const setupTestEnvironment = () => { /* ... */ }
```

### **Common Test Patterns**
```typescript
// Component rendering
it('renders without crashing', () => {
  render(<Component />)
  expect(screen.getByRole('main')).toBeInTheDocument()
})

// User interactions
it('handles user input', async () => {
  const user = userEvent.setup()
  render(<Form />)
  
  const input = screen.getByRole('textbox')
  await user.type(input, 'test input')
  
  expect(input).toHaveValue('test input')
})

// Async operations
it('handles async data loading', async () => {
  render(<DataComponent />)
  
  expect(screen.getByText('Loading...')).toBeInTheDocument()
  
  await waitFor(() => {
    expect(screen.getByText('Data loaded')).toBeInTheDocument()
  })
})
```

## 🎯 **Coverage Requirements**

### **Coverage Thresholds**
All packages maintain **80% coverage** across:
- **Statements**: 80%
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%

### **Coverage Reports**
- **HTML Reports**: Available in `coverage/lcov-report/index.html`
- **LCOV Reports**: For CI/CD integration
- **Console Output**: Summary in terminal

## 🔧 **Configuration Files**

### **Jest Configuration** (`jest.config.js`)
```javascript
module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  testMatch: [
    '<rootDir>/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/app/**/*.{test,spec}.{js,jsx,ts,tsx}'
  ],
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/*.config.{js,ts}'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
}
```

### **Test Setup** (`jest.setup.js`)
```javascript
import '@testing-library/jest-dom'

// Mock Next.js components
jest.mock('next/navigation', () => ({
  useRouter: () => ({ /* mock router */ }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/'
}))

// Mock environment variables
process.env.NODE_ENV = 'test'
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db'
```

## 🚨 **Testing Best Practices**

### **1. Test Organization**
- Group related tests in `describe` blocks
- Use descriptive test names that explain the behavior
- Keep tests focused and single-purpose

### **2. Component Testing**
- Test component rendering and user interactions
- Mock external dependencies (APIs, databases)
- Test error states and edge cases
- Ensure accessibility compliance

### **3. Utility Testing**
- Test pure functions with various inputs
- Test edge cases and error conditions
- Ensure type safety and validation

### **4. Integration Testing**
- Test component interactions
- Test data flow between components
- Test API integration points

### **5. Mocking Strategy**
- Mock external services and APIs
- Use realistic mock data
- Avoid over-mocking internal logic

## 📊 **Performance & Optimization**

### **Test Execution Speed**
- **Parallel Execution**: Tests run in parallel across packages
- **Caching**: Jest caching for faster subsequent runs
- **Selective Testing**: Run tests for specific packages

### **Memory Management**
- **Cleanup**: Proper cleanup after each test
- **Mock Reset**: Reset mocks between tests
- **Resource Cleanup**: Clean up timers, intervals, etc.

## 🔍 **Debugging Tests**

### **Common Issues & Solutions**

#### **1. Component Not Rendering**
```typescript
// Check if component is wrapped in providers
render(<Component />, {
  wrapper: ({ children }) => <TestProvider>{children}</TestProvider>
})
```

#### **2. Async Operations**
```typescript
// Use waitFor for async operations
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument()
})
```

#### **3. Mock Issues**
```typescript
// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks()
})
```

### **Debug Commands**
```bash
# Run tests with verbose output
pnpm test --verbose

# Run specific test file
pnpm test ComponentName.test.tsx

# Run tests matching pattern
pnpm test --testNamePattern="user interaction"
```

## 🚀 **CI/CD Integration**

### **GitHub Actions**
The testing is integrated into CI/CD pipelines with:
- **Automatic Testing**: Runs on every PR and push
- **Coverage Reporting**: Coverage reports in CI
- **Quality Gates**: Tests must pass before merge

### **Pre-commit Hooks**
```bash
# Run tests before commit
pnpm test

# Check coverage thresholds
pnpm test:coverage
```

## 📈 **Monitoring & Metrics**

### **Coverage Trends**
- Track coverage over time
- Identify areas needing more tests
- Set coverage improvement goals

### **Test Performance**
- Monitor test execution time
- Identify slow tests
- Optimize test performance

## 🔮 **Future Enhancements**

### **Planned Features**
- **E2E Testing**: Playwright integration
- **Visual Testing**: Screenshot comparison
- **Performance Testing**: Lighthouse CI integration
- **Security Testing**: Automated security scans

### **Advanced Patterns**
- **Contract Testing**: API contract validation
- **Mutation Testing**: Test quality validation
- **Property-Based Testing**: Hypothesis-based testing

## 📚 **Resources & References**

### **Documentation**
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

### **Examples**
- See `__tests__/` directories for comprehensive examples
- Check individual package test configurations
- Review test utilities and helpers

---

## 🎯 **Quick Start Checklist**

- [ ] Install dependencies: `pnpm install`
- [ ] Run tests: `pnpm test`
- [ ] Check coverage: `pnpm test:coverage`
- [ ] Review test results and coverage reports
- [ ] Write tests for new features
- [ ] Maintain 80%+ coverage threshold

This testing infrastructure provides a solid foundation for maintaining code quality and ensuring reliable application behavior across all packages in the turborepo.