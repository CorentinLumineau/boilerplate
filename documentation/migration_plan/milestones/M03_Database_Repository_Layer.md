# Milestone 03: Database & Repository Layer

## Overview
Implement the repository pattern and optimize the database layer to abstract database operations and provide clean interfaces following the architecture manifest.

## Duration
**Estimated**: 1-2 weeks  
**Priority**: High  
**Risk Level**: Medium  

## Objectives
- Implement repository pattern with proper interfaces
- Optimize database schema for performance and scalability
- Create base repository with common operations
- Establish proper transaction management
- Implement comprehensive database testing

## Current State Analysis
- **Database**: Basic Prisma setup with minimal schema
- **Data Access**: Direct Prisma calls throughout application
- **Abstraction**: No repository pattern implementation
- **Testing**: Limited database testing infrastructure
- **Performance**: Basic database operations without optimization

## Target State
- **Repository Pattern**: Clean abstraction layer over Prisma
- **Optimized Schema**: Performance-optimized database design
- **Interface Contracts**: Proper TypeScript interfaces for repositories
- **Transaction Support**: Robust transaction management
- **Comprehensive Testing**: Full test coverage for data access layer

## Phases

### Phase 1: Database Schema Optimization (2-3 days)

#### Tasks
1. **Schema Analysis & Design**
   - Audit current schema for optimization opportunities
   - Design normalized schema with proper relationships
   - Add missing indexes for performance
   - Implement soft delete patterns

2. **Enhanced Schema Implementation**
   ```sql
   -- Users table with optimizations
   CREATE TABLE users (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     email VARCHAR(255) UNIQUE NOT NULL,
     email_verified BOOLEAN DEFAULT FALSE,
     first_name VARCHAR(100),
     last_name VARCHAR(100),
     avatar_url TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     deleted_at TIMESTAMP WITH TIME ZONE,
     
     -- Indexes for performance
     INDEX idx_users_email (email),
     INDEX idx_users_created_at (created_at),
     INDEX idx_users_deleted_at (deleted_at)
   );
   ```

3. **Additional Domain Tables**
   - Products table with categories
   - Orders and order items
   - User sessions and audit logs
   - System configuration tables

4. **Migration Strategy**
   - Create reversible migrations
   - Data migration scripts
   - Index creation strategies
   - Performance testing of migrations

#### Deliverables
- ✅ Optimized database schema
- ✅ Performance indexes implemented
- ✅ Migration scripts created
- ✅ Schema documentation

### Phase 2: Base Repository Implementation (3-4 days)

#### Tasks
1. **Create Base Repository Interface**
   ```typescript
   // src/lib/repositories/base/repository.interface.ts
   export interface IBaseRepository<T, ID = string> {
     findById(id: ID): Promise<T | null>;
     findMany(filters?: FilterOptions): Promise<T[]>;
     create(data: CreateInput<T>): Promise<T>;
     update(id: ID, data: UpdateInput<T>): Promise<T>;
     delete(id: ID): Promise<void>;
     softDelete?(id: ID): Promise<void>;
     count(filters?: FilterOptions): Promise<number>;
   }
   ```

2. **Base Repository Implementation**
   - Generic CRUD operations
   - Soft delete support
   - Query optimization
   - Error handling
   - Logging integration

3. **Repository Types and Utilities**
   - Filter types and builders
   - Pagination utilities
   - Sort options
   - Search functionality

4. **Transaction Management**
   - Transaction wrapper utilities
   - Rollback mechanisms
   - Transaction scoping
   - Error handling in transactions

#### Deliverables
- ✅ Base repository interface and implementation
- ✅ Common repository utilities
- ✅ Transaction management system
- ✅ Repository type definitions

### Phase 3: Domain-Specific Repositories (3-4 days)

#### Tasks
1. **User Repository Implementation**
   ```typescript
   // src/lib/repositories/user/user.repository.ts
   export class UserRepository extends BaseRepository<User> implements IUserRepository {
     async findByEmail(email: string): Promise<User | null> {
       return this.prisma.user.findUnique({
         where: { email, deletedAt: null },
         select: this.defaultSelect
       });
     }

     async findActiveUsers(filters: UserFilters): Promise<User[]> {
       return this.findMany({
         ...filters,
         where: { deletedAt: null }
       });
     }
   }
   ```

2. **Product Repository**
   - Product CRUD operations
   - Category filtering
   - Search functionality
   - Inventory management

3. **Order Repository**
   - Order management
   - Status tracking
   - User order history
   - Order analytics

4. **Session Repository**
   - Session management
   - User authentication tracking
   - Session cleanup
   - Security monitoring

#### Deliverables
- ✅ User repository with specialized methods
- ✅ Product repository implementation
- ✅ Order repository functionality
- ✅ Session management repository

### Phase 4: Repository Testing & Validation (2-3 days)

#### Tasks
1. **Unit Tests for Repositories**
   - Test each repository method
   - Mock Prisma interactions
   - Validate error handling
   - Test transaction behavior

2. **Integration Tests**
   - Real database testing
   - Transaction testing
   - Performance testing
   - Concurrent operation testing

3. **Repository Performance Optimization**
   - Query performance analysis
   - N+1 query prevention
   - Batch operation optimization
   - Connection pool management

4. **Documentation & Guidelines**
   - Repository usage patterns
   - Best practices documentation
   - Error handling guidelines
   - Performance optimization tips

#### Deliverables
- ✅ Comprehensive repository test suite
- ✅ Performance optimizations
- ✅ Repository documentation
- ✅ Usage guidelines

## Technical Specifications

### Repository Pattern Structure

```typescript
// Base Repository Interface
export interface IBaseRepository<TEntity, TCreateInput, TUpdateInput, TFilters = any> {
  findById(id: string): Promise<TEntity | null>;
  findMany(filters?: TFilters): Promise<TEntity[]>;
  findFirst(filters: TFilters): Promise<TEntity | null>;
  create(data: TCreateInput): Promise<TEntity>;
  createMany(data: TCreateInput[]): Promise<TEntity[]>;
  update(id: string, data: TUpdateInput): Promise<TEntity>;
  updateMany(filters: TFilters, data: TUpdateInput): Promise<number>;
  delete(id: string): Promise<void>;
  deleteMany(filters: TFilters): Promise<number>;
  softDelete?(id: string): Promise<TEntity>;
  count(filters?: TFilters): Promise<number>;
  exists(filters: TFilters): Promise<boolean>;
}

// Base Repository Implementation
export abstract class BaseRepository<TEntity, TCreateInput, TUpdateInput, TFilters> 
  implements IBaseRepository<TEntity, TCreateInput, TUpdateInput, TFilters> {
  
  protected abstract model: any;
  protected abstract defaultSelect: any;

  constructor(protected prisma: PrismaClient) {}

  async findById(id: string): Promise<TEntity | null> {
    return this.model.findUnique({
      where: { id, deletedAt: null },
      select: this.defaultSelect
    });
  }

  async create(data: TCreateInput): Promise<TEntity> {
    return this.model.create({
      data,
      select: this.defaultSelect
    });
  }

  // ... other implementations
}
```

### Database Configuration Optimization

```typescript
// Database client with optimizations
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

// Connection pool configuration
prisma.$connect();

// Query performance monitoring
prisma.$use(async (params, next) => {
  const before = Date.now();
  const result = await next(params);
  const after = Date.now();
  
  console.log(`Query ${params.model}.${params.action} took ${after - before}ms`);
  return result;
});
```

## Migration Strategy

### Database Migration Approach
1. **Schema Evolution**: Incremental schema changes with rollback capability
2. **Data Migration**: Safe data transformation with validation
3. **Index Creation**: Non-blocking index creation strategies
4. **Performance Testing**: Validate migration performance impact

### Code Migration Strategy
1. **Repository Implementation**: Create repositories without breaking existing code
2. **Gradual Adoption**: Replace direct Prisma calls incrementally
3. **Interface Compliance**: Ensure all repositories implement proper interfaces
4. **Testing Integration**: Validate repository functionality throughout migration

## Success Criteria

### Functional Validation
- [ ] All repository operations work correctly
- [ ] Database queries are optimized
- [ ] Transaction management is robust
- [ ] Error handling is comprehensive

### Performance Validation
- [ ] Query performance improved by >30%
- [ ] N+1 queries eliminated
- [ ] Database connection pooling optimized
- [ ] Migration performance acceptable

### Testing Validation
- [ ] >95% test coverage for repository layer
- [ ] All integration tests pass
- [ ] Performance tests meet benchmarks
- [ ] Error scenarios properly tested

## Risks & Mitigation

### Risk: Database Migration Failures
**Impact**: Data loss or corruption  
**Mitigation**: 
- Comprehensive backup procedures
- Rollback migration scripts
- Staged migration approach
- Validation at each step

### Risk: Performance Degradation
**Impact**: Slower application response times  
**Mitigation**:
- Performance benchmarking before/after
- Query analysis and optimization
- Index strategy validation
- Load testing

### Risk: Repository Complexity
**Impact**: Over-engineered abstraction layer  
**Mitigation**:
- Keep repositories focused and simple
- Follow YAGNI principle
- Regular complexity audits
- Clear interface contracts

## Dependencies
- **M02**: Database package must be available
- **M01**: Testing infrastructure for repository testing

## Enabling Future Milestones
- **M04**: Repository layer enables domain entity implementations
- **M05**: Clean data access for service layer
- **M06**: Repository interfaces support DTO layer
- **M07**: Optimized data layer for enhanced APIs

## Definition of Done
- [ ] Repository pattern fully implemented
- [ ] Database schema optimized
- [ ] All repositories tested with >95% coverage
- [ ] Performance benchmarks met
- [ ] Documentation complete
- [ ] Migration scripts validated
- [ ] Team trained on repository usage
- [ ] Error handling comprehensive
- [ ] Transaction management robust
- [ ] Ready for milestone M04 initiation