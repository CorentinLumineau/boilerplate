import { describe, it, expect } from '@jest/globals'
import fs from 'fs'
import path from 'path'

describe('Config Package', () => {
  const configDir = path.join(__dirname, '..')

  describe('File Structure', () => {
    it('should have required configuration files', () => {
      const requiredFiles = [
        'eslint-config.js',
        'tailwind.config.js',
        'postcss.config.mjs',
        'prettier.config.json',
        'tsconfig.json',
        'components.json',
        'next.config.mjs',
        'vercel.json'
      ]

      requiredFiles.forEach(file => {
        const filePath = path.join(configDir, file)
        expect(fs.existsSync(filePath)).toBe(true)
      })
    })

    it('should have valid JSON files', () => {
      const jsonFiles = [
        'prettier.config.json',
        'tsconfig.json',
        'components.json',
        'vercel.json'
      ]

      jsonFiles.forEach(file => {
        const filePath = path.join(configDir, file)
        const content = fs.readFileSync(filePath, 'utf-8')
        expect(() => JSON.parse(content)).not.toThrow()
      })
    })

    it('should have valid TypeScript config', () => {
      const tsConfigPath = path.join(configDir, 'tsconfig.json')
      const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf-8'))
      
      expect(tsConfig).toHaveProperty('compilerOptions')
      expect(tsConfig.compilerOptions).toHaveProperty('target')
      expect(tsConfig.compilerOptions).toHaveProperty('lib')
      expect(tsConfig.compilerOptions).toHaveProperty('strict')
    })

    it('should have valid ESLint config', () => {
      const eslintConfigPath = path.join(configDir, 'eslint-config.js')
      expect(fs.existsSync(eslintConfigPath)).toBe(true)
      
      // Check if it's a valid JavaScript file
      const content = fs.readFileSync(eslintConfigPath, 'utf-8')
      expect(content).toContain('module.exports')
    })

    it('should have valid Tailwind config', () => {
      const tailwindConfigPath = path.join(configDir, 'tailwind.config.js')
      expect(fs.existsSync(tailwindConfigPath)).toBe(true)
      
      const content = fs.readFileSync(tailwindConfigPath, 'utf-8')
      expect(content).toContain('module.exports')
    })

    it('should have valid PostCSS config', () => {
      const postcssConfigPath = path.join(configDir, 'postcss.config.mjs')
      expect(fs.existsSync(postcssConfigPath)).toBe(true)
      
      const content = fs.readFileSync(postcssConfigPath, 'utf-8')
      expect(content).toContain('export default')
    })

    it('should have valid Next.js config', () => {
      const nextConfigPath = path.join(configDir, 'next.config.mjs')
      expect(fs.existsSync(nextConfigPath)).toBe(true)
      
      const content = fs.readFileSync(nextConfigPath, 'utf-8')
      expect(content).toContain('export default')
    })
  })

  describe('Configuration Validation', () => {
    it('should have proper TypeScript configuration', () => {
      const tsConfigPath = path.join(configDir, 'tsconfig.json')
      const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf-8'))
      
      const requiredOptions = [
        'target', 'lib', 'allowJs', 'skipLibCheck', 'strict',
        'forceConsistentCasingInFileNames', 'noEmit', 'esModuleInterop',
        'module', 'moduleResolution', 'resolveJsonModule', 'isolatedModules',
        'jsx', 'incremental', 'plugins'
      ]

      requiredOptions.forEach(option => {
        expect(tsConfig.compilerOptions).toHaveProperty(option)
      })
    })

    it('should have proper Prettier configuration', () => {
      const prettierConfigPath = path.join(configDir, 'prettier.config.json')
      const prettierConfig = JSON.parse(fs.readFileSync(prettierConfigPath, 'utf-8'))
      
      expect(prettierConfig).toHaveProperty('semi')
      expect(prettierConfig).toHaveProperty('singleQuote')
      expect(prettierConfig).toHaveProperty('tabWidth')
      expect(prettierConfig).toHaveProperty('trailingComma')
    })

    it('should have proper Vercel configuration', () => {
      const vercelConfigPath = path.join(configDir, 'vercel.json')
      const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf-8'))
      
      expect(vercelConfig).toHaveProperty('buildCommand')
      expect(vercelConfig).toHaveProperty('outputDirectory')
      expect(vercelConfig).toHaveProperty('installCommand')
    })
  })

  describe('Package Configuration', () => {
    it('should have correct package name', () => {
      const packageJsonPath = path.join(configDir, 'package.json')
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
      
      expect(packageJson.name).toBe('@boilerplate/config')
      expect(packageJson.private).toBe(true)
    })

    it('should have required dependencies', () => {
      const packageJsonPath = path.join(configDir, 'package.json')
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
      
      const requiredDeps = [
        '@typescript-eslint/eslint-plugin',
        '@typescript-eslint/parser',
        'eslint',
        'eslint-config-next',
        'tailwindcss',
        'typescript'
      ]

      requiredDeps.forEach(dep => {
        expect(packageJson.dependencies).toHaveProperty(dep)
      })
    })
  })
})