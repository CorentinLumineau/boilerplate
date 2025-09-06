# Complete Next.js Turborepo Application Structure

## Root Directory Structure

```
my-app/
├── apps/
│   └── web/                          # Main Next.js application
├── packages/
│   ├── ui/                           # Shared UI components
│   ├── database/                     # Database schema and migrations
│   ├── shared/                       # Shared utilities and types
│   └── config/                       # Shared configurations
├── tooling/
│   ├── eslint/                       # ESLint configurations
│   ├── typescript/                   # TypeScript configurations
│   └── tailwind/                     # Tailwind configurations
├── .env.example
├── .gitignore
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

## Turborepo Configuration

### Root `package.json`
```json
{
  "name": "my-app",
  "private": true,
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "lint": "turbo lint",
    "test": "turbo test",
    "type-check": "turbo type-check",
    "db:push": "turbo db:push",
    "db:migrate": "turbo db:migrate",
    "db:studio": "turbo db:studio",
    "clean": "turbo clean"
  },
  "devDependencies": {
    "@turbo/gen": "^1.10.12",
    "turbo": "^1.10.12"
  },
  "packageManager": "pnpm@8.6.10",
  "engines": {
    "node": ">=18"
  }
}
```

### `pnpm-workspace.yaml`
```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "tooling/*"
```

### `turbo.json`
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "type-check": {
      "dependsOn": ["^build"]
    },
    "db:push": {
      "cache": false
    },
    "db:migrate": {
      "cache": false
    },
    "db:studio": {
      "cache": false,
      "persistent": true
    },
    "clean": {
      "cache": false
    }
  }
}
```

## Main Application Structure (`apps/web/`)

```
apps/web/
├── src/
│   ├── app/                          # App Router (Next.js 13+)
│   │   ├── (auth)/                   # Route groups
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── users/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── edit/
│   │   │   │   │       └── page.tsx
│   │   │   │   └── new/
│   │   │   │       └── page.tsx
│   │   │   ├── products/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── new/
│   │   │   │       └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── api/                      # API Routes
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── register/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── logout/
│   │   │   │   │   └── route.ts
│   │   │   │   └── me/
│   │   │   │       └── route.ts
│   │   │   ├── users/
│   │   │   │   ├── route.ts          # GET /api/users, POST /api/users
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts      # GET, PUT, DELETE /api/users/[id]
│   │   │   │       └── avatar/
│   │   │   │           └── route.ts  # POST /api/users/[id]/avatar
│   │   │   ├── products/
│   │   │   │   ├── route.ts
│   │   │   │   ├── [id]/
│   │   │   │   │   └── route.ts
│   │   │   │   └── search/
│   │   │   │       └── route.ts
│   │   │   ├── orders/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts
│   │   │   │       └── status/
│   │   │   │           └── route.ts
│   │   │   └── webhooks/
│   │   │       ├── stripe/
│   │   │       │   └── route.ts
│   │   │       └── sendgrid/
│   │   │           └── route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx                # Root layout
│   │   ├── loading.tsx               # Global loading UI
│   │   ├── error.tsx                 # Global error UI
│   │   ├── not-found.tsx             # 404 page
│   │   └── page.tsx                  # Home page
│   ├── components/                   # React Components
│   │   ├── ui/                       # Basic UI components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── card.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── dropdown.tsx
│   │   │   ├── table.tsx
│   │   │   ├── pagination.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── spinner.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── alert.tsx
│   │   │   └── index.ts
│   │   ├── forms/                    # Form components
│   │   │   ├── auth/
│   │   │   │   ├── login-form.tsx
│   │   │   │   ├── register-form.tsx
│   │   │   │   └── forgot-password-form.tsx
│   │   │   ├── user/
│   │   │   │   ├── user-form.tsx
│   │   │   │   ├── user-profile-form.tsx
│   │   │   │   └── user-avatar-form.tsx
│   │   │   ├── product/
│   │   │   │   ├── product-form.tsx
│   │   │   │   └── product-search-form.tsx
│   │   │   └── common/
│   │   │       ├── form-field.tsx
│   │   │       ├── form-error.tsx
│   │   │       └── form-submit.tsx
│   │   ├── features/                 # Feature-specific components
│   │   │   ├── auth/
│   │   │   │   ├── auth-guard.tsx
│   │   │   │   ├── auth-provider.tsx
│   │   │   │   └── session-timeout.tsx
│   │   │   ├── users/
│   │   │   │   ├── user-list.tsx
│   │   │   │   ├── user-card.tsx
│   │   │   │   ├── user-details.tsx
│   │   │   │   ├── user-avatar.tsx
│   │   │   │   └── user-filters.tsx
│   │   │   ├── products/
│   │   │   │   ├── product-list.tsx
│   │   │   │   ├── product-card.tsx
│   │   │   │   ├── product-details.tsx
│   │   │   │   ├── product-gallery.tsx
│   │   │   │   └── product-filters.tsx
│   │   │   ├── orders/
│   │   │   │   ├── order-list.tsx
│   │   │   │   ├── order-card.tsx
│   │   │   │   ├── order-details.tsx
│   │   │   │   └── order-status.tsx
│   │   │   └── dashboard/
│   │   │       ├── stats-cards.tsx
│   │   │       ├── recent-orders.tsx
│   │   │       ├── revenue-chart.tsx
│   │   │       └── activity-feed.tsx
│   │   ├── layouts/                  # Layout components
│   │   │   ├── main-layout.tsx
│   │   │   ├── auth-layout.tsx
│   │   │   ├── dashboard-layout.tsx
│   │   │   ├── header.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── navigation.tsx
│   │   │   └── footer.tsx
│   │   └── providers/                # Context providers
│   │       ├── query-provider.tsx
│   │       ├── theme-provider.tsx
│   │       ├── toast-provider.tsx
│   │       └── auth-provider.tsx
│   ├── lib/                          # Core business logic
│   │   ├── auth/                     # Authentication
│   │   │   ├── config.ts
│   │   │   ├── auth.ts               # Better-auth configuration
│   │   │   ├── middleware.ts
│   │   │   └── types.ts
│   │   ├── config/                   # Configuration
│   │   │   ├── env.ts                # Environment variables validation
│   │   │   ├── database.ts           # Database configuration
│   │   │   ├── app.ts                # App configuration
│   │   │   └── constants.ts          # App constants
│   │   ├── domain/                   # Domain layer
│   │   │   ├── entities/
│   │   │   │   ├── user.entity.ts
│   │   │   │   ├── product.entity.ts
│   │   │   │   ├── order.entity.ts
│   │   │   │   └── base.entity.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── email.vo.ts
│   │   │   │   ├── money.vo.ts
│   │   │   │   ├── phone.vo.ts
│   │   │   │   └── address.vo.ts
│   │   │   └── types/
│   │   │       ├── common.types.ts
│   │   │       ├── user.types.ts
│   │   │       ├── product.types.ts
│   │   │       └── order.types.ts
│   │   ├── dto/                      # Data Transfer Objects
│   │   │   ├── request/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── login.dto.ts
│   │   │   │   │   ├── register.dto.ts
│   │   │   │   │   └── reset-password.dto.ts
│   │   │   │   ├── user/
│   │   │   │   │   ├── create-user.dto.ts
│   │   │   │   │   ├── update-user.dto.ts
│   │   │   │   │   └── user-filters.dto.ts
│   │   │   │   ├── product/
│   │   │   │   │   ├── create-product.dto.ts
│   │   │   │   │   ├── update-product.dto.ts
│   │   │   │   │   └── product-filters.dto.ts
│   │   │   │   └── order/
│   │   │   │       ├── create-order.dto.ts
│   │   │   │       ├── update-order.dto.ts
│   │   │   │       └── order-filters.dto.ts
│   │   │   ├── response/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── login.response.ts
│   │   │   │   │   └── session.response.ts
│   │   │   │   ├── user/
│   │   │   │   │   ├── user.response.ts
│   │   │   │   │   └── user-list.response.ts
│   │   │   │   ├── product/
│   │   │   │   │   ├── product.response.ts
│   │   │   │   │   └── product-list.response.ts
│   │   │   │   ├── order/
│   │   │   │   │   ├── order.response.ts
│   │   │   │   │   └── order-list.response.ts
│   │   │   │   └── common/
│   │   │   │       ├── api-response.ts
│   │   │   │       ├── pagination.response.ts
│   │   │   │       └── error.response.ts
│   │   │   └── validation/
│   │   │       ├── auth.schemas.ts
│   │   │       ├── user.schemas.ts
│   │   │       ├── product.schemas.ts
│   │   │       ├── order.schemas.ts
│   │   │       └── common.schemas.ts
│   │   ├── repositories/             # Data Access Layer
│   │   │   ├── base/
│   │   │   │   ├── base.repository.ts
│   │   │   │   └── repository.interface.ts
│   │   │   ├── user/
│   │   │   │   ├── user.repository.ts
│   │   │   │   └── user.repository.interface.ts
│   │   │   ├── product/
│   │   │   │   ├── product.repository.ts
│   │   │   │   └── product.repository.interface.ts
│   │   │   ├── order/
│   │   │   │   ├── order.repository.ts
│   │   │   │   └── order.repository.interface.ts
│   │   │   └── index.ts
│   │   ├── services/                 # Business Logic Layer
│   │   │   ├── auth/
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── auth.service.interface.ts
│   │   │   ├── user/
│   │   │   │   ├── user.service.ts
│   │   │   │   └── user.service.interface.ts
│   │   │   ├── product/
│   │   │   │   ├── product.service.ts
│   │   │   │   └── product.service.interface.ts
│   │   │   ├── order/
│   │   │   │   ├── order.service.ts
│   │   │   │   └── order.service.interface.ts
│   │   │   ├── email/
│   │   │   │   ├── email.service.ts
│   │   │   │   └── email.service.interface.ts
│   │   │   ├── storage/
│   │   │   │   ├── storage.service.ts
│   │   │   │   └── storage.service.interface.ts
│   │   │   └── notification/
│   │   │       ├── notification.service.ts
│   │   │       └── notification.service.interface.ts
│   │   ├── integrations/             # External Services
│   │   │   ├── payment/
│   │   │   │   ├── stripe/
│   │   │   │   │   ├── stripe.client.ts
│   │   │   │   │   ├── stripe.types.ts
│   │   │   │   │   └── stripe.config.ts
│   │   │   │   └── paypal/
│   │   │   │       ├── paypal.client.ts
│   │   │   │       ├── paypal.types.ts
│   │   │   │       └── paypal.config.ts
│   │   │   ├── email/
│   │   │   │   ├── sendgrid/
│   │   │   │   │   ├── sendgrid.client.ts
│   │   │   │   │   ├── sendgrid.types.ts
│   │   │   │   │   └── sendgrid.config.ts
│   │   │   │   └── resend/
│   │   │   │       ├── resend.client.ts
│   │   │   │       ├── resend.types.ts
│   │   │   │       └── resend.config.ts
│   │   │   ├── storage/
│   │   │   │   ├── aws-s3/
│   │   │   │   │   ├── s3.client.ts
│   │   │   │   │   ├── s3.types.ts
│   │   │   │   │   └── s3.config.ts
│   │   │   │   └── cloudinary/
│   │   │   │       ├── cloudinary.client.ts
│   │   │   │       ├── cloudinary.types.ts
│   │   │   │       └── cloudinary.config.ts
│   │   │   ├── analytics/
│   │   │   │   ├── mixpanel/
│   │   │   │   │   ├── mixpanel.client.ts
│   │   │   │   │   ├── mixpanel.types.ts
│   │   │   │   │   └── mixpanel.config.ts
│   │   │   │   └── google-analytics/
│   │   │   │       ├── ga.client.ts
│   │   │   │       ├── ga.types.ts
│   │   │   │       └── ga.config.ts
│   │   │   └── sms/
│   │   │       └── twilio/
│   │   │           ├── twilio.client.ts
│   │   │           ├── twilio.types.ts
│   │   │           └── twilio.config.ts
│   │   ├── queries/                  # TanStack Query (React Query)
│   │   │   ├── client/
│   │   │   │   ├── query-client.ts
│   │   │   │   └── query-options.ts
│   │   │   ├── keys/
│   │   │   │   ├── query-keys.ts
│   │   │   │   ├── user.keys.ts
│   │   │   │   ├── product.keys.ts
│   │   │   │   └── order.keys.ts
│   │   │   ├── hooks/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── use-login.ts
│   │   │   │   │   ├── use-register.ts
│   │   │   │   │   ├── use-logout.ts
│   │   │   │   │   └── use-session.ts
│   │   │   │   ├── users/
│   │   │   │   │   ├── use-users.ts
│   │   │   │   │   ├── use-user.ts
│   │   │   │   │   ├── use-create-user.ts
│   │   │   │   │   ├── use-update-user.ts
│   │   │   │   │   └── use-delete-user.ts
│   │   │   │   ├── products/
│   │   │   │   │   ├── use-products.ts
│   │   │   │   │   ├── use-product.ts
│   │   │   │   │   ├── use-create-product.ts
│   │   │   │   │   ├── use-update-product.ts
│   │   │   │   │   └── use-delete-product.ts
│   │   │   │   └── orders/
│   │   │   │       ├── use-orders.ts
│   │   │   │       ├── use-order.ts
│   │   │   │       ├── use-create-order.ts
│   │   │   │       ├── use-update-order.ts
│   │   │   │       └── use-delete-order.ts
│   │   │   ├── mutations/
│   │   │   │   ├── user.mutations.ts
│   │   │   │   ├── product.mutations.ts
│   │   │   │   ├── order.mutations.ts
│   │   │   │   └── auth.mutations.ts
│   │   │   └── queries/
│   │   │       ├── user.queries.ts
│   │   │       ├── product.queries.ts
│   │   │       ├── order.queries.ts
│   │   │       └── auth.queries.ts
│   │   ├── utils/                    # Utility functions
│   │   │   ├── api/
│   │   │   │   ├── api-client.ts
│   │   │   │   ├── api-error.ts
│   │   │   │   ├── api-response.ts
│   │   │   │   └── api-utils.ts
│   │   │   ├── auth/
│   │   │   │   ├── permissions.ts
│   │   │   │   ├── roles.ts
│   │   │   │   └── session.ts
│   │   │   ├── format/
│   │   │   │   ├── date.ts
│   │   │   │   ├── currency.ts
│   │   │   │   ├── number.ts
│   │   │   │   └── string.ts
│   │   │   ├── validation/
│   │   │   │   ├── email.ts
│   │   │   │   ├── phone.ts
│   │   │   │   ├── password.ts
│   │   │   │   └── url.ts
│   │   │   ├── file/
│   │   │   │   ├── upload.ts
│   │   │   │   ├── image.ts
│   │   │   │   └── pdf.ts
│   │   │   ├── crypto/
│   │   │   │   ├── hash.ts
│   │   │   │   ├── encrypt.ts
│   │   │   │   └── random.ts
│   │   │   ├── db/
│   │   │   │   ├── transaction.ts
│   │   │   │   ├── pagination.ts
│   │   │   │   └── filters.ts
│   │   │   └── common/
│   │   │       ├── array.ts
│   │   │       ├── object.ts
│   │   │       ├── string.ts
│   │   │       ├── type-guards.ts
│   │   │       └── constants.ts
│   │   ├── errors/                   # Error handling
│   │   │   ├── base/
│   │   │   │   ├── base.error.ts
│   │   │   │   └── error.types.ts
│   │   │   ├── api/
│   │   │   │   ├── api.error.ts
│   │   │   │   ├── validation.error.ts
│   │   │   │   ├── authentication.error.ts
│   │   │   │   └── authorization.error.ts
│   │   │   ├── business/
│   │   │   │   ├── business.error.ts
│   │   │   │   ├── user.error.ts
│   │   │   │   ├── product.error.ts
│   │   │   │   └── order.error.ts
│   │   │   ├── external/
│   │   │   │   ├── external.error.ts
│   │   │   │   ├── payment.error.ts
│   │   │   │   └── email.error.ts
│   │   │   └── handlers/
│   │   │       ├── global.handler.ts
│   │   │       ├── api.handler.ts
│   │   │       └── client.handler.ts
│   │   ├── middleware/                # API middleware
│   │   │   ├── auth.middleware.ts
│   │   │   ├── cors.middleware.ts
│   │   │   ├── rate-limit.middleware.ts
│   │   │   ├── validation.middleware.ts
│   │   │   ├── logging.middleware.ts
│   │   │   └── error.middleware.ts
│   │   ├── logging/                  # Logging
│   │   │   ├── logger.ts
│   │   │   ├── winston.config.ts
│   │   │   └── log.types.ts
│   │   ├── containers/               # Dependency Injection
│   │   │   ├── container.ts
│   │   │   ├── bindings.ts
│   │   │   └── types.ts
│   │   └── hooks/                    # Custom React hooks
│   │       ├── use-debounce.ts
│   │       ├── use-local-storage.ts
│   │       ├── use-previous.ts
│   │       ├── use-intersection-observer.ts
│   │       ├── use-media-query.ts
│   │       ├── use-clipboard.ts
│   │       └── use-async.ts
│   ├── styles/                       # Styling
│   │   ├── globals.css
│   │   ├── components.css
│   │   └── utilities.css
│   └── types/                        # Global TypeScript types
│       ├── api.ts
│       ├── auth.ts
│       ├── global.d.ts
│       └── next-auth.d.ts
├── public/                           # Static assets
│   ├── images/
│   │   ├── logos/
│   │   ├── icons/
│   │   └── placeholders/
│   ├── fonts/
│   └── favicon.ico
├── __tests__/                        # Tests
│   ├── __mocks__/
│   ├── api/
│   ├── components/
│   ├── services/
│   ├── utils/
│   └── setup.ts
├── docs/                             # Documentation
│   ├── api/
│   ├── deployment/
│   └── development/
├── .env.example
├── .env.local
├── .gitignore
├── .eslintrc.js
├── .prettierrc
├── jest.config.js
├── next.config.js
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## Shared Packages Structure

### Database Package (`packages/database/`)

```
packages/database/
├── prisma/
│   ├── migrations/
│   ├── seeds/
│   │   ├── users.seed.ts
│   │   ├── products.seed.ts
│   │   └── index.ts
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── client.ts
│   ├── types.ts
│   └── utils.ts
├── package.json
└── tsconfig.json
```

### UI Package (`packages/ui/`)

```
packages/ui/
├── src/
│   ├── components/
│   │   ├── button/
│   │   │   ├── button.tsx
│   │   │   ├── button.stories.tsx
│   │   │   ├── button.test.tsx
│   │   │   └── index.ts
│   │   ├── input/
│   │   │   ├── input.tsx
│   │   │   ├── input.stories.tsx
│   │   │   ├── input.test.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── hooks/
│   │   └── index.ts
│   ├── utils/
│   │   └── index.ts
│   └── styles/
│       └── index.css
├── package.json
├── tsconfig.json
└── tailwind.config.js
```

### Shared Package (`packages/shared/`)

```
packages/shared/
├── src/
│   ├── types/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   ├── product.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── validation.ts
│   │   ├── format.ts
│   │   ├── crypto.ts
│   │   └── index.ts
│   ├── constants/
│   │   ├── api.ts
│   │   ├── errors.ts
│   │   └── index.ts
│   └── schemas/
│       ├── user.schema.ts
│       ├── product.schema.ts
│       └── index.ts
├── package.json
└── tsconfig.json
```

### Config Package (`packages/config/`)

```
packages/config/
├── src/
│   ├── eslint/
│   │   ├── base.js
│   │   ├── next.js
│   │   └── react.js
│   ├── typescript/
│   │   ├── base.json
│   │   ├── next.json
│   │   └── react.json
│   └── tailwind/
│       ├── base.js
│       └── preset.js
├── package.json
└── tsconfig.json
```

## Key Configuration Files

### Main App `package.json` (`apps/web/package.json`)

```json
{
  "name": "web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "build": "next build",
    "dev": "next dev",
    "lint": "next lint",
    "start": "next start",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@tanstack/react-query": "^5.0.0",
    "@tanstack/react-query-devtools": "^5.0.0",
    "better-auth": "^0.8.0",
    "zod": "^3.22.0",
    "tailwindcss": "^3.3.0",
    "@hookform/resolvers": "^3.3.0",
    "react-hook-form": "^7.47.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "class-variance-authority": "^0.7.0",
    "lucide-react": "^0.294.0",
    "date-fns": "^2.30.0",
    "@database/client": "workspace:*",
    "@shared/utils": "workspace:*",
    "@ui/components": "workspace:*"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.2.0",
    "eslint": "^8.51.0",
    "eslint-config-next": "^14.0.0",
    "@config/eslint": "workspace:*",
    "@config/typescript": "workspace:*",
    "@config/tailwind": "workspace:*",
    "jest": "^29.7.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^6.1.0",
    "tsx": "^4.0.0"
  }
}
```

### Next.js Configuration (`apps/web/next.config.js`)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    transpilePackages: ["@ui/components", "@shared/utils", "@database/client"],
  },
  images: {
    domains: ["localhost", "example.com"],
    formats: ["image/avif", "image/webp"],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: false,
        has: [
          {
            type: "cookie",
            key: "auth-token",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
```

### TypeScript Configuration (`apps/web/tsconfig.json`)

```json
{
  "extends": "@config/typescript/next.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/app/*": ["./src/app/*"],
      "@/types/*": ["./src/types/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

### Tailwind Configuration (`apps/web/tailwind.config.js`)

```javascript
const { createGlobPatternsForDependencies } = require("@nx/react/tailwind");
const sharedConfig = require("@config/tailwind/preset");

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [sharedConfig],
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          500: "#3b82f6",
          900: "#1e3a8a",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
```

This structure provides:

1. **Monorepo organization** with Turborepo for optimal builds and caching
2. **Clear separation of concerns** across all layers
3. **Shared packages** for reusable code
4. **Type safety** throughout the entire application
5. **Scalable folder structure** that can grow with your application
6. **Best practices implementation** following the architecture manifest
7. **Proper dependency management** between packages
8. **Development tooling** configured for the entire monorepo

Each folder has a specific purpose and follows the layered architecture defined in the manifest, ensuring maintainability and scalability as your application grows.