# Development Container Setup

This directory contains the configuration for using VS Code's Development Containers feature with this project.

## Prerequisites

- [Docker](https://www.docker.com/get-started) installed and running
- [VS Code](https://code.visualstudio.com/) with the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

## Getting Started

1. **Open in Container**: 
   - Open VS Code in the project root
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type "Dev Containers: Reopen in Container" and select it
   - VS Code will build and start the development container

2. **First-time Setup**:
   - The container will automatically run `pnpm install` and `pnpm db:generate`
   - Wait for the setup to complete (this may take a few minutes on first run)

3. **Start Development**:
   - Run `pnpm dev` to start the Next.js development server
   - The application will be available at http://localhost:3000
   - PostgreSQL database is automatically available at localhost:5432
   - Prisma Studio can be started with `pnpm db:studio` (available at localhost:5555)

## What's Included

### Development Environment
- Node.js 20 with pnpm
- PostgreSQL client tools
- Git and GitHub CLI
- Common shell utilities (zsh with oh-my-zsh)

### VS Code Extensions
- TypeScript support with latest language features
- Tailwind CSS IntelliSense
- Prettier code formatting
- ESLint for code quality
- Prisma syntax highlighting and IntelliSense
- Error lens for inline error display
- TODO highlighting and tree view
- Path IntelliSense
- Auto rename tag for HTML/JSX

### Port Forwarding
- **3000**: Next.js development server (auto-opens in browser)
- **5432**: PostgreSQL database
- **5555**: Prisma Studio (database GUI)

### Environment Variables
The container automatically sets:
- `DATABASE_URL`: Connection to the PostgreSQL container
- `NODE_ENV`: Set to "development"

## Database

The development container uses the existing `docker-compose.yml` configuration:
- PostgreSQL 16 Alpine
- Database name: `auth_db`
- Username: `auth_user`
- Password: `auth_password`

The database persists data in Docker volumes, so your data will be preserved between container restarts.

## Common Commands

```bash
# Start development server
pnpm dev

# Run database migrations
pnpm db:migrate

# Open Prisma Studio
pnpm db:studio

# Run linting
pnpm lint

# Run type checking
pnpm type-check

# Build the project
pnpm build
```

## Troubleshooting

### Container won't start
- Make sure Docker is running
- Try "Dev Containers: Rebuild Container" if you've made changes to the configuration

### Database connection issues
- Check that PostgreSQL container is healthy: `docker ps`
- Verify the DATABASE_URL environment variable is correct
- Try restarting the containers: "Dev Containers: Rebuild Container"

### Slow performance
- Make sure Docker has sufficient resources allocated (CPU/Memory)
- Consider using cached volumes for better performance

### Extensions not working
- Try "Developer: Reload Window" in VS Code
- Check if extensions are installed in the container (not just locally)

## Customization

You can customize the development environment by modifying:
- `.devcontainer/devcontainer.json`: VS Code settings and extensions
- `.devcontainer/Dockerfile`: Additional system packages and tools
- `.devcontainer/docker-compose.dev.yml`: Container configuration and services