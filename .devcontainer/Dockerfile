# Use the official Microsoft devcontainers Node.js image
FROM mcr.microsoft.com/devcontainers/javascript-node:1-20-bookworm

# Install additional packages
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
        postgresql-client \
        git \
        curl \
        wget \
        unzip \
        vim \
        nano \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm globally
RUN npm install -g pnpm@10.10.1

# Create workspace directory
RUN mkdir -p /workspaces && chown vscode:vscode /workspaces

# Switch to vscode user
USER vscode

# Set up shell
RUN echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.bashrc
RUN echo 'alias ll="ls -alF"' >> ~/.bashrc
RUN echo 'alias la="ls -A"' >> ~/.bashrc
RUN echo 'alias l="ls -CF"' >> ~/.bashrc