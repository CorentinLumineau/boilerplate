import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'

// Create a custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient
  theme?: 'light' | 'dark' | 'system'
}

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
        gcTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
  })
}

function AllTheProviders({ 
  children, 
  queryClient = createTestQueryClient(),
  theme = 'light' 
}: { 
  children: React.ReactNode
  queryClient?: QueryClient
  theme?: 'light' | 'dark' | 'system'
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme={theme} enableSystem={false}>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { queryClient, theme, ...renderOptions } = options
  
  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders queryClient={queryClient} theme={theme}>
        {children}
      </AllTheProviders>
    ),
    ...renderOptions,
  })
}

// Re-export everything
export * from '@testing-library/react'

// Override render method
export { customRender as render }

// Export custom providers for specific test cases
export { AllTheProviders, createTestQueryClient }

// Common test data
export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  image: 'https://example.com/avatar.jpg',
  emailVerified: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const mockSession = {
  user: mockUser,
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
}

// Mock functions
export const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
}

export const mockSearchParams = new URLSearchParams()

export const mockPathname = '/'

// Test environment setup helpers
export const setupTestEnvironment = () => {
  // Reset all mocks before each test
  jest.clearAllMocks()
  
  // Setup default environment variables
  process.env.NODE_ENV = 'test'
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db'
  process.env.BETTER_AUTH_SECRET = 'test-secret-key'
}

export const cleanupTestEnvironment = () => {
  // Cleanup after each test
  jest.resetAllMocks()
}

// Custom matchers for common assertions
export const expectElementToBeVisible = (element: HTMLElement) => {
  expect(element).toBeInTheDocument()
  expect(element).toBeVisible()
}

export const expectElementToHaveText = (element: HTMLElement, text: string) => {
  expect(element).toHaveTextContent(text)
}

export const expectElementToHaveClass = (element: HTMLElement, className: string) => {
  expect(element).toHaveClass(className)
}

// Async test helpers
export const waitForElementToBeRemoved = async (element: HTMLElement) => {
  await new Promise(resolve => setTimeout(resolve, 0))
  expect(element).not.toBeInTheDocument()
}

export const waitForLoadingToFinish = async () => {
  await new Promise(resolve => setTimeout(resolve, 100))
}

// Mock data generators
export const generateMockUsers = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    ...mockUser,
    id: `user-${i}`,
    email: `user${i}@example.com`,
    name: `User ${i}`,
  }))
}

export const generateMockPosts = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `post-${i}`,
    title: `Post ${i}`,
    content: `Content for post ${i}`,
    published: true,
    authorId: mockUser.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  }))
}