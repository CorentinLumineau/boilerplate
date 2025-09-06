import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  // Create a new QueryClient instance for each test
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  return render(ui, { wrapper: AllTheProviders, ...options });
};

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { customRender as render };

// Test wrapper components for different scenarios
export const TestWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <AllTheProviders>{children}</AllTheProviders>;

export const TestQueryWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

// Utility functions for common test scenarios
export const createMockUser = () => ({
  id: 'test-user-id',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  createdAt: new Date(),
  updatedAt: new Date(),
});

export const waitForLoadingToFinish = () => {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
};

// Mock session for authenticated tests
export const createMockSession = (overrides = {}) => ({
  user: createMockUser(),
  expires: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours
  ...overrides,
});

// Helper for testing error boundaries
export const TestErrorBoundary: React.FC<{ 
  children: React.ReactNode;
  onError?: (error: Error) => void;
}> = ({ children, onError }) => {
  return (
    <div data-testid="error-boundary">
      {children}
    </div>
  );
};