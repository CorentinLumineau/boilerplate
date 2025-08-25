#!/usr/bin/env tsx
/**
 * Complete Project Setup Script for Web App
 * 
 * Run this script after cloning the template to fully setup your web application.
 * Usage: npx tsx scripts/setup-project.ts
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, cpSync } from 'fs';
import { join } from 'path';
import * as readline from 'readline';
import { randomBytes } from 'crypto';
import { readdirSync } from 'fs';

interface ProjectAnswers {
  name: string;
  displayName: string;
  description: string;
  authorName: string;
  authorEmail: string;
  authorUrl: string;
  repositoryUrl: string;
  homepageUrl: string;
  githubUrl: string;
  namespace: string;
  
  // Database configuration
  dbName: string;
  dbUser: string;
  dbPassword: string;
  
  // Development configuration - Single port
  webPort: string;
  
  // Production configuration - Single domain
  productionWebUrl: string;
  
  // Staging configuration - Single domain
  stagingWebUrl: string;
  
  // Security
  authSecret: string;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function generateSecretKey(): string {
  return randomBytes(64).toString('hex');
}

async function collectProjectInfo(): Promise<ProjectAnswers> {
  console.log('🚀 Welcome to the V0 Boilerplate Web App Setup!\n');
  console.log('This script will configure your unified web application in one go.\n');

  // Project Information
  console.log('📋 PROJECT INFORMATION');
  const name = await question('Project name (kebab-case): ');
  const displayName = await question('Display name: ');
  const description = await question('Project description: ');
  
  // Author Information
  console.log('\n👤 AUTHOR INFORMATION');
  const authorName = await question('Author name: ');
  const authorEmail = await question('Author email: ');
  const authorUrl = await question('Author website (optional): ');
  
  // Repository Information
  console.log('\n🔗 REPOSITORY INFORMATION');
  const repositoryUrl = await question('Repository URL: ');
  const githubUrl = await question('GitHub URL (same as repository if GitHub): ') || repositoryUrl;
  const homepageUrl = await question('Homepage URL (optional): ');
  
  // Database Configuration
  console.log('\n🗄️  DATABASE CONFIGURATION');
  const dbName = await question(`Database name [${name}_db]: `) || `${name}_db`;
  const dbUser = await question(`Database user [${name}_user]: `) || `${name}_user`;
  const dbPassword = await question('Database password [auto-generated]: ') || randomBytes(16).toString('hex');
  
  // Development Configuration - Single port
  console.log('\n⚙️  DEVELOPMENT CONFIGURATION');
  const webPort = await question('Web app port [3000]: ') || '3000';
  
  // Production Configuration - Single domain
  console.log('\n🌐 PRODUCTION CONFIGURATION');
  const productionWebUrl = await question('Production web URL (e.g., https://myapp.com): ');
  
  // Staging Configuration - Single domain
  console.log('\n🟡 STAGING CONFIGURATION');
  const domain = productionWebUrl.replace('https://', '').split('.').slice(-2).join('.');
  const appName = productionWebUrl.replace('https://', '').split('.')[0];
  
  const stagingWebUrl = await question(`Staging web URL [https://${appName}-staging.${domain}]: `) || `https://${appName}-staging.${domain}`;
  
  // Security
  console.log('\n🔐 SECURITY CONFIGURATION');
  console.log('Generating secure authentication secret...');
  const authSecret = generateSecretKey();
  
  const namespace = `@${name}`;

  return {
    name,
    displayName,
    description,
    authorName,
    authorEmail,
    authorUrl,
    repositoryUrl,
    githubUrl,
    homepageUrl,
    namespace,
    dbName,
    dbUser,
    dbPassword,
    webPort,
    productionWebUrl,
    stagingWebUrl,
    authSecret,
  };
}

function updateProjectConfig(answers: ProjectAnswers) {
  const configPath = join(process.cwd(), 'packages/config/project.config.ts');
  
  if (!existsSync(configPath)) {
    console.log('⚠️  Project config file not found, skipping...');
    return;
  }
  
  let config = readFileSync(configPath, 'utf-8');

  // Update basic info
  config = config.replace(/name: ".*?"/, `name: "${answers.name}"`);
  config = config.replace(/displayName: ".*?"/, `displayName: "${answers.displayName}"`);
  config = config.replace(/description: ".*?"/, `description: "${answers.description}"`);

  // Update author info
  config = config.replace(/name: "Your Name"/, `name: "${answers.authorName}"`);
  config = config.replace(/email: "your-email@example.com"/, `email: "${answers.authorEmail}"`);
  config = config.replace(/url: "https:\/\/your-website.com"/, `url: "${answers.authorUrl}"`);

  // Update URLs
  config = config.replace(/repository: ".*?"/, `repository: "${answers.repositoryUrl}"`);
  config = config.replace(/homepage: ".*?"/, `homepage: "${answers.homepageUrl}"`);
  config = config.replace(/github: ".*?"/, `github: "${answers.githubUrl}"`);

  // Update production URLs - Single domain
  config = config.replace(/url: "https:\/\/boilerplate\.lumineau\.app"/, `url: "${answers.productionWebUrl}"`);

  // Update staging URLs - Single domain
  config = config.replace(/url: "https:\/\/boilerplate-staging\.lumineau\.app"/, `url: "${answers.stagingWebUrl}"`);

  // Update develop URL patterns - Single domain
  const domain = answers.productionWebUrl.replace('https://', '').split('.').slice(-2).join('.');
  const appName = answers.productionWebUrl.replace('https://', '').split('.')[0];
  
  config = config.replace(/urlPattern: "https:\/\/boilerplate-git-\{branch\}\.lumineau\.app"/, `urlPattern: "https://${appName}-git-{branch}.${domain}"`);

  // Update namespace
  config = config.replace(/namespace: "@boilerplate"/, `namespace: "${answers.namespace}"`);

  // Update development configuration - Single port
  config = config.replace(/port: 3000/, `port: ${answers.webPort}`);
  config = config.replace(/url: "http:\/\/localhost:3000"/, `url: "http://localhost:${answers.webPort}"`);

  // Update database configuration
  config = config.replace(/name: "auth_db"/, `name: "${answers.dbName}"`);
  config = config.replace(/user: "auth_user"/, `user: "${answers.dbUser}"`);
  config = config.replace(/password: "auth_password"/, `password: "${answers.dbPassword}"`);

  // Update Docker container name
  config = config.replace(/containerName: "boilerplate-postgres"/, `containerName: "${answers.name}-postgres"`);

  writeFileSync(configPath, config);
  console.log('✅ Updated packages/config/project.config.ts');
}

function updatePackageJson(answers: ProjectAnswers) {
  const rootPackagePath = join(process.cwd(), 'package.json');
  const rootPackage = JSON.parse(readFileSync(rootPackagePath, 'utf-8'));
  
  rootPackage.name = `${answers.name}-monorepo`;
  rootPackage.description = answers.description;
  rootPackage.author = {
    name: answers.authorName,
    email: answers.authorEmail,
    url: answers.authorUrl,
  };
  rootPackage.repository = {
    type: 'git',
    url: answers.repositoryUrl,
  };
  rootPackage.homepage = answers.homepageUrl;

  writeFileSync(rootPackagePath, JSON.stringify(rootPackage, null, 2));
  console.log('✅ Updated root package.json');

  // Update web app package.json
  const webPackagePath = join(process.cwd(), 'apps/web/package.json');
  if (existsSync(webPackagePath)) {
    const webPackage = JSON.parse(readFileSync(webPackagePath, 'utf-8'));
    webPackage.name = `${answers.namespace}/web`;
    webPackage.description = `${answers.displayName} - Web Application`;
    
    // Update build scripts to use new namespace
    webPackage.scripts.build = webPackage.scripts.build.replace(/@boilerplate\/types/g, `${answers.namespace}/types`);
    webPackage.scripts.build = webPackage.scripts.build.replace(/@boilerplate\/config/g, `${answers.namespace}/config`);
    webPackage.scripts["build:production"] = webPackage.scripts["build:production"].replace(/@boilerplate\/types/g, `${answers.namespace}/types`);
    webPackage.scripts["build:production"] = webPackage.scripts["build:production"].replace(/@boilerplate\/config/g, `${answers.namespace}/config`);
    
    // Update dependencies
    webPackage.dependencies[`${answers.namespace}/config`] = webPackage.dependencies["@boilerplate/config"];
    webPackage.dependencies[`${answers.namespace}/types`] = webPackage.dependencies["@boilerplate/types"];
    delete webPackage.dependencies["@boilerplate/config"];
    delete webPackage.dependencies["@boilerplate/types"];
    
    writeFileSync(webPackagePath, JSON.stringify(webPackage, null, 2));
    console.log('✅ Updated web app package.json');
  }

  // Update types package.json
  const typesPackagePath = join(process.cwd(), 'packages/types/package.json');
  if (existsSync(typesPackagePath)) {
    const typesPackage = JSON.parse(readFileSync(typesPackagePath, 'utf-8'));
    typesPackage.name = `${answers.namespace}/types`;
    writeFileSync(typesPackagePath, JSON.stringify(typesPackage, null, 2));
    console.log('✅ Updated types package.json');
  }

  // Update config package.json
  const configPackagePath = join(process.cwd(), 'packages/config/package.json');
  if (existsSync(configPackagePath)) {
    const configPackage = JSON.parse(readFileSync(configPackagePath, 'utf-8'));
    configPackage.name = `${answers.namespace}/config`;
    writeFileSync(configPackagePath, JSON.stringify(configPackage, null, 2));
    console.log('✅ Updated config package.json');
  }
}

function updateDockerCompose(answers: ProjectAnswers) {
  const dockerComposePath = join(process.cwd(), 'docker-compose.yml');
  
  if (!existsSync(dockerComposePath)) {
    console.log('⚠️  docker-compose.yml not found, skipping...');
    return;
  }
  
  let dockerCompose = readFileSync(dockerComposePath, 'utf-8');

  // Update container name - handle both direct and environment variable cases
  dockerCompose = dockerCompose.replace(/container_name: \${PROJECT_NAME:-[^}]+}-postgres/, `container_name: \${PROJECT_NAME:-${answers.name}}-postgres`);
  dockerCompose = dockerCompose.replace(/container_name: boilerplate-postgres/, `container_name: ${answers.name}-postgres`);
  
  // Update volume name - handle both direct and environment variable cases
  dockerCompose = dockerCompose.replace(/name: \${PROJECT_NAME:-[^}]+}-postgres-data/, `name: \${PROJECT_NAME:-${answers.name}}-postgres-data`);
  dockerCompose = dockerCompose.replace(/name: boilerplate-postgres-data/, `name: ${answers.name}-postgres-data`);
  
  // Update network name - handle both direct and environment variable cases
  dockerCompose = dockerCompose.replace(/name: \${PROJECT_NAME:-[^}]+}-network/g, `name: \${PROJECT_NAME:-${answers.name}}-network`);
  dockerCompose = dockerCompose.replace(/name: boilerplate-network/g, `name: ${answers.name}-network`);
  dockerCompose = dockerCompose.replace(/- boilerplate-network/, `- ${answers.name}-network`);
  dockerCompose = dockerCompose.replace(/boilerplate-network:/, `${answers.name}-network:`);

  writeFileSync(dockerComposePath, dockerCompose);
  console.log('✅ Updated docker-compose.yml');
}

function createEnvironmentFiles(answers: ProjectAnswers) {
  // Create web app .env file (for local development) - FIXED: should be .env not .env.local
  const webEnvPath = join(process.cwd(), 'apps/web/.env');
  const databaseUrl = `postgresql://${answers.dbUser}:${answers.dbPassword}@localhost:5432/${answers.dbName}`;
  
  const webEnvContent = `# Local Development Environment Variables

# Database Configuration (Required)
DATABASE_URL="${databaseUrl}"

# Authentication Configuration (Required)
BETTER_AUTH_SECRET="${answers.authSecret}"

# Optional: Social OAuth providers (for local testing)
# GITHUB_CLIENT_ID="your-github-client-id"
# GITHUB_CLIENT_SECRET="your-github-client-secret"
# GOOGLE_CLIENT_ID="your-google-client-id"
# GOOGLE_CLIENT_SECRET="your-google-client-secret"
`;

  writeFileSync(webEnvPath, webEnvContent);
  console.log('✅ Created apps/web/.env');

  // Create/Update .env.project file for Docker Compose
  const projectEnvPath = join(process.cwd(), '.env.project');
  const projectEnvContent = `# Docker Compose Configuration Variables
# This file is generated by scripts/setup-project.ts
# Used exclusively by docker-compose.yml for local PostgreSQL container

PROJECT_NAME=${answers.name}
DB_NAME=${answers.dbName}
DB_USER=${answers.dbUser}
DB_PASSWORD=${answers.dbPassword}
DB_PORT=5432
`;

  writeFileSync(projectEnvPath, projectEnvContent);
  console.log('✅ Created/Updated .env.project for Docker Compose');

  // Update .env.example files
  const webEnvExamplePath = join(process.cwd(), 'apps/web/.env.example');
  if (existsSync(webEnvExamplePath)) {
    const exampleContent = `# Local Development Environment Variables
# Copy this file to .env and customize for your setup

# Database Configuration (Required)
DATABASE_URL="postgresql://${answers.dbUser}:${answers.dbPassword}@localhost:5432/${answers.dbName}"

# Authentication Configuration (Required)
BETTER_AUTH_SECRET="your-super-secret-key-here-at-least-32-characters-long"

# Optional: Social OAuth providers (for local testing)
# GITHUB_CLIENT_ID="your-github-client-id"
# GITHUB_CLIENT_SECRET="your-github-client-secret"
# GOOGLE_CLIENT_ID="your-google-client-id"
# GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Note: For production deployment, see docs/vercel-deployment.md
# Environment detection is handled automatically via project.config.ts
`;
    writeFileSync(webEnvExamplePath, exampleContent);
    console.log('✅ Updated apps/web/.env.example');
  }
}

function updateMakefile(answers: ProjectAnswers) {
  const makefilePath = join(process.cwd(), 'Makefile');
  
  if (!existsSync(makefilePath)) {
    console.log('⚠️  Makefile not found, skipping...');
    return;
  }
  
  let makefile = readFileSync(makefilePath, 'utf-8');

  // Update title comment
  makefile = makefile.replace(/# V0 Boilerplate Makefile/, `# ${answers.displayName} Makefile`);

  // Update package filter references - Replace all @boilerplate references
  makefile = makefile.replace(/@boilerplate\/([a-zA-Z0-9_-]+)/g, `${answers.namespace}/$1`);

  writeFileSync(makefilePath, makefile);
  console.log('✅ Updated Makefile');
}

function updateManifestJson(answers: ProjectAnswers) {
  const manifestPath = join(process.cwd(), 'apps/web/public/manifest.json');
  
  if (!existsSync(manifestPath)) {
    console.log('ℹ️  PWA manifest.json not found, skipping...');
    return;
  }
  
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
  
  // Update app metadata
  manifest.name = answers.displayName;
  manifest.short_name = answers.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  manifest.description = answers.description;
  
  // Update start URL based on web URL
  if (answers.productionWebUrl) {
    manifest.start_url = new URL('/', answers.productionWebUrl).pathname;
  }
  
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('✅ Updated PWA manifest.json');
}

function updateSetupGuide(answers: ProjectAnswers) {
  const setupPath = join(process.cwd(), 'SETUP.md');
  
  if (!existsSync(setupPath)) {
    console.log('ℹ️  SETUP.md not found, skipping...');
    return;
  }
  
  let setup = readFileSync(setupPath, 'utf-8');

  // Update title and descriptions
  setup = setup.replace(/This guide will help you bootstrap a new project using this Next\.js 15 monorepo template with authentication\./, 
    `This guide will help you set up ${answers.displayName}.`);
  
  // Update git clone example
  setup = setup.replace(/git clone <your-repo-url> my-new-project/, 
    `git clone ${answers.repositoryUrl} ${answers.name}`);
  setup = setup.replace(/cd my-new-project/, `cd ${answers.name}`);

  // Update package filter examples - Single app
  setup = setup.replace(/pnpm --filter @boilerplate\/backend/g, `pnpm --filter ${answers.namespace}/web`);
  setup = setup.replace(/pnpm --filter @boilerplate\/frontend/g, `pnpm --filter ${answers.namespace}/web`);

  // Update port references - Single port
  setup = setup.replace(/localhost:3100/g, `localhost:${answers.webPort}`);
  setup = setup.replace(/localhost:3101/g, `localhost:${answers.webPort}`);
  setup = setup.replace(/port 3100/g, `port ${answers.webPort}`);
  setup = setup.replace(/port 3101/g, `port ${answers.webPort}`);

  // Update database configuration in setup guide
  setup = setup.replace(/postgresql:\/\/auth_user:auth_password@localhost:5432\/auth_db/, 
    `postgresql://${answers.dbUser}:${answers.dbPassword}@localhost:5432/${answers.dbName}`);

  writeFileSync(setupPath, setup);
  console.log('✅ Updated SETUP.md');
}

function updateVercelDeploymentGuide(answers: ProjectAnswers) {
  const deploymentGuidePath = join(process.cwd(), 'docs/vercel-deployment.md');
  
  if (!existsSync(deploymentGuidePath)) {
    console.log('ℹ️  Vercel deployment guide not found, skipping...');
    return;
  }
  
  let guide = readFileSync(deploymentGuidePath, 'utf-8');
  
  // Extract domain information
  const domain = answers.productionWebUrl.replace('https://', '').split('.').slice(-2).join('.');
  const appName = answers.productionWebUrl.replace('https://', '').split('.')[0];
  
  // Replace template placeholders
  guide = guide.replace(/\{\{PROJECT_NAME\}\}/g, answers.name);
  guide = guide.replace(/\{\{PROJECT_DISPLAY_NAME\}\}/g, answers.displayName);
  guide = guide.replace(/\{\{PROJECT_NAMESPACE\}\}/g, answers.namespace);
  guide = guide.replace(/\{\{PRODUCTION_WEB_URL\}\}/g, answers.productionWebUrl);
  guide = guide.replace(/\{\{STAGING_WEB_URL\}\}/g, answers.stagingWebUrl);
  guide = guide.replace(/\{\{CUSTOM_WEB_DOMAIN\}\}/g, answers.productionWebUrl.replace('https://', ''));
  
  // Development URL patterns
  guide = guide.replace(/\{\{DEVELOP_WEB_URL_PATTERN\}\}/g, `https://${appName}-git-{branch}.${domain}`);
  guide = guide.replace(/\{\{EXAMPLE_DEVELOP_WEB_URL\}\}/g, `https://${appName}-git-feature-auth.${domain}`);
  
  writeFileSync(deploymentGuidePath, guide);
  console.log('✅ Updated docs/vercel-deployment.md with project configuration');
}

// NEW FUNCTION: Comprehensive import replacement throughout the codebase
function replaceBoilerplateImports(answers: ProjectAnswers) {
  console.log('🔄 Replacing @boilerplate imports throughout the codebase...');
  
  // Recursively find all files in the project
  function findFiles(dir: string, extensions: string[] = []): string[] {
    const files: string[] = [];
    
    try {
      const items = readdirSync(dir, { withFileTypes: true });
      
      for (const item of items) {
        const fullPath = join(dir, item.name);
        
        // Skip node_modules, .git, and other common directories
        if (item.isDirectory()) {
          if (['node_modules', '.git', '.turbo', 'dist', 'build', 'coverage'].includes(item.name)) {
            continue;
          }
          files.push(...findFiles(fullPath, extensions));
        } else if (item.isFile()) {
          // If extensions specified, only include matching files
          if (extensions.length === 0 || extensions.some(ext => item.name.endsWith(ext))) {
            files.push(fullPath);
          }
        }
      }
    } catch (error) {
      // Skip directories we can't read
      console.log(`⚠️  Skipping directory ${dir}: ${error}`);
    }
    
    return files;
  }
  
  // Get all files in the project
  const projectRoot = process.cwd();
  const allFiles = findFiles(projectRoot);
  
  // File extensions to process (text files that might contain @boilerplate references)
  const textExtensions = [
    '.ts', '.tsx', '.js', '.jsx', '.mjs', '.json', '.md', '.yml', '.yaml', 
    '.txt', '.cfg', '.conf', '.rc', '.config', '.env.example', '.env', '.git',
    '.html', '.css', '.scss', '.sql', '.sh', '.bat', '.ps1', '.xml', '.toml',
    '.prettierrc'
  ];
  
  // Filter to only text files and exclude the setup script itself
  const setupScriptPath = join(projectRoot, 'scripts/setup-project.ts');
  const textFiles = allFiles.filter(file => {
    const ext = file.split('.').pop()?.toLowerCase();
    return ext && textExtensions.includes(`.${ext}`) && file !== setupScriptPath;
  });
  
  console.log(`📁 Found ${textFiles.length} text files to process...`);
  
  let totalReplacements = 0;
  let filesUpdated = 0;
  
  for (const filePath of textFiles) {
    try {
      let content = readFileSync(filePath, 'utf-8');
      let fileReplacements = 0;
      
      // Replace all @boilerplate patterns with the new namespace
      // This regex finds @boilerplate/ followed by any word characters
      const boilerplateRegex = /@boilerplate\/([a-zA-Z0-9_-]+)/g;
      
      // Additional comprehensive patterns for boilerplate text (case-insensitive)
      const boilerplateTextPatterns = [
        { pattern: /boilerplate/gi, replacement: answers.name },
        { pattern: /Boilerplate/g, replacement: answers.displayName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') },
        { pattern: /https:\/\/boilerplate\.lumineau\.app/g, replacement: answers.productionWebUrl },
        { pattern: /https:\/\/boilerplate-staging\.lumineau\.app/g, replacement: answers.stagingWebUrl },
        { pattern: /boilerplate-postgres/g, replacement: `${answers.name}-postgres` },
        { pattern: /boilerplate-network/g, replacement: `${answers.name}-network` },
        { pattern: /boilerplate-postgres-data/g, replacement: `${answers.name}-postgres-data` },
        { pattern: /\/workspaces\/boilerplate/g, replacement: `/workspaces/${answers.name}` },
        { pattern: /"boilerplate"/g, replacement: `"${answers.name}"` },
        { pattern: /boilerplate-/g, replacement: `${answers.name}-` }
      ];
      
      let currentContent = content.replace(boilerplateRegex, (match, packageName) => {
        fileReplacements++;
        return `${answers.namespace}/${packageName}`;
      });
      
      // Apply additional boilerplate text replacements
      for (const { pattern, replacement } of boilerplateTextPatterns) {
        // Be more careful about what we're replacing
        const matches = currentContent.match(pattern);
        if (matches) {
          // For case-insensitive replacements, be extra careful
          if (pattern.flags.includes('i')) {
            // Skip replacement if it would affect the actual project name
            const safeMatches = matches.filter(match => {
              const lowerMatch = match.toLowerCase();
              const lowerProjectName = answers.name.toLowerCase();
              return !lowerMatch.includes(lowerProjectName) && !lowerProjectName.includes(lowerMatch);
            });
            
            if (safeMatches.length > 0) {
              currentContent = currentContent.replace(pattern, replacement);
              fileReplacements += safeMatches.length;
            }
          } else {
            currentContent = currentContent.replace(pattern, replacement);
            fileReplacements += matches.length;
          }
        }
      }
      
      if (currentContent !== content) {
        writeFileSync(filePath, currentContent);
        totalReplacements += fileReplacements;
        filesUpdated++;
        
        // Show relative path for better readability
        const relativePath = filePath.replace(projectRoot, '').replace(/^\//, '');
        console.log(`✅ Updated ${relativePath} (${fileReplacements} replacements)`);
      }
    } catch (error) {
      // Skip files we can't read or write (binary files, etc.)
      const relativePath = filePath.replace(projectRoot, '').replace(/^\//, '');
      console.log(`⚠️  Skipping ${relativePath}: ${error}`);
    }
  }
  
  console.log(`✅ Import replacement complete!`);
  console.log(`   - Files updated: ${filesUpdated}`);
  console.log(`   - Total replacements: ${totalReplacements}`);
  
  // Additional validation: check if any @boilerplate references remain
  console.log('\n🔍 Validating that all @boilerplate references were replaced...');
  let remainingReferences = 0;
  
  for (const filePath of textFiles) {
    try {
      // Skip the setup script itself during validation (already filtered out, but double-check)
      const currentSetupScriptPath = join(projectRoot, 'scripts/setup-project.ts');
      if (filePath === currentSetupScriptPath) {
        continue;
      }
      
      const content = readFileSync(filePath, 'utf-8');
      const boilerplateMatches = content.match(/@boilerplate\//g);
      const textMatches = content.match(/boilerplate/gi);
      
      if (boilerplateMatches) {
        remainingReferences += boilerplateMatches.length;
        const relativePath = filePath.replace(projectRoot, '').replace(/^\//, '');
        console.log(`⚠️  Found ${boilerplateMatches.length} remaining @boilerplate references in ${relativePath}`);
      }
      
      if (textMatches) {
        // Filter out legitimate project name references and common words
        const filteredMatches = textMatches.filter((match: string) => {
          const lowerMatch = match.toLowerCase();
          const lowerProjectName = answers.name.toLowerCase();
          
          // Skip if it's the actual project name or part of it
          if (lowerMatch.includes(lowerProjectName) || lowerProjectName.includes(lowerMatch)) {
            return false;
          }
          
          // Skip common words that might contain "boiler" or "plate"
          const commonWords = ['boiler', 'plate', 'plated', 'plating'];
          if (commonWords.some(word => lowerMatch === word)) {
            return false;
          }
          
          // Skip if this is a special file that we handle separately
          const specialFiles = [
            '.devcontainer/devcontainer.json',
            '.devcontainer/docker-compose.dev.yml',
            'CLAUDE.md',
            'README.md',
            'Makefile',
            '.prettierrc'
          ];
          const relativePath = filePath.replace(projectRoot, '').replace(/^\//, '');
          if (specialFiles.some(file => relativePath.includes(file))) {
            return false;
          }
          
          return true;
        });
        
        if (filteredMatches.length > 0) {
          remainingReferences += filteredMatches.length;
          const relativePath = filePath.replace(projectRoot, '').replace(/^\//, '');
          if (!boilerplateMatches) { // Don't duplicate the message
            console.log(`⚠️  Found ${filteredMatches.length} remaining boilerplate text references in ${relativePath}`);
          }
        }
      }
    } catch (error) {
      // Skip files we can't read
    }
  }
  
  if (remainingReferences === 0) {
    console.log('✅ All @boilerplate references successfully replaced!');
  } else {
    console.log(`⚠️  Found ${remainingReferences} remaining boilerplate references. You may need to manually review these files.`);
  }
}

// Function to handle special files with specific boilerplate references
function handleSpecialFiles(answers: ProjectAnswers) {
  const projectRoot = process.cwd();
  let specialReplacements = 0;
  
  // Handle devcontainer.json
  const devcontainerPath = join(projectRoot, '.devcontainer/devcontainer.json');
  if (existsSync(devcontainerPath)) {
    try {
      let content = readFileSync(devcontainerPath, 'utf-8');
      let replacements = 0;
      
      // Replace "Boilerplate Development" with project display name
      if (content.includes('"Boilerplate Development"')) {
        content = content.replace('"Boilerplate Development"', `"${answers.displayName} Development"`);
        replacements++;
      }
      
      // Replace "/workspaces/boilerplate" with "/workspaces/{project-name}"
      const workspacePattern = /\/workspaces\/boilerplate/g;
      const workspaceMatches = content.match(workspacePattern);
      if (workspaceMatches) {
        content = content.replace(workspacePattern, `/workspaces/${answers.name}`);
        replacements += workspaceMatches.length;
      }
      
      if (replacements > 0) {
        writeFileSync(devcontainerPath, content);
        specialReplacements += replacements;
        console.log(`✅ Updated .devcontainer/devcontainer.json (${replacements} replacements)`);
      }
    } catch (error) {
      console.log(`⚠️  Error updating .devcontainer/devcontainer.json: ${error}`);
    }
  }
  
  // Handle docker-compose.dev.yml
  const dockerDevPath = join(projectRoot, '.devcontainer/docker-compose.dev.yml');
  if (existsSync(dockerDevPath)) {
    try {
      let content = readFileSync(dockerDevPath, 'utf-8');
      let replacements = 0;
      
      // Replace "/workspaces/boilerplate" paths
      const workspacePaths = [
        `/workspaces/boilerplate/node_modules`,
        `/workspaces/boilerplate/apps/web/node_modules`,
        `/workspaces/boilerplate`
      ];
      
      for (const oldPath of workspacePaths) {
        const newPath = oldPath.replace('/boilerplate', `/${answers.name}`);
        const matches = content.match(new RegExp(oldPath.replace(/\//g, '\\/'), 'g'));
        if (matches) {
          content = content.replace(new RegExp(oldPath.replace(/\//g, '\\/'), 'g'), newPath);
          replacements += matches.length;
        }
      }
      
      if (replacements > 0) {
        writeFileSync(dockerDevPath, content);
        specialReplacements += replacements;
        console.log(`✅ Updated .devcontainer/docker-compose.dev.yml (${replacements} replacements)`);
      }
    } catch (error) {
      console.log(`⚠️  Error updating .devcontainer/docker-compose.dev.yml: ${error}`);
    }
  }
  
  // Handle CLAUDE.md
  const claudeMdPath = join(projectRoot, 'CLAUDE.md');
  if (existsSync(claudeMdPath)) {
    try {
      let content = readFileSync(claudeMdPath, 'utf-8');
      let replacements = 0;
      
      // Replace "This boilerplate supports automatic multi-environment deployment:" with project-specific text
      const boilerplateText = "This boilerplate supports automatic multi-environment deployment:";
      const projectText = `This project supports automatic multi-environment deployment:`;
      
      if (content.includes(boilerplateText)) {
        content = content.replace(boilerplateText, projectText);
        replacements++;
        console.log(`✅ Updated CLAUDE.md (1 replacement)`);
      }
      
      // Replace other boilerplate references in CLAUDE.md
      const boilerplateText2 = "V0 Boilerplate";
      const projectText2 = answers.displayName;
      
      if (content.includes(boilerplateText2)) {
        content = content.replace(boilerplateText2, projectText2);
        replacements++;
      }
      
      if (replacements > 0) {
        writeFileSync(claudeMdPath, content);
        specialReplacements += replacements;
        console.log(`✅ Updated CLAUDE.md (${replacements} replacements)`);
      }
    } catch (error) {
      console.log(`⚠️  Error updating CLAUDE.md: ${error}`);
    }
  }
  
  // Handle README.md
  const readmePath = join(projectRoot, 'README.md');
  if (existsSync(readmePath)) {
    try {
      let content = readFileSync(readmePath, 'utf-8');
      let replacements = 0;
      
      // Replace boilerplate title
      const titlePattern = /# Boilerplate/g;
      if (content.includes('# Boilerplate')) {
        content = content.replace(titlePattern, `# ${answers.displayName}`);
        replacements++;
      }
      
      // Replace boilerplate directory reference
      const dirPattern = /boilerplate\//g;
      const dirMatches = content.match(dirPattern);
      if (dirMatches) {
        content = content.replace(dirPattern, `${answers.name}/`);
        replacements += dirMatches.length;
      }
      
      // Replace boilerplate text occurrences
      const boilerplateTextPattern = /This boilerplate/gi;
      const projectText = `This ${answers.displayName}`;
      const boilerplateTextMatches = content.match(boilerplateTextPattern);
      if (boilerplateTextMatches) {
        content = content.replace(boilerplateTextPattern, projectText);
        replacements += boilerplateTextMatches.length;
      }
      
      if (replacements > 0) {
        writeFileSync(readmePath, content);
        specialReplacements += replacements;
        console.log(`✅ Updated README.md (${replacements} replacements)`);
      }
    } catch (error) {
      console.log(`⚠️  Error updating README.md: ${error}`);
    }
  }
  
  // Handle Makefile
  const makefilePath = join(projectRoot, 'Makefile');
  if (existsSync(makefilePath)) {
    try {
      let content = readFileSync(makefilePath, 'utf-8');
      let replacements = 0;
      
      // Update PROJECT_NAME default value
      const projectNamePattern = /PROJECT_NAME \?= boilerplate/g;
      if (content.includes('PROJECT_NAME ?= boilerplate')) {
        content = content.replace(projectNamePattern, `PROJECT_NAME ?= ${answers.name}`);
        replacements++;
      }
      
      if (replacements > 0) {
        writeFileSync(makefilePath, content);
        specialReplacements += replacements;
        console.log(`✅ Updated Makefile (${replacements} replacements)`);
      }
    } catch (error) {
      console.log(`⚠️  Error updating Makefile: ${error}`);
    }
  }
  
  // Handle .prettierrc
  const prettierrcPath = join(projectRoot, '.prettierrc');
  if (existsSync(prettierrcPath)) {
    try {
      let content = readFileSync(prettierrcPath, 'utf-8');
      let replacements = 0;
      
      // Update @boilerplate/config reference
      const configPattern = /@boilerplate\/config/g;
      if (content.includes('@boilerplate/config')) {
        content = content.replace(configPattern, `${answers.namespace}/config`);
        replacements++;
      }
      
      if (replacements > 0) {
        writeFileSync(prettierrcPath, content);
        specialReplacements += replacements;
        console.log(`✅ Updated .prettierrc (${replacements} replacements)`);
      }
    } catch (error) {
      console.log(`⚠️  Error updating .prettierrc: ${error}`);
    }
  }
  
  if (specialReplacements > 0) {
    console.log(`✅ Special files handling complete (${specialReplacements} total replacements)`);
  }
}

function displaySummary(answers: ProjectAnswers) {
  console.log('\n📋 PROJECT CONFIGURATION SUMMARY');
  console.log('==================================');
  console.log(`Project Name: ${answers.displayName}`);
  console.log(`Package Namespace: ${answers.namespace}`);
  console.log(`Repository: ${answers.repositoryUrl}`);
  console.log(`Author: ${answers.authorName} <${answers.authorEmail}>`);
  console.log('');
  console.log('🗄️  DATABASE:');
  console.log(`  Name: ${answers.dbName}`);
  console.log(`  User: ${answers.dbUser}`);
  console.log(`  Password: ${answers.dbPassword}`);
  console.log('');
  console.log('🌐 DEVELOPMENT URLS:');
  console.log(`  Web App: http://localhost:${answers.webPort}`);
  console.log(`  API Health: http://localhost:${answers.webPort}/api/health`);
  console.log('');
  console.log('🌍 PRODUCTION URLS:');
  console.log(`  Web App: ${answers.productionWebUrl}`);
  console.log('');
  console.log('🟡 STAGING URLS:');
  console.log(`  Web App: ${answers.stagingWebUrl}`);
  console.log('');
  console.log('🔐 SECURITY:');
  console.log(`  Auth Secret: ${answers.authSecret.substring(0, 16)}... (64 chars)`);
}

function validateSetup(answers: ProjectAnswers) {
  console.log('\n🔍 Validating setup...');
  
  // Check if .env.project exists and has correct values
  const projectEnvPath = join(process.cwd(), '.env.project');
  if (!existsSync(projectEnvPath)) {
    throw new Error('❌ .env.project file not found. Setup may be incomplete.');
  }
  
  const projectEnv = readFileSync(projectEnvPath, 'utf-8');
  const requiredVars = ['PROJECT_NAME', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
  
  for (const varName of requiredVars) {
    if (!projectEnv.includes(`${varName}=`)) {
      throw new Error(`❌ Missing ${varName} in .env.project file.`);
    }
  }
  
  // Check if web .env exists (FIXED: should be .env not .env.local)
  const webEnvPath = join(process.cwd(), 'apps/web/.env');
  if (!existsSync(webEnvPath)) {
    throw new Error('❌ apps/web/.env file not found. Setup may be incomplete.');
  }
  
  const webEnv = readFileSync(webEnvPath, 'utf-8');
  if (!webEnv.includes('DATABASE_URL=') || !webEnv.includes('BETTER_AUTH_SECRET=')) {
    throw new Error('❌ Missing required environment variables in apps/web/.env.');
  }
  
  // Check if docker-compose.yml has been updated
  const dockerComposePath = join(process.cwd(), 'docker-compose.yml');
  if (existsSync(dockerComposePath)) {
    const dockerCompose = readFileSync(dockerComposePath, 'utf-8');
    
    // Check if it still contains obvious boilerplate references
    if (dockerCompose.includes('boilerplate-postgres') || 
        dockerCompose.includes('boilerplate-network') || 
        dockerCompose.includes('boilerplate-postgres-data')) {
      throw new Error('❌ docker-compose.yml still contains boilerplate references. Setup may be incomplete.');
    }
    
    // Check if .env.project exists and has been updated
    const envProjectPath = join(process.cwd(), '.env.project');
    if (existsSync(envProjectPath)) {
      const envProject = readFileSync(envProjectPath, 'utf-8');
      if (envProject.includes('auth_user') || envProject.includes('auth_db') || envProject.includes('auth_password')) {
        console.log('⚠️  Warning: .env.project still contains default values. This may cause database authentication issues.');
        console.log('Current .env.project content:');
        console.log(envProject);
      }
    } else {
      console.log('⚠️  Warning: .env.project file not found. Database authentication may fail.');
    }
  }
  
  // Check if Makefile has been updated
  const makefilePath = join(process.cwd(), 'Makefile');
  if (existsSync(makefilePath)) {
    const makefile = readFileSync(makefilePath, 'utf-8');
    
    if (makefile.includes('auth_user:auth_password@localhost:5432/auth_db')) {
      throw new Error('❌ Makefile still contains hardcoded database credentials. Setup may be incomplete.');
    }
  }
  
  // Check if package names have been updated
  const webPackagePath = join(process.cwd(), 'apps/web/package.json');
  if (existsSync(webPackagePath)) {
    const webPackage = readFileSync(webPackagePath, 'utf-8');
    
    if (webPackage.includes('@boilerplate')) {
      throw new Error('❌ Web package.json still contains @boilerplate references. Setup may be incomplete.');
    }
  }
  
  console.log('✅ Setup validation passed!');
  console.log('💡 TIP: If you encounter database authentication errors, try running "make db-clean" first to remove old Docker volumes.');
}

async function main() {
  try {
    const answers = await collectProjectInfo();
    
    console.log('\n🔧 Configuring your project...\n');
    
    updateProjectConfig(answers);
    updatePackageJson(answers);
    updateDockerCompose(answers);
    createEnvironmentFiles(answers);
    updateMakefile(answers);
    updateManifestJson(answers);
    updateSetupGuide(answers);
    updateVercelDeploymentGuide(answers);
    
    // NEW: Comprehensive import replacement
    replaceBoilerplateImports(answers);
    
    // Handle special files with specific boilerplate references
    handleSpecialFiles(answers);
    
    // Validate the setup
    validateSetup(answers);
    
    displaySummary(answers);
    
    console.log('\n🎉 Complete web app setup finished successfully!');
    console.log('\n🚀 NEXT STEPS:');
    console.log('1. Run `pnpm install` to install dependencies');
    console.log('2. Run `make db-up` to start the database');
    console.log('3. Run `make dev` to start the web application');
    console.log(`4. Open http://localhost:${answers.webPort} in your browser`);
    console.log('5. Create your first account and start building!');
    console.log('');
    console.log('💡 OPTIONAL:');
    console.log('- Delete this setup script: rm scripts/setup-project.ts');
    console.log('- Commit your initial configuration: git add . && git commit -m "Initial web app setup"');
    console.log('');
    console.log('📚 For more details, check the updated SETUP.md file.');
    console.log('');
    console.log('🔒 SECURITY NOTE:');
    console.log('- The generated BETTER_AUTH_SECRET is secure and unique');
    console.log('- Database credentials are automatically generated');
    console.log('- All sensitive files are in .gitignore');
    console.log('');
    console.log('🔧 IMPORTANT FIXES APPLIED:');
    console.log('- Fixed .env file naming (.env instead of .env.local)');
    console.log('- Comprehensive @boilerplate import replacement');
    console.log('- Updated all package.json files with correct namespaces');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main();