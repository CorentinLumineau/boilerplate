# Complete Testing Manifest for Next.js Applications

## Overview
This manifest defines a comprehensive testing strategy for Next.js fullstack applications, covering unit tests, integration tests, end-to-end tests, and performance testing. It follows the testing pyramid principle and ensures high code quality across all architectural layers.

## Testing Philosophy & Principles

### Testing Pyramid
```
                    E2E Tests (10%)
                 ─────────────────
               Integration Tests (20%)
             ───────────────────────────
           Unit Tests (70%)
         ─────────────────────────────────
```

### Core Principles
- **Fast Feedback**: Unit tests run in milliseconds
- **Reliable**: Tests are deterministic and stable
- **Maintainable**: Tests are easy to read and update
- **Isolated**: Tests don't depend on external services
- **Representative**: Tests mirror real-world usage
- **Comprehensive**: High coverage of critical paths

## Testing Stack

### Core Testing Tools
- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing
- **MSW (Mock Service Worker)**: API mocking
- **Playwright**: End-to-end testing
- **Vitest**: Alternative fast test runner (optional)

### Additional Tools
- **@testing-library/jest-dom**: Custom matchers
- **@testing-library/user-event**: User interaction simulation
- **jest-environment-jsdom**: DOM environment for Jest
- **@faker-js/faker**: Test data generation
- **supertest**: API testing
- **prisma-test-environment**: Database testing

## Testing Structure

```
apps/web/
├── __tests__/                        # Test files
│   ├── __mocks__/                    # Global mocks
│   │   ├── next/
│   │   │   ├── router.ts
│   │   │   └── navigation.ts
│   │   ├── prisma.ts
│   │   ├── better-auth.ts
│   │   └── external-apis.ts
│   ├── setup/                        # Test setup files
│   │   ├── jest.setup.ts
│   │   ├── test-utils.tsx
│   │   ├── db-setup.ts
│   │   └── msw-setup.ts
│   ├── fixtures/                     # Test data
│   │   ├── users.fixture.ts
│   │   ├── products.fixture.ts
│   │   ├── orders.fixture.ts
│   │   └── api-responses.fixture.ts
│   ├── factories/                    # Data factories
│   │   ├── user.factory.ts
│   │   ├── product.factory.ts
│   │   └── order.factory.ts
│   ├── unit/                         # Unit tests
│   │   ├── utils/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── entities/
│   │   ├── dto/
│   │   └── hooks/
│   ├── integration/                  # Integration tests
│   │   ├── api/
│   │   ├── pages/
│   │   ├── features/
│   │   └── database/
│   ├── e2e/                          # End-to-end tests
│   │   ├── auth/
│   │   ├── user-management/
│   │   ├── product-management/
│   │   └── order-flow/
│   └── performance/                  # Performance tests
│       ├── load/
│       ├── stress/
│       └── lighthouse/
├── jest.config.js
├── jest.setup.js
├── playwright.config.ts
└── vitest.config.ts (optional)
```

## Layer-by-Layer Testing Strategy

### 1. Database Layer Testing

**Location**: `__tests__/unit/repositories/`

**Strategy**: Test database operations with real database using transactions

```typescript
// __tests__/unit/repositories/user.repository.test.ts
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { PrismaClient } from '@prisma/client';
import { UserRepository } from '@/lib/repositories/user.repository';
import { createUserFactory } from '../../factories/user.factory';
import { cleanDatabase, seedTestData } from '../../setup/db-setup';

describe('UserRepository', () => {
  let prisma: PrismaClient;
  let userRepository: UserRepository;

  beforeEach(async () => {
    prisma = new PrismaClient();
    await cleanDatabase(prisma);
    userRepository = new UserRepository(prisma);
  });

  afterEach(async () => {
    await prisma.$disconnect();
  });

  describe('findById', () => {
    it('should return user when exists', async () => {
      // Arrange
      const userData = createUserFactory();
      const createdUser = await prisma.user.create({ data: userData });

      // Act
      const result = await userRepository.findById(createdUser.id);

      // Assert
      expect(result).not.toBeNull();
      expect(result?.id).toBe(createdUser.id);
      expect(result?.email).toBe(userData.email);
    });

    it('should return null when user does not exist', async () => {
      // Act
      const result = await userRepository.findById('non-existent-id');

      // Assert
      expect(result).toBeNull();
    });

    it('should not return soft deleted users', async () => {
      // Arrange
      const userData = createUserFactory();
      const createdUser = await prisma.user.create({
        data: { ...userData, deletedAt: new Date() }
      });

      // Act
      const result = await userRepository.findById(createdUser.id);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create user with valid data', async () => {
      // Arrange
      const userData = createUserFactory();

      // Act
      const result = await userRepository.create(userData);

      // Assert
      expect(result.id).toBeDefined();
      expect(result.email).toBe(userData.email);
      expect(result.createdAt).toBeInstanceOf(Date);
    });

    it('should throw error for duplicate email', async () => {
      // Arrange
      const userData = createUserFactory();
      await userRepository.create(userData);

      // Act & Assert
      await expect(userRepository.create(userData))
        .rejects.toThrow('Unique constraint violation');
    });
  });
});
```

### 2. Entity/Domain Layer Testing

**Location**: `__tests__/unit/entities/`

**Strategy**: Test business logic and domain rules in isolation

```typescript
// __tests__/unit/entities/user.entity.test.ts
import { describe, it, expect } from '@jest/globals';
import { User } from '@/lib/domain/entities/user.entity';
import { Email } from '@/lib/domain/value-objects/email.vo';

describe('User Entity', () => {
  describe('constructor', () => {
    it('should create user with valid data', () => {
      // Arrange
      const email = new Email('test@example.com');
      const createdAt = new Date();

      // Act
      const user = new User('user-id', email, createdAt);

      // Assert
      expect(user.id).toBe('user-id');
      expect(user.email).toBe(email);
      expect(user.createdAt).toBe(createdAt);
      expect(user.isActive).toBe(true);
    });
  });

  describe('deactivate', () => {
    it('should deactivate active user', () => {
      // Arrange
      const user = new User('user-id', new Email('test@example.com'), new Date());

      // Act
      user.deactivate();

      // Assert
      expect(user.isActive).toBe(false);
    });
  });

  describe('fromPrisma', () => {
    it('should create user from prisma data', () => {
      // Arrange
      const prismaUser = {
        id: 'user-id',
        email: 'test@example.com',
        createdAt: new Date(),
        deletedAt: null
      };

      // Act
      const user = User.fromPrisma(prismaUser);

      // Assert
      expect(user.id).toBe(prismaUser.id);
      expect(user.email.value).toBe(prismaUser.email);
      expect(user.isActive).toBe(true);
    });

    it('should mark user as inactive when soft deleted', () => {
      // Arrange
      const prismaUser = {
        id: 'user-id',
        email: 'test@example.com',
        createdAt: new Date(),
        deletedAt: new Date()
      };

      // Act
      const user = User.fromPrisma(prismaUser);

      // Assert
      expect(user.isActive).toBe(false);
    });
  });
});
```

### 3. Service Layer Testing

**Location**: `__tests__/unit/services/`

**Strategy**: Test business logic with mocked dependencies

```typescript
// __tests__/unit/services/user.service.test.ts
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { UserService } from '@/lib/services/user/user.service';
import { IUserRepository } from '@/lib/repositories/user/user.repository.interface';
import { IEmailService } from '@/lib/services/email/email.service.interface';
import { ILogger } from '@/lib/logging/logger';
import { ConflictError } from '@/lib/errors/business/business.error';
import { createUserFactory } from '../../factories/user.factory';

describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockEmailService: jest.Mocked<IEmailService>;
  let mockLogger: jest.Mocked<ILogger>;

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockEmailService = {
      sendWelcomeEmail: jest.fn(),
      sendPasswordResetEmail: jest.fn(),
    };

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    };

    userService = new UserService(
      mockUserRepository,
      mockEmailService,
      mockLogger
    );
  });

  describe('createUser', () => {
    it('should create user successfully', async () => {
      // Arrange
      const userData = createUserFactory();
      const expectedUser = { id: 'user-id', ...userData };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(expectedUser);
      mockEmailService.sendWelcomeEmail.mockResolvedValue(undefined);

      // Act
      const result = await userService.createUser(userData);

      // Assert
      expect(result).toEqual(expectedUser);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userData.email);
      expect(mockUserRepository.create).toHaveBeenCalledWith(userData);
      expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalledWith(userData.email);
      expect(mockLogger.info).toHaveBeenCalledWith('User created', { userId: expectedUser.id });
    });

    it('should throw ConflictError when user already exists', async () => {
      // Arrange
      const userData = createUserFactory();
      const existingUser = { id: 'existing-id', ...userData };

      mockUserRepository.findByEmail.mockResolvedValue(existingUser);

      // Act & Assert
      await expect(userService.createUser(userData))
        .rejects.toThrow(ConflictError);
      expect(mockUserRepository.create).not.toHaveBeenCalled();
      expect(mockEmailService.sendWelcomeEmail).not.toHaveBeenCalled();
    });

    it('should handle email service failure gracefully', async () => {
      // Arrange
      const userData = createUserFactory();
      const expectedUser = { id: 'user-id', ...userData };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(expectedUser);
      mockEmailService.sendWelcomeEmail.mockRejectedValue(new Error('Email service failed'));

      // Act & Assert
      await expect(userService.createUser(userData))
        .rejects.toThrow('Email service failed');
      expect(mockUserRepository.create).toHaveBeenCalled();
    });
  });
});
```

### 4. API Layer Testing

**Location**: `__tests__/integration/api/`

**Strategy**: Test API endpoints with real HTTP requests and mocked external services

```typescript
// __tests__/integration/api/users.test.ts
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { NextRequest } from 'next/server';
import { POST, GET } from '@/app/api/users/route';
import { setupMSW, teardownMSW } from '../../setup/msw-setup';
import { cleanDatabase, seedTestData } from '../../setup/db-setup';
import { createUserFactory } from '../../factories/user.factory';

describe('/api/users', () => {
  beforeEach(async () => {
    setupMSW();
    await cleanDatabase();
  });

  afterEach(async () => {
    teardownMSW();
  });

  describe('POST /api/users', () => {
    it('should create user with valid data', async () => {
      // Arrange
      const userData = createUserFactory();
      const request = new NextRequest('http://localhost:3000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.id).toBeDefined();
      expect(data.data.email).toBe(userData.email);
      expect(data.message).toBe('User created successfully');
    });

    it('should return 400 for invalid data', async () => {
      // Arrange
      const invalidData = { email: 'invalid-email' };
      const request = new NextRequest('http://localhost:3000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData),
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain('validation');
    });

    it('should return 409 for duplicate email', async () => {
      // Arrange
      const userData = createUserFactory();
      await seedTestData({ users: [userData] });

      const request = new NextRequest('http://localhost:3000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(409);
      expect(data.success).toBe(false);
      expect(data.error).toContain('already exists');
    });
  });

  describe('GET /api/users', () => {
    it('should return paginated users list', async () => {
      // Arrange
      const users = Array.from({ length: 5 }, () => createUserFactory());
      await seedTestData({ users });

      const request = new NextRequest('http://localhost:3000/api/users?page=1&limit=3');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.users).toHaveLength(3);
      expect(data.data.pagination.total).toBe(5);
      expect(data.data.pagination.page).toBe(1);
      expect(data.data.pagination.totalPages).toBe(2);
    });

    it('should filter users by search query', async () => {
      // Arrange
      const users = [
        createUserFactory({ email: 'john@example.com' }),
        createUserFactory({ email: 'jane@example.com' }),
        createUserFactory({ email: 'bob@test.com' }),
      ];
      await seedTestData({ users });

      const request = new NextRequest('http://localhost:3000/api/users?search=example');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.data.users).toHaveLength(2);
      expect(data.data.users.every(user => user.email.includes('example'))).toBe(true);
    });
  });
});
```

### 5. Component Testing

**Location**: `__tests__/unit/components/`

**Strategy**: Test components in isolation with React Testing Library

```typescript
// __tests__/unit/components/forms/user-form.test.tsx
import { describe, it, expect, jest } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserForm } from '@/components/forms/user/user-form';
import { createUserFactory } from '../../factories/user.factory';
import { TestWrapper } from '../../setup/test-utils';

describe('UserForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('should render form fields', () => {
    // Act
    render(
      <TestWrapper>
        <UserForm onSubmit={mockOnSubmit} />
      </TestWrapper>
    );

    // Assert
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('should populate form with initial data', () => {
    // Arrange
    const initialData = createUserFactory();

    // Act
    render(
      <TestWrapper>
        <UserForm initialData={initialData} onSubmit={mockOnSubmit} />
      </TestWrapper>
    );

    // Assert
    expect(screen.getByDisplayValue(initialData.email)).toBeInTheDocument();
    expect(screen.getByDisplayValue(initialData.firstName)).toBeInTheDocument();
    expect(screen.getByDisplayValue(initialData.lastName)).toBeInTheDocument();
  });

  it('should validate required fields', async () => {
    // Arrange
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <UserForm onSubmit={mockOnSubmit} />
      </TestWrapper>
    );

    // Act
    await user.click(screen.getByRole('button', { name: /submit/i }));

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should validate email format', async () => {
    // Arrange
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <UserForm onSubmit={mockOnSubmit} />
      </TestWrapper>
    );

    // Act
    await user.type(screen.getByLabelText(/email/i), 'invalid-email');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should submit form with valid data', async () => {
    // Arrange
    const user = userEvent.setup();
    const formData = createUserFactory();

    render(
      <TestWrapper>
        <UserForm onSubmit={mockOnSubmit} />
      </TestWrapper>
    );

    // Act
    await user.type(screen.getByLabelText(/email/i), formData.email);
    await user.type(screen.getByLabelText(/first name/i), formData.firstName);
    await user.type(screen.getByLabelText(/last name/i), formData.lastName);
    await user.click(screen.getByRole('button', { name: /submit/i }));

    // Assert
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
    });
  });

  it('should show loading state during submission', async () => {
    // Arrange
    const user = userEvent.setup();
    const formData = createUserFactory();

    render(
      <TestWrapper>
        <UserForm onSubmit={mockOnSubmit} isLoading={true} />
      </TestWrapper>
    );

    // Assert
    expect(screen.getByRole('button', { name: /submitting/i })).toBeDisabled();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});
```

### 6. Hook Testing

**Location**: `__tests__/unit/hooks/`

**Strategy**: Test custom hooks with React Testing Library's renderHook

```typescript
// __tests__/unit/hooks/use-users.test.ts
import { describe, it, expect, beforeEach } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { useUsers } from '@/lib/queries/hooks/users/use-users';
import { TestQueryWrapper } from '../../setup/test-utils';
import { setupMSW, teardownMSW } from '../../setup/msw-setup';
import { createUserFactory } from '../../factories/user.factory';

describe('useUsers hook', () => {
  beforeEach(() => {
    setupMSW();
  });

  afterEach(() => {
    teardownMSW();
  });

  it('should fetch users successfully', async () => {
    // Arrange
    const mockUsers = Array.from({ length: 3 }, () => createUserFactory());

    // Mock the API response
    server.use(
      rest.get('/api/users', (req, res, ctx) => {
        return res(
          ctx.json({
            success: true,
            data: {
              users: mockUsers,
              pagination: { total: 3, page: 1, totalPages: 1 }
            }
          })
        );
      })
    );

    // Act
    const { result } = renderHook(() => useUsers(), {
      wrapper: TestQueryWrapper,
    });

    // Assert
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.users).toHaveLength(3);
    expect(result.current.data?.users[0].email).toBe(mockUsers[0].email);
  });

  it('should handle API error', async () => {
    // Arrange
    server.use(
      rest.get('/api/users', (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({ success: false, error: 'Internal server error' })
        );
      })
    );

    // Act
    const { result } = renderHook(() => useUsers(), {
      wrapper: TestQueryWrapper,
    });

    // Assert
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });

  it('should refetch when filters change', async () => {
    // Arrange
    const allUsers = Array.from({ length: 5 }, () => createUserFactory());
    const filteredUsers = allUsers.slice(0, 2);

    server.use(
      rest.get('/api/users', (req, res, ctx) => {
        const search = req.url.searchParams.get('search');
        const users = search ? filteredUsers : allUsers;
        
        return res(
          ctx.json({
            success: true,
            data: {
              users,
              pagination: { total: users.length, page: 1, totalPages: 1 }
            }
          })
        );
      })
    );

    // Act
    const { result, rerender } = renderHook(
      ({ filters }) => useUsers(filters),
      {
        wrapper: TestQueryWrapper,
        initialProps: { filters: undefined }
      }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.users).toHaveLength(5);

    // Rerender with filters
    rerender({ filters: { search: 'test' } });

    await waitFor(() => {
      expect(result.current.data?.users).toHaveLength(2);
    });
  });
});
```

### 7. Page/Feature Testing

**Location**: `__tests__/integration/pages/`

**Strategy**: Test complete page functionality with user interactions

```typescript
// __tests__/integration/pages/users.test.tsx
import { describe, it, expect, beforeEach } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UsersPage from '@/app/(dashboard)/users/page';
import { TestWrapper } from '../../setup/test-utils';
import { setupMSW, teardownMSW } from '../../setup/msw-setup';
import { createUserFactory } from '../../factories/user.factory';

describe('Users Page', () => {
  beforeEach(() => {
    setupMSW();
  });

  afterEach(() => {
    teardownMSW();
  });

  it('should display users list', async () => {
    // Arrange
    const mockUsers = Array.from({ length: 3 }, () => createUserFactory());

    server.use(
      rest.get('/api/users', (req, res, ctx) => {
        return res(
          ctx.json({
            success: true,
            data: {
              users: mockUsers,
              pagination: { total: 3, page: 1, totalPages: 1 }
            }
          })
        );
      })
    );

    // Act
    render(
      <TestWrapper>
        <UsersPage />
      </TestWrapper>
    );

    // Assert
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/users/i)).toBeInTheDocument();
    });

    mockUsers.forEach(user => {
      expect(screen.getByText(user.email)).toBeInTheDocument();
    });
  });

  it('should filter users by search', async () => {
    // Arrange
    const user = userEvent.setup();
    const allUsers = [
      createUserFactory({ email: 'john@example.com' }),
      createUserFactory({ email: 'jane@example.com' }),
      createUserFactory({ email: 'bob@test.com' }),
    ];

    server.use(
      rest.get('/api/users', (req, res, ctx) => {
        const search = req.url.searchParams.get('search');
        const filteredUsers = search 
          ? allUsers.filter(u => u.email.includes(search))
          : allUsers;

        return res(
          ctx.json({
            success: true,
            data: {
              users: filteredUsers,
              pagination: { total: filteredUsers.length, page: 1, totalPages: 1 }
            }
          })
        );
      })
    );

    render(
      <TestWrapper>
        <UsersPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getAllByTestId('user-card')).toHaveLength(3);
    });

    // Act
    await user.type(screen.getByPlaceholderText(/search users/i), 'example');

    // Assert
    await waitFor(() => {
      expect(screen.getAllByTestId('user-card')).toHaveLength(2);
    });
  });

  it('should navigate to create user page', async () => {
    // Arrange
    const user = userEvent.setup();
    const mockPush = jest.fn();

    jest.mock('next/navigation', () => ({
      useRouter: () => ({ push: mockPush }),
    }));

    render(
      <TestWrapper>
        <UsersPage />
      </TestWrapper>
    );

    // Act
    await user.click(screen.getByRole('button', { name: /create user/i }));

    // Assert
    expect(mockPush).toHaveBeenCalledWith('/users/new');
  });
});
```

### 8. End-to-End Testing

**Location**: `__tests__/e2e/`

**Strategy**: Test complete user workflows with Playwright

```typescript
// __tests__/e2e/user-management/user-crud.spec.ts
import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.describe('User Management', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: Login as admin
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'admin@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should create, edit, and delete user', async ({ page }) => {
    const userEmail = faker.internet.email();
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    // Navigate to users page
    await page.click('[data-testid="users-nav-link"]');
    await expect(page).toHaveURL('/users');

    // Create user
    await page.click('[data-testid="create-user-button"]');
    await expect(page).toHaveURL('/users/new');

    await page.fill('[data-testid="email-input"]', userEmail);
    await page.fill('[data-testid="firstName-input"]', firstName);
    await page.fill('[data-testid="lastName-input"]', lastName);
    await page.click('[data-testid="submit-button"]');

    // Verify user was created
    await expect(page).toHaveURL('/users');
    await expect(page.locator(`text=${userEmail}`)).toBeVisible();

    // Edit user
    await page.click(`[data-testid="user-${userEmail}-edit-button"]`);
    const updatedFirstName = faker.person.firstName();
    await page.fill('[data-testid="firstName-input"]', updatedFirstName);
    await page.click('[data-testid="submit-button"]');

    // Verify user was updated
    await expect(page).toHaveURL('/users');
    await expect(page.locator(`text=${updatedFirstName}`)).toBeVisible();

    // Delete user
    await page.click(`[data-testid="user-${userEmail}-delete-button"]`);
    await page.click('[data-testid="confirm-delete-button"]');

    // Verify user was deleted
    await expect(page.locator(`text=${userEmail}`)).not.toBeVisible();
  });

  test('should handle validation errors', async ({ page }) => {
    // Navigate to create user page
    await page.goto('/users/new');

    // Submit empty form
    await page.click('[data-testid="submit-button"]');

    // Verify validation errors
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=First name is required')).toBeVisible();
    await expect(page.locator('text=Last name is required')).toBeVisible();

    // Test invalid email
    await page.fill('[data-testid="email-input"]', 'invalid-email');
    await page.click('[data-testid="submit-button"]');
    await expect(page.locator('text=Invalid email format')).toBeVisible();
  });

  test('should handle server errors gracefully', async ({ page, context }) => {
    // Intercept API call to return error
    await context.route('/api/users', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, error: 'Internal server error' })
      });
    });

    await page.goto('/users/new');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="firstName-input"]', 'Test');
    await page.fill('[data-testid="lastName-input"]', 'User');
    await page.click('[data-testid="submit-button"]');

    // Verify error message is displayed
    await expect(page.locator('text=Something went wrong')).toBeVisible();
  });
});
```

## Testing Configuration Files

### Jest Configuration

```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/tests/(.*)$': '<rootDir>/__tests__/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/*.config.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testMatch: [
    '**/__tests__/**/*.test.{js,jsx,ts,tsx}',
    '**/__tests__/**/*.spec.{js,jsx,ts,tsx}',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/__tests__/e2e/',
    '<rootDir>/__tests__/performance/',
  ],
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testTimeout: 10000,
};

module.exports = createJestConfig(customJestConfig);
```

### Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './__tests__/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

## Testing Best Practices

### 1. Test Organization
- **Group related tests** using `describe` blocks
- **Use descriptive test names** that explain the scenario
- **Follow AAA pattern**: Arrange, Act, Assert
- **Keep tests focused** on single functionality

### 2. Mock Strategy
- **Mock external dependencies** at service boundaries
- **Use MSW** for API mocking in integration tests
- **Keep mocks simple** and focused
- **Reset mocks** between tests

### 3. Data Management
- **Use factories** for generating test data
- **Use fixtures** for static test data
- **Clean database** between integration tests
- **Use transactions** for test isolation

### 4. Assertions
- **Be specific** in assertions
- **Test both success and failure paths**
- **Verify side effects** (logs, emails, etc.)
- **Use custom matchers** for common patterns

### 5. Performance
- **Run unit tests fast** (< 5 seconds total)
- **Parallelize** integration and e2e tests
- **Use test databases** for isolation
- **Cache dependencies** where possible

### 6. Maintenance
- **Update tests** when refactoring
- **Remove obsolete tests** promptly
- **Keep test code quality** high
- **Document complex test scenarios**

## Testing Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:ci": "jest --ci --coverage --watchAll=false",
    "test:unit": "jest --testPathPattern=unit",
    "test:integration": "jest --testPathPattern=integration",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:coverage": "jest --coverage",
    "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand"
  }
}
```

This comprehensive testing manifest ensures your Next.js application has robust test coverage across all layers, from unit tests for individual functions to end-to-end tests for complete user workflows.