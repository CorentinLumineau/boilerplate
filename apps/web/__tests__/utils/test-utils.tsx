import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient
  theme?: 'light' | 'dark' | 'system'
}

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  })
}

function AllTheProviders({ children, queryClient, theme = 'light' }: {
  children: React.ReactNode
  queryClient?: QueryClient
  theme?: 'light' | 'dark' | 'system'
}) {
  const testQueryClient = queryClient || createTestQueryClient()

  return (
    <QueryClientProvider client={testQueryClient}>
      <ThemeProvider attribute="class" defaultTheme={theme} enableSystem>
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

export * from '@testing-library/react'
export { customRender as render }
export { AllTheProviders, createTestQueryClient }

// Mock data for tests
export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  image: 'https://example.com/avatar.jpg',
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-01'),
}

export const mockSession = {
  user: mockUser,
  expires: new Date('2024-01-01').toISOString(),
}

export const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  prefetch: jest.fn(),
}

export const mockSearchParams = new URLSearchParams()
export const mockPathname = '/'

// Test environment setup and cleanup
export const setupTestEnvironment = () => {
  // Mock window methods
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })

  Object.defineProperty(window, 'scrollTo', {
    writable: true,
    value: jest.fn(),
  })
}

export const cleanupTestEnvironment = () => {
  jest.clearAllMocks()
}

// Custom assertions
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

// Wait utilities
export const waitForElementToBeRemoved = async (element: HTMLElement) => {
  await new Promise(resolve => setTimeout(resolve, 100))
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
    authorId: mockUser.id,
    published: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  }))
}