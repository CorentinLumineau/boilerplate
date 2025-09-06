# Milestone 04: Domain & Entity Layer

## Overview
Implement the domain/entity layer with business entities, value objects, and domain logic following Domain-Driven Design principles.

## Duration
**Estimated**: 1-2 weeks  
**Priority**: High  
**Risk Level**: Low  

## Objectives
- Implement domain entities separate from database models
- Create value objects for complex domain concepts
- Establish business logic within entities
- Implement proper domain validation
- Create entity factories and builders

## Current State Analysis
- **Domain Logic**: Scattered across application layers
- **Business Rules**: Mixed with data access and API logic
- **Validation**: Basic validation at API level only
- **Domain Models**: Direct use of Prisma models throughout app
- **Business Logic**: No centralized domain layer

## Target State
- **Pure Domain Entities**: Business logic encapsulated in entities
- **Value Objects**: Complex domain concepts properly modeled
- **Domain Validation**: Business rules enforced at domain level
- **Clean Separation**: Domain layer independent of infrastructure
- **Type Safety**: Strong typing throughout domain layer

## Phases

### Phase 1: Value Objects Implementation (2-3 days)

#### Tasks
1. **Email Value Object**
   ```typescript
   // src/lib/domain/value-objects/email.vo.ts
   export class Email {
     private readonly _value: string;

     constructor(value: string) {
       if (!this.isValid(value)) {
         throw new InvalidEmailError(`Invalid email: ${value}`);
       }
       this._value = value.toLowerCase().trim();
     }

     get value(): string {
       return this._value;
     }

     private isValid(email: string): boolean {
       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
       return emailRegex.test(email) && email.length <= 254;
     }

     equals(other: Email): boolean {
       return this._value === other._value;
     }
   }
   ```

2. **Money Value Object**
   - Amount with currency
   - Arithmetic operations
   - Currency conversion support
   - Validation and formatting

3. **Phone Value Object**
   - International phone number validation
   - Formatting standardization
   - Country code handling
   - Type-safe phone operations

4. **Address Value Object**
   - Complete address representation
   - Validation rules
   - Formatting utilities
   - Geolocation support

#### Deliverables
- ✅ Email value object with validation
- ✅ Money value object with operations
- ✅ Phone value object implementation
- ✅ Address value object functionality

### Phase 2: Base Entity Implementation (2-3 days)

#### Tasks
1. **Base Entity Class**
   ```typescript
   // src/lib/domain/entities/base.entity.ts
   export abstract class BaseEntity {
     protected constructor(
       public readonly id: EntityId,
       public readonly createdAt: Date,
       public readonly updatedAt: Date
     ) {}

     abstract equals(other: BaseEntity): boolean;

     protected static isEntity(v: any): v is BaseEntity {
       return v instanceof BaseEntity;
     }
   }

   export class EntityId {
     constructor(private readonly value: string) {
       if (!value || value.trim().length === 0) {
         throw new InvalidEntityIdError('Entity ID cannot be empty');
       }
     }

     equals(id?: EntityId): boolean {
       if (!id) return false;
       return this.value === id.value;
     }

     toString(): string {
       return this.value;
     }
   }
   ```

2. **Domain Events System**
   - Event base class
   - Event publisher/subscriber
   - Domain event handling
   - Event persistence (optional)

3. **Entity Factory Pattern**
   - Factory interfaces
   - Entity creation logic
   - Validation during creation
   - Builder pattern implementation

4. **Entity Validation Framework**
   - Validation rule engine
   - Business rule validation
   - Error aggregation
   - Contextual validation

#### Deliverables
- ✅ Base entity implementation
- ✅ Domain events system
- ✅ Entity factory pattern
- ✅ Validation framework

### Phase 3: Domain Entities Implementation (3-4 days)

#### Tasks
1. **User Entity**
   ```typescript
   // src/lib/domain/entities/user.entity.ts
   export class User extends BaseEntity {
     private constructor(
       id: EntityId,
       private _email: Email,
       private _firstName: string,
       private _lastName: string,
       private _isActive: boolean,
       createdAt: Date,
       updatedAt: Date,
       private _emailVerified: boolean = false
     ) {
       super(id, createdAt, updatedAt);
       this.validate();
     }

     static create(props: CreateUserProps): User {
       const id = new EntityId(props.id || crypto.randomUUID());
       const user = new User(
         id,
         new Email(props.email),
         props.firstName,
         props.lastName,
         true,
         new Date(),
         new Date()
       );
       
       // Emit domain event
       DomainEvents.raise(new UserCreatedEvent(user));
       return user;
     }

     get email(): Email { return this._email; }
     get fullName(): string { return `${this._firstName} ${this._lastName}`; }
     get isActive(): boolean { return this._isActive; }

     changeEmail(newEmail: Email): void {
       if (this._email.equals(newEmail)) return;
       
       this._email = newEmail;
       this._emailVerified = false;
       DomainEvents.raise(new UserEmailChangedEvent(this));
     }

     deactivate(): void {
       if (!this._isActive) return;
       
       this._isActive = false;
       DomainEvents.raise(new UserDeactivatedEvent(this));
     }

     private validate(): void {
       const errors: string[] = [];
       
       if (!this._firstName || this._firstName.trim().length === 0) {
         errors.push('First name is required');
       }
       
       if (this._firstName && this._firstName.length > 50) {
         errors.push('First name must be 50 characters or less');
       }
       
       if (errors.length > 0) {
         throw new DomainValidationError(errors);
       }
     }
   }
   ```

2. **Product Entity**
   - Product creation and management
   - Price and inventory tracking
   - Category associations
   - Product variants support

3. **Order Entity**
   - Order lifecycle management
   - Order item calculations
   - Status transitions
   - Payment tracking

4. **Order Item Entity**
   - Item quantity and pricing
   - Product reference validation
   - Calculation logic
   - Discount applications

#### Deliverables
- ✅ User entity with business logic
- ✅ Product entity implementation
- ✅ Order entity with lifecycle
- ✅ Order item entity functionality

### Phase 4: Domain Services & Testing (2-3 days)

#### Tasks
1. **Domain Services**
   ```typescript
   // src/lib/domain/services/user-domain.service.ts
   export class UserDomainService {
     constructor(private userRepository: IUserRepository) {}

     async canUserBeDeactivated(userId: EntityId): Promise<boolean> {
       const user = await this.userRepository.findById(userId.toString());
       if (!user) return false;

       // Business logic: User cannot be deactivated if they have active orders
       const activeOrders = await this.orderRepository.findActiveOrdersByUser(userId);
       return activeOrders.length === 0;
     }

     async generateUniqueUsername(baseUsername: string): Promise<string> {
       let username = baseUsername;
       let counter = 1;

       while (await this.userRepository.existsByUsername(username)) {
         username = `${baseUsername}${counter}`;
         counter++;
       }

       return username;
     }
   }
   ```

2. **Entity Mapping Utilities**
   - Entity to/from Prisma mapping
   - DTO conversion utilities
   - Type-safe mapping functions
   - Validation during mapping

3. **Domain Entity Testing**
   - Unit tests for all entities
   - Value object testing
   - Domain service testing
   - Domain event testing

4. **Integration with Repository Layer**
   - Update repositories to work with entities
   - Entity persistence mapping
   - Query result transformation
   - Transaction support

#### Deliverables
- ✅ Domain services implementation
- ✅ Entity mapping utilities
- ✅ Comprehensive entity testing
- ✅ Repository integration

## Technical Specifications

### Domain Entity Structure

```typescript
// Domain Entity Interface
export interface IDomainEntity {
  id: EntityId;
  createdAt: Date;
  updatedAt: Date;
  equals(other: IDomainEntity): boolean;
  validate(): void;
}

// Entity Creation Props
export interface CreateUserProps {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: AddressProps;
}

// Domain Events
export interface IDomainEvent {
  eventId: string;
  occurredOn: Date;
  eventVersion: number;
}

export class UserCreatedEvent implements IDomainEvent {
  public readonly eventId: string;
  public readonly occurredOn: Date;
  public readonly eventVersion = 1;

  constructor(public readonly user: User) {
    this.eventId = crypto.randomUUID();
    this.occurredOn = new Date();
  }
}
```

### Entity Factory Pattern

```typescript
// User Factory
export class UserFactory {
  static create(props: CreateUserProps): User {
    return User.create(props);
  }

  static fromPrisma(prismaUser: PrismaUser): User {
    return User.fromPersistence({
      id: prismaUser.id,
      email: prismaUser.email,
      firstName: prismaUser.firstName,
      lastName: prismaUser.lastName,
      isActive: !prismaUser.deletedAt,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
      emailVerified: prismaUser.emailVerified
    });
  }

  static toPrisma(user: User): CreatePrismaUserInput {
    return {
      id: user.id.toString(),
      email: user.email.value,
      firstName: user.firstName,
      lastName: user.lastName,
      emailVerified: user.emailVerified
    };
  }
}
```

## Domain Rules & Validation

### Business Rules Implementation
- User email must be unique across system
- User cannot be deactivated with active orders
- Order total must equal sum of order items
- Product price must be positive
- Order status transitions must follow valid flows

### Validation Strategy
- **Entity Level**: Core business rule validation
- **Value Object Level**: Format and constraint validation
- **Domain Service Level**: Cross-entity business rules
- **Aggregate Level**: Consistency boundary validation

## Success Criteria

### Functional Validation
- [ ] All domain entities implement business logic correctly
- [ ] Value objects enforce proper constraints
- [ ] Domain services handle complex business rules
- [ ] Entity factories create valid domain objects

### Design Validation
- [ ] Domain layer is independent of infrastructure
- [ ] Business logic is properly encapsulated
- [ ] Domain events are properly implemented
- [ ] Entity relationships are clearly defined

### Testing Validation
- [ ] >95% test coverage for domain layer
- [ ] All business rules are tested
- [ ] Value object validation is comprehensive
- [ ] Domain events are properly tested

## Risks & Mitigation

### Risk: Over-Engineering Domain Layer
**Impact**: Unnecessary complexity and development overhead  
**Mitigation**: 
- Start simple and add complexity as needed
- Focus on core business logic first
- Regular domain model reviews
- Keep entities focused and cohesive

### Risk: Domain/Infrastructure Coupling
**Impact**: Tight coupling between layers  
**Mitigation**:
- Clear interface contracts
- Dependency injection
- Regular architecture reviews
- Automated coupling detection

### Risk: Performance Impact
**Impact**: Object creation overhead  
**Mitigation**:
- Performance benchmarking
- Object pooling where appropriate
- Lazy loading strategies
- Profile domain layer performance

## Dependencies
- **M03**: Repository interfaces for domain service integration
- **M02**: Shared package for domain types and utilities

## Enabling Future Milestones
- **M05**: Domain entities enable rich service layer logic
- **M06**: Domain types support DTO layer implementation
- **M07**: Business logic available for API layer
- **M09**: Domain events support component layer updates

## Definition of Done
- [ ] Domain entities implemented with business logic
- [ ] Value objects handle complex domain concepts
- [ ] Domain services encapsulate business rules
- [ ] Entity factories provide clean creation patterns
- [ ] Domain events system operational
- [ ] >95% test coverage achieved
- [ ] Documentation complete
- [ ] Integration with repository layer validated
- [ ] Performance benchmarks met
- [ ] Team trained on domain layer usage
- [ ] Ready for milestone M05 initiation