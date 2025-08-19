# Development Container (devcontainer) Setup

This directory contains VS Code devcontainer configuration for consistent development environments using Docker.

## Quick Start

### Prerequisites
- [Docker](https://www.docker.com/get-started) installed and running
- [VS Code](https://code.visualstudio.com/) with [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

### Setup
1. **Clone the repository** (if not already done)
   ```bash
   git clone <repository-url>
   cd boilerplate
   ```

2. **Open in VS Code**
   ```bash
   code .
   ```

3. **Reopen in Container**
   - VS Code should prompt to "Reopen in Container"
   - Or use Command Palette: `Dev Containers: Reopen in Container`

4. **Wait for setup** - The container will automatically:
   - Install Node.js 20 and pnpm 10.10.1
   - Install project dependencies (`pnpm install`)
   - Run database migrations (`pnpm db:migrate`)
   - Generate Prisma client (`pnpm db:generate`)

## Development Commands

### Project-Specific Commands (from CLAUDE.md)

#### Turborepo Commands (Root Level)
```bash
pnpm build          # Build all apps and packages
pnpm dev            # Start all development servers concurrently
pnpm lint           # Lint all apps and packages
pnpm type-check     # Type check all TypeScript code
pnpm test           # Run tests across all apps
pnpm clean          # Clean build outputs
pnpm format         # Format code with Prettier
```

#### Individual App Commands
```bash
pnpm --filter @boilerplate/web dev    # Start web application
make dev-web                          # Alternative start command
```

#### Database Commands (using Makefile)
```bash
make db-up          # Start PostgreSQL database + run migrations
make db-down        # Stop database
make db-restart     # Restart database
make db-clean       # Remove database + volumes (⚠️ deletes data)
make db-migrate     # Run migrations
make db-reset       # Reset database with fresh schema
make db-logs        # Show database logs
make db-studio      # Start Prisma Studio GUI
```

#### Database Commands (using pnpm)
```bash
pnpm db:studio      # Start Prisma Studio
pnpm db:migrate     # Run migrations
pnpm db:generate    # Generate Prisma client
pnpm db:reset       # Reset database
pnpm db:seed        # Seed database
```

### Starting Development
1. **Start the application:**
   ```bash
   pnpm dev
   ```
   
2. **Access the application:**
   - Web App: http://localhost:3000
   - Prisma Studio: http://localhost:5555 (when running)

## Container Configuration

### Services
- **devcontainer**: Development environment with Node.js, pnpm, and development tools
- **postgres**: PostgreSQL database (shared with main docker-compose.yml)

### Ports
- **3000**: Next.js web application (auto-forwarded)
- **5432**: PostgreSQL database (auto-forwarded)
- **5555**: Prisma Studio (auto-forwarded)

### VS Code Extensions
The following extensions are automatically installed:
- **TypeScript**: Advanced TypeScript support
- **Tailwind CSS**: IntelliSense for Tailwind
- **Prettier**: Code formatting
- **ESLint**: Linting and code quality
- **Prisma**: Database schema support
- **GitHub Copilot**: AI assistance (if available)
- **Error Lens**: Inline error display
- **Todo Tree**: Task management
- **Better Comments**: Enhanced comment highlighting

### Environment Variables
Environment variables are configured through:
1. **Local environment**: Uses `${localEnv:VARIABLE_NAME}` to inherit from host
2. **Fallback values**: Provides defaults for development
3. **Security**: No hardcoded credentials in configuration files

## Troubleshooting

### Container Issues
```bash
# Rebuild container from scratch
Dev Containers: Rebuild Container

# View container logs
docker-compose -f docker-compose.yml -f .devcontainer/docker-compose.dev.yml logs devcontainer

# Clean up and restart
Dev Containers: Rebuild Container (No Cache)
```

### Database Issues
```bash
# Check database status
make db-logs

# Reset database completely
make db-clean && make db-up

# Verify database connection
pnpm --filter @boilerplate/web db:generate
```

### Development Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules apps/web/node_modules
pnpm install

# Check TypeScript issues
pnpm type-check

# Run linting
pnpm lint
```

### VS Code Issues
- **Extensions not loading**: Restart VS Code in container
- **IntelliSense not working**: Run `TypeScript: Restart TS Server`
- **Port forwarding issues**: Check VS Code ports tab

## Architecture

### File Structure
```
.devcontainer/
├── devcontainer.json       # Main devcontainer configuration
├── docker-compose.dev.yml  # Development Docker Compose overrides
├── Dockerfile             # Custom development container image
└── README.md              # This documentation
```

### Integration with Project
- **Monorepo support**: Works with Turborepo structure
- **Database integration**: Uses existing PostgreSQL setup
- **Environment consistency**: Matches production Node.js version
- **Tool compatibility**: Includes all project development tools

## Security Features
- **Non-root user**: Container runs as `node` user
- **Environment variables**: Uses secure variable inheritance
- **No hardcoded secrets**: All sensitive data through environment
- **Minimal attack surface**: Alpine-based image with only needed packages

## Performance Optimizations
- **Cached volumes**: Node modules cached for faster rebuilds
- **Layered caching**: Docker layers optimized for development
- **Selective copying**: Only workspace files mounted as volume
- **Health checks**: Database readiness verification

## Support

For project-specific help:
1. Check the main [CLAUDE.md](../CLAUDE.md) file
2. Review [Makefile](../Makefile) for available commands
3. Consult [docs/](../docs/) directory for deployment guides

For devcontainer issues:
- [VS Code Dev Containers documentation](https://code.visualstudio.com/docs/remote/containers)
- [Docker troubleshooting](https://docs.docker.com/get-started/overview/)