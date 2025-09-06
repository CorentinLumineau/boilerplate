# Next.js Fullstack Architecture Manifest

## Overview
This manifest defines a clean, scalable, and maintainable architecture for Next.js fullstack applications following SOLID principles, DRY, and industry best practices. The architecture promotes separation of concerns, testability, and clear data flow from database to UI.

## Architecture Layers (Database → UI)

### 1. Database Layer
**Location**: PostgreSQL Database  
**Responsibility**: Data persistence and integrity

**Best Practices:**
- Use normalized database design with proper foreign keys
- Implement database constraints for data integrity
- Use indexes for performance optimization
- Follow consistent naming conventions (snake_case for DB)
- Implement soft deletes where appropriate
- Use database migrations for schema changes

```sql
-- Example table structure
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);
```

### 2. Data Access Layer (Repository Pattern)
**Location**: `src/lib/repositories/`  
**Responsibility**: Abstract database operations and provide a clean interface

**Structure:**
```
src/lib/repositories/
├── base/
│   └── base-repository.ts
├── user-repository.ts
├── product-repository.ts
└── index.ts
```

**Best Practices:**
- Implement repository pattern to abstract Prisma operations
- Use dependency injection for testability
- Handle database errors at this layer
- Implement query optimization (select only needed fields)
- Use transactions for complex operations

```typescript
// Example repository
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserInput): Promise<User>;
  update(id: string, data: UpdateUserInput): Promise<User>;
  delete(id: string): Promise<void>;
}

export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}
  
  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id, deletedAt: null },
      select: { id: true, email: true, createdAt: true }
    });
  }
}
```

### 3. Domain/Entity Layer
**Location**: `src/lib/entities/` or `src/lib/domain/`  
**Responsibility**: Define business entities and domain logic

**Structure:**
```
src/lib/domain/
├── entities/
│   ├── user.entity.ts
│   └── product.entity.ts
├── value-objects/
│   ├── email.vo.ts
│   └── money.vo.ts
└── types/
    └── common.types.ts
```

**Best Practices:**
- Define pure domain entities separate from database models
- Implement value objects for complex types
- Keep business logic within entities
- Use TypeScript for strong typing
- Implement validation at entity level

```typescript
// Example entity
export class User {
  constructor(
    public readonly id: string,
    public readonly email: Email,
    public readonly createdAt: Date,
    private _isActive: boolean = true
  ) {}

  deactivate(): void {
    this._isActive = false;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  static fromPrisma(prismaUser: PrismaUser): User {
    return new User(
      prismaUser.id,
      new Email(prismaUser.email),
      prismaUser.createdAt,
      !prismaUser.deletedAt
    );
  }
}
```

### 4. Service Layer (Business Logic)
**Location**: `src/lib/services/`  
**Responsibility**: Orchestrate business operations and enforce business rules

**Structure:**
```
src/lib/services/
├── auth/
│   └── auth.service.ts
├── user/
│   └── user.service.ts
├── email/
│   └── email.service.ts
└── external/
    └── payment.service.ts
```

**Best Practices:**
- Single Responsibility Principle - one service per domain
- Use dependency injection
- Handle business logic validation
- Orchestrate multiple repositories
- Implement error handling and logging
- Keep services stateless

```typescript
export class UserService {
  constructor(
    private userRepository: IUserRepository,
    private emailService: IEmailService,
    private logger: ILogger
  ) {}

  async createUser(input: CreateUserInput): Promise<User> {
    // Business logic validation
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new ConflictError('User already exists');
    }

    // Create user
    const user = await this.userRepository.create(input);
    
    // Side effects
    await this.emailService.sendWelcomeEmail(user.email);
    this.logger.info('User created', { userId: user.id });

    return user;
  }
}
```

### 5. API Layer (Controllers/Route Handlers)
**Location**: `src/app/api/` (App Router)  
**Responsibility**: Handle HTTP requests, validation, and response formatting

**Structure:**
```
src/app/api/
├── auth/
│   ├── login/route.ts
│   └── register/route.ts
├── users/
│   ├── route.ts
│   └── [id]/route.ts
└── middleware/
    ├── auth.middleware.ts
    └── validation.middleware.ts
```

**Best Practices:**
- Keep controllers thin - delegate to services
- Implement input validation with Zod
- Use consistent response format
- Handle errors gracefully
- Implement proper HTTP status codes
- Add request/response logging

```typescript
// Example API route
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedInput = CreateUserSchema.parse(body);
    
    const userService = container.get<UserService>('UserService');
    const user = await userService.createUser(validatedInput);
    
    return NextResponse.json({
      success: true,
      data: user,
      message: 'User created successfully'
    }, { status: 201 });
    
  } catch (error) {
    return handleApiError(error);
  }
}
```

### 6. External Integration Layer
**Location**: `src/lib/integrations/`  
**Responsibility**: Handle external API calls and third-party services

**Structure:**
```
src/lib/integrations/
├── payment/
│   └── stripe.client.ts
├── email/
│   └── sendgrid.client.ts
└── analytics/
    └── mixpanel.client.ts
```

**Best Practices:**
- Implement adapter pattern for external services
- Add retry mechanisms and circuit breakers
- Handle rate limiting
- Cache responses where appropriate
- Mock external services in tests

### 7. Data Transfer Layer (DTOs)
**Location**: `src/lib/dto/`  
**Responsibility**: Define data structures for API communication

**Structure:**
```
src/lib/dto/
├── request/
│   ├── create-user.dto.ts
│   └── update-user.dto.ts
├── response/
│   ├── user.dto.ts
│   └── api-response.dto.ts
└── validation/
    └── schemas.ts
```

**Best Practices:**
- Separate DTOs from domain entities
- Use Zod for validation schemas
- Implement serialization/deserialization
- Version your DTOs for API evolution

```typescript
// Example DTO with validation
export const CreateUserSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50)
});

export type CreateUserDTO = z.infer<typeof CreateUserSchema>;

export class UserResponseDTO {
  constructor(
    public id: string,
    public email: string,
    public fullName: string,
    public createdAt: string
  ) {}

  static fromEntity(user: User): UserResponseDTO {
    return new UserResponseDTO(
      user.id,
      user.email.value,
      `${user.firstName} ${user.lastName}`,
      user.createdAt.toISOString()
    );
  }
}
```

### 8. State Management Layer (TanStack Query)
**Location**: `src/lib/queries/`  
**Responsibility**: Manage server state, caching, and synchronization

**Structure:**
```
src/lib/queries/
├── hooks/
│   ├── use-users.ts
│   └── use-auth.ts
├── keys/
│   └── query-keys.ts
├── mutations/
│   └── user-mutations.ts
└── client.ts
```

**Best Practices:**
- Use query keys factory for consistency
- Implement optimistic updates
- Handle loading and error states
- Use proper cache invalidation
- Implement background refetching

```typescript
// Query keys factory
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: string) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

// Custom hook
export function useUsers(filters?: UserFilters) {
  return useQuery({
    queryKey: userKeys.list(JSON.stringify(filters)),
    queryFn: () => fetchUsers(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

### 9. Component Layer
**Location**: `src/components/`  
**Responsibility**: UI components and presentation logic

**Structure:**
```
src/components/
├── ui/
│   ├── button.tsx
│   ├── input.tsx
│   └── modal.tsx
├── forms/
│   └── user-form.tsx
├── features/
│   ├── auth/
│   └── users/
└── layouts/
    └── main-layout.tsx
```

**Best Practices:**
- Single Responsibility Principle
- Use composition over inheritance
- Implement proper prop typing
- Keep components pure when possible
- Use custom hooks for complex logic
- Implement proper error boundaries

```typescript
// Example component
interface UserFormProps {
  initialData?: User;
  onSubmit: (data: CreateUserDTO) => Promise<void>;
  isLoading?: boolean;
}

export function UserForm({ initialData, onSubmit, isLoading }: UserFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateUserDTO>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: initialData
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form implementation */}
    </form>
  );
}
```

### 10. Page Layer
**Location**: `src/app/`  
**Responsibility**: Route components and layout composition

**Best Practices:**
- Keep pages thin - delegate to components
- Implement proper SEO metadata
- Handle loading states
- Use proper TypeScript for params

## Cross-Cutting Concerns

### Error Handling
**Location**: `src/lib/errors/`
- Custom error classes
- Global error boundaries
- API error handling
- User-friendly error messages

### Logging
**Location**: `src/lib/logging/`
- Structured logging
- Different log levels
- Performance monitoring
- Error tracking

### Configuration
**Location**: `src/lib/config/`
- Environment-based configuration
- Type-safe configuration
- Validation of environment variables

### Utilities
**Location**: `src/lib/utils/`
- Pure utility functions
- Type guards
- Formatters and validators

## Data Flow Example

```
1. User clicks "Create User" button
2. Component calls mutation hook
3. Mutation hook sends POST to /api/users
4. API route validates input with Zod
5. Controller calls UserService.createUser()
6. Service validates business rules
7. Service calls UserRepository.create()
8. Repository executes Prisma query
9. Database persists user data
10. Response flows back through layers
11. TanStack Query updates cache
12. UI re-renders with new data
```

## Best Practices Summary

### SOLID Principles
- **S**: Each layer has a single responsibility
- **O**: Use interfaces for extension without modification
- **L**: Subtypes must be substitutable for base types
- **I**: Depend on interfaces, not implementations
- **D**: High-level modules shouldn't depend on low-level modules

### DRY (Don't Repeat Yourself)
- Share common logic in utilities
- Use base classes/interfaces
- Extract reusable components
- Centralize configuration

### Additional Principles
- **Separation of Concerns**: Each layer handles specific responsibilities
- **Dependency Injection**: Use containers for better testing
- **Error Handling**: Consistent error handling across layers
- **Type Safety**: Leverage TypeScript throughout
- **Testing**: Each layer should be testable in isolation