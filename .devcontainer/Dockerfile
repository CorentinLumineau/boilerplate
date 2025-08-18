# Use Node.js 20 with Alpine for smaller size and security
FROM node:20-alpine

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    bash \
    openssh-client \
    postgresql-client \
    && rm -rf /var/cache/apk/*

# Install pnpm globally
RUN npm install -g pnpm@10.10.1

# Create and set up the non-root user
RUN addgroup -g 1000 node \
    && adduser -u 1000 -G node -s /bin/bash -D node \
    && mkdir -p /workspaces \
    && chown -R node:node /workspaces

# Switch to non-root user
USER node

# Set working directory
WORKDIR /workspaces

# Keep container running
CMD ["sleep", "infinity"]