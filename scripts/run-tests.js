#!/usr/bin/env node

/**
 * Comprehensive Test Runner for Turborepo
 * Runs tests across all packages with proper reporting and coverage
 */

const { execSync, spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
}

// Test configuration
const config = {
  packages: [
    'packages/config',
    'packages/types',
    'apps/web'
  ],
  testCommands: {
    'packages/config': 'npm test',
    'packages/types': 'npm test',
    'apps/web': 'npm test'
  },
  coverageThreshold: {
    statements: 80,
    branches: 80,
    functions: 80,
    lines: 80
  }
}

// Utility functions
function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logHeader(message) {
  log(`\n${'='.repeat(60)}`, 'cyan')
  log(`  ${message}`, 'bright')
  log(`${'='.repeat(60)}`, 'cyan')
}

function logSection(message) {
  log(`\n${'-'.repeat(40)}`, 'blue')
  log(`  ${message}`, 'blue')
  log(`${'-'.repeat(40)}`, 'blue')
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green')
}

function logError(message) {
  log(`❌ ${message}`, 'red')
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow')
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'cyan')
}

// Check if package has tests
function hasTests(packagePath) {
  const testDir = path.join(packagePath, '__tests__')
  const testFiles = fs.existsSync(testDir) && fs.readdirSync(testDir).length > 0
  
  const packageJson = path.join(packagePath, 'package.json')
  const hasTestScript = fs.existsSync(packageJson) && 
    JSON.parse(fs.readFileSync(packageJson, 'utf-8')).scripts?.test
  
  return testFiles || hasTestScript
}

// Run tests for a single package
function runPackageTests(packagePath, packageName) {
  return new Promise((resolve, reject) => {
    logSection(`Running tests for ${packageName}`)
    
    if (!hasTests(packagePath)) {
      logWarning(`No tests found for ${packageName}`)
      resolve({ package: packageName, success: true, skipped: true })
      return
    }

    const testCommand = config.testCommands[packagePath] || 'npm test'
    logInfo(`Command: ${testCommand}`)
    
    const child = spawn(testCommand, [], {
      cwd: packagePath,
      shell: true,
      stdio: 'pipe'
    })

    let stdout = ''
    let stderr = ''

    child.stdout.on('data', (data) => {
      stdout += data.toString()
      process.stdout.write(data)
    })

    child.stderr.on('data', (data) => {
      stderr += data.toString()
      process.stderr.write(data)
    })

    child.on('close', (code) => {
      if (code === 0) {
        logSuccess(`Tests passed for ${packageName}`)
        resolve({ package: packageName, success: true, skipped: false })
      } else {
        logError(`Tests failed for ${packageName} (exit code: ${code})`)
        reject({ package: packageName, success: false, error: stderr, exitCode: code })
      }
    })

    child.on('error', (error) => {
      logError(`Failed to run tests for ${packageName}: ${error.message}`)
      reject({ package: packageName, success: false, error: error.message })
    })
  })
}

// Generate coverage report
function generateCoverageReport() {
  logSection('Generating Coverage Report')
  
  try {
    // Check if coverage directories exist
    const coverageDirs = config.packages
      .map(pkg => path.join(pkg, 'coverage'))
      .filter(dir => fs.existsSync(dir))
    
    if (coverageDirs.length === 0) {
      logWarning('No coverage directories found')
      return
    }

    logInfo(`Found coverage directories: ${coverageDirs.length}`)
    
    // Generate summary
    coverageDirs.forEach(dir => {
      const lcovFile = path.join(dir, 'lcov-report', 'index.html')
      if (fs.existsSync(lcovFile)) {
        logSuccess(`Coverage report available at: ${dir}/lcov-report/index.html`)
      }
    })

  } catch (error) {
    logError(`Error generating coverage report: ${error.message}`)
  }
}

// Main test runner
async function runAllTests() {
  logHeader('TURBOREPO TEST RUNNER')
  logInfo(`Running tests across ${config.packages.length} packages`)
  
  const startTime = Date.now()
  const results = []
  let passed = 0
  let failed = 0
  let skipped = 0

  try {
    // Run tests for each package
    for (const packagePath of config.packages) {
      const packageName = path.basename(packagePath)
      
      try {
        const result = await runPackageTests(packagePath, packageName)
        results.push(result)
        
        if (result.skipped) {
          skipped++
        } else if (result.success) {
          passed++
        } else {
          failed++
        }
      } catch (error) {
        results.push(error)
        failed++
      }
    }

    // Generate coverage report
    generateCoverageReport()

    // Print summary
    const endTime = Date.now()
    const duration = ((endTime - startTime) / 1000).toFixed(2)
    
    logHeader('TEST RESULTS SUMMARY')
    logSuccess(`Passed: ${passed}`)
    logWarning(`Skipped: ${skipped}`)
    if (failed > 0) {
      logError(`Failed: ${failed}`)
    } else {
      logSuccess(`Failed: ${failed}`)
    }
    logInfo(`Duration: ${duration}s`)
    
    // Exit with appropriate code
    if (failed > 0) {
      logError('\nSome tests failed. Please check the output above.')
      process.exit(1)
    } else {
      logSuccess('\nAll tests passed successfully! 🎉')
      process.exit(0)
    }

  } catch (error) {
    logError(`Test runner failed: ${error.message}`)
    process.exit(1)
  }
}

// Handle command line arguments
const args = process.argv.slice(2)
const command = args[0]

switch (command) {
  case '--help':
  case '-h':
    console.log(`
Turborepo Test Runner

Usage:
  node scripts/run-tests.js [command]

Commands:
  --help, -h     Show this help message
  --watch        Run tests in watch mode
  --coverage     Run tests with coverage
  --ci           Run tests for CI environment

Examples:
  node scripts/run-tests.js
  node scripts/run-tests.js --coverage
  node scripts/run-tests.js --ci
`)
    process.exit(0)
    break
    
  case '--watch':
    logInfo('Watch mode not implemented yet. Use individual package watch commands.')
    process.exit(0)
    break
    
  case '--coverage':
    logInfo('Coverage mode - will generate coverage reports')
    break
    
  case '--ci':
    logInfo('CI mode - will run tests with CI-specific settings')
    break
    
  default:
    if (command) {
      logWarning(`Unknown command: ${command}`)
    }
    break
}

// Run the tests
runAllTests().catch(error => {
  logError(`Test runner failed: ${error.message}`)
  process.exit(1)
})