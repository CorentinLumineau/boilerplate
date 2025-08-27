import React from 'react'
import { render, screen } from '@testing-library/react'
import { Badge, badgeVariants } from '../../src/components/badge'

describe('Badge', () => {
  it('renders with default variant', () => {
    render(<Badge>Default Badge</Badge>)
    
    const badge = screen.getByText('Default Badge')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('border-transparent', 'bg-primary', 'text-primary-foreground')
  })

  it('renders with secondary variant', () => {
    render(<Badge variant="secondary">Secondary Badge</Badge>)
    
    const badge = screen.getByText('Secondary Badge')
    expect(badge).toHaveClass('border-transparent', 'bg-secondary', 'text-secondary-foreground')
  })

  it('renders with destructive variant', () => {
    render(<Badge variant="destructive">Destructive Badge</Badge>)
    
    const badge = screen.getByText('Destructive Badge')
    expect(badge).toHaveClass('border-transparent', 'bg-red-500', 'text-white')
  })

  it('renders with outline variant', () => {
    render(<Badge variant="outline">Outline Badge</Badge>)
    
    const badge = screen.getByText('Outline Badge')
    expect(badge).toHaveClass('text-foreground')
  })

  it('applies custom className', () => {
    render(<Badge className="custom-badge">Test</Badge>)
    
    const badge = screen.getByText('Test')
    expect(badge).toHaveClass('custom-badge')
  })

  it('forwards additional props', () => {
    render(<Badge data-testid="custom-badge" aria-label="Custom badge">Test</Badge>)
    
    const badge = screen.getByTestId('custom-badge')
    expect(badge).toHaveAttribute('aria-label', 'Custom badge')
  })

  it('renders with different content types', () => {
    render(<Badge>Text Content</Badge>)
    expect(screen.getByText('Text Content')).toBeInTheDocument()

    render(<Badge><span>HTML Content</span></Badge>)
    expect(screen.getByText('HTML Content')).toBeInTheDocument()
  })
})

describe('badgeVariants', () => {
  it('returns correct classes for default variant', () => {
    const classes = badgeVariants({ variant: 'default' })
    expect(classes).toContain('border-transparent')
    expect(classes).toContain('bg-primary')
    expect(classes).toContain('text-primary-foreground')
  })

  it('returns correct classes for secondary variant', () => {
    const classes = badgeVariants({ variant: 'secondary' })
    expect(classes).toContain('border-transparent')
    expect(classes).toContain('bg-secondary')
    expect(classes).toContain('text-secondary-foreground')
  })

  it('returns correct classes for destructive variant', () => {
    const classes = badgeVariants({ variant: 'destructive' })
    expect(classes).toContain('border-transparent')
    expect(classes).toContain('bg-red-500')
    expect(classes).toContain('text-white')
  })

  it('returns correct classes for outline variant', () => {
    const classes = badgeVariants({ variant: 'outline' })
    expect(classes).toContain('text-foreground')
  })

  it('returns default classes when no variant specified', () => {
    const classes = badgeVariants({})
    expect(classes).toContain('border-transparent')
    expect(classes).toContain('bg-primary')
    expect(classes).toContain('text-primary-foreground')
  })

  it('includes base classes for all variants', () => {
    const classes = badgeVariants({ variant: 'default' })
    expect(classes).toContain('inline-flex')
    expect(classes).toContain('items-center')
    expect(classes).toContain('rounded-full')
    expect(classes).toContain('border')
    expect(classes).toContain('px-2.5')
    expect(classes).toContain('py-0.5')
    expect(classes).toContain('text-xs')
    expect(classes).toContain('font-semibold')
    expect(classes).toContain('transition-colors')
    expect(classes).toContain('focus:outline-none')
    expect(classes).toContain('focus:ring-2')
    expect(classes).toContain('focus:ring-ring')
    expect(classes).toContain('focus:ring-offset-2')
  })
})