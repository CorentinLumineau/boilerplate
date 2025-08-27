import React from 'react'
import { render, screen } from '@testing-library/react'
import { Button, buttonVariants } from '../../src/components/button'

describe('Button', () => {
  it('renders with default variant and size', () => {
    render(<Button>Click me</Button>)
    
    const button = screen.getByRole('button', { name: 'Click me' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('border', 'border-input', 'bg-background')
    expect(button).toHaveClass('h-10', 'px-4', 'py-2')
  })

  it('renders with default variant', () => {
    render(<Button variant="default">Default Button</Button>)
    
    const button = screen.getByRole('button', { name: 'Default Button' })
    expect(button).toHaveClass('bg-primary', 'text-primary-foreground')
  })

  it('renders with destructive variant', () => {
    render(<Button variant="destructive">Destructive Button</Button>)
    
    const button = screen.getByRole('button', { name: 'Destructive Button' })
    expect(button).toHaveClass('bg-red-500', 'text-white')
  })

  it('renders with outline variant', () => {
    render(<Button variant="outline">Outline Button</Button>)
    
    const button = screen.getByRole('button', { name: 'Outline Button' })
    expect(button).toHaveClass('border', 'border-input', 'bg-background')
  })

  it('renders with secondary variant', () => {
    render(<Button variant="secondary">Secondary Button</Button>)
    
    const button = screen.getByRole('button', { name: 'Secondary Button' })
    expect(button).toHaveClass('bg-secondary', 'text-secondary-foreground')
  })

  it('renders with ghost variant', () => {
    render(<Button variant="ghost">Ghost Button</Button>)
    
    const button = screen.getByRole('button', { name: 'Ghost Button' })
    expect(button).toHaveClass('hover:bg-accent', 'hover:text-accent-foreground')
  })

  it('renders with link variant', () => {
    render(<Button variant="link">Link Button</Button>)
    
    const button = screen.getByRole('button', { name: 'Link Button' })
    expect(button).toHaveClass('text-primary', 'underline-offset-4')
  })

  it('renders with default size', () => {
    render(<Button size="default">Default Size</Button>)
    
    const button = screen.getByRole('button', { name: 'Default Size' })
    expect(button).toHaveClass('h-10', 'px-4', 'py-2')
  })

  it('renders with small size', () => {
    render(<Button size="sm">Small Button</Button>)
    
    const button = screen.getByRole('button', { name: 'Small Button' })
    expect(button).toHaveClass('h-9', 'rounded-md', 'px-3')
  })

  it('renders with large size', () => {
    render(<Button size="lg">Large Button</Button>)
    
    const button = screen.getByRole('button', { name: 'Large Button' })
    expect(button).toHaveClass('h-11', 'rounded-md', 'px-8')
  })

  it('renders with icon size', () => {
    render(<Button size="icon">Icon Button</Button>)
    
    const button = screen.getByRole('button', { name: 'Icon Button' })
    expect(button).toHaveClass('h-10', 'w-10')
  })

  it('applies custom className', () => {
    render(<Button className="custom-button">Test</Button>)
    
    const button = screen.getByRole('button', { name: 'Test' })
    expect(button).toHaveClass('custom-button')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<Button ref={ref}>Test</Button>)
    
    expect(ref.current).toBeInTheDocument()
  })

  it('forwards additional props', () => {
    render(<Button data-testid="custom-button" aria-label="Custom button">Test</Button>)
    
    const button = screen.getByTestId('custom-button')
    expect(button).toHaveAttribute('aria-label', 'Custom button')
  })

  it('renders as child when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    )
    
    const link = screen.getByRole('link', { name: 'Link Button' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/test')
    expect(link).toHaveClass('border', 'border-input', 'bg-background')
  })

  it('handles disabled state', () => {
    render(<Button disabled>Disabled Button</Button>)
    
    const button = screen.getByRole('button', { name: 'Disabled Button' })
    expect(button).toBeDisabled()
    expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50')
  })

  it('handles type attribute', () => {
    render(<Button type="submit">Submit Button</Button>)
    
    const button = screen.getByRole('button', { name: 'Submit Button' })
    expect(button).toHaveAttribute('type', 'submit')
  })
})

describe('buttonVariants', () => {
  it('returns correct classes for default variant', () => {
    const classes = buttonVariants({ variant: 'default' })
    expect(classes).toContain('bg-primary')
    expect(classes).toContain('text-primary-foreground')
    expect(classes).toContain('hover:bg-primary/90')
  })

  it('returns correct classes for destructive variant', () => {
    const classes = buttonVariants({ variant: 'destructive' })
    expect(classes).toContain('bg-red-500')
    expect(classes).toContain('text-white')
    expect(classes).toContain('hover:bg-red-600')
  })

  it('returns correct classes for outline variant', () => {
    const classes = buttonVariants({ variant: 'outline' })
    expect(classes).toContain('border')
    expect(classes).toContain('border-input')
    expect(classes).toContain('bg-background')
  })

  it('returns correct classes for secondary variant', () => {
    const classes = buttonVariants({ variant: 'secondary' })
    expect(classes).toContain('bg-secondary')
    expect(classes).toContain('text-secondary-foreground')
    expect(classes).toContain('hover:bg-secondary/80')
  })

  it('returns correct classes for ghost variant', () => {
    const classes = buttonVariants({ variant: 'ghost' })
    expect(classes).toContain('hover:bg-accent')
    expect(classes).toContain('hover:text-accent-foreground')
  })

  it('returns correct classes for link variant', () => {
    const classes = buttonVariants({ variant: 'link' })
    expect(classes).toContain('text-primary')
    expect(classes).toContain('underline-offset-4')
    expect(classes).toContain('hover:underline')
  })

  it('returns correct classes for default size', () => {
    const classes = buttonVariants({ size: 'default' })
    expect(classes).toContain('h-10')
    expect(classes).toContain('px-4')
    expect(classes).toContain('py-2')
  })

  it('returns correct classes for small size', () => {
    const classes = buttonVariants({ size: 'sm' })
    expect(classes).toContain('h-9')
    expect(classes).toContain('rounded-md')
    expect(classes).toContain('px-3')
  })

  it('returns correct classes for large size', () => {
    const classes = buttonVariants({ size: 'lg' })
    expect(classes).toContain('h-11')
    expect(classes).toContain('rounded-md')
    expect(classes).toContain('px-8')
  })

  it('returns correct classes for icon size', () => {
    const classes = buttonVariants({ size: 'icon' })
    expect(classes).toContain('h-10')
    expect(classes).toContain('w-10')
  })

  it('returns default variant and size when none specified', () => {
    const classes = buttonVariants({})
    expect(classes).toContain('border')
    expect(classes).toContain('border-input')
    expect(classes).toContain('bg-background')
    expect(classes).toContain('h-10')
    expect(classes).toContain('px-4')
    expect(classes).toContain('py-2')
  })

  it('includes base classes for all variants', () => {
    const classes = buttonVariants({ variant: 'default', size: 'default' })
    expect(classes).toContain('inline-flex')
    expect(classes).toContain('items-center')
    expect(classes).toContain('justify-center')
    expect(classes).toContain('gap-2')
    expect(classes).toContain('whitespace-nowrap')
    expect(classes).toContain('rounded-md')
    expect(classes).toContain('text-sm')
    expect(classes).toContain('font-medium')
    expect(classes).toContain('ring-offset-background')
    expect(classes).toContain('transition-colors')
    expect(classes).toContain('focus-visible:outline-none')
    expect(classes).toContain('focus-visible:ring-2')
    expect(classes).toContain('focus-visible:ring-ring')
    expect(classes).toContain('focus-visible:ring-offset-2')
    expect(classes).toContain('disabled:pointer-events-none')
    expect(classes).toContain('disabled:opacity-50')
  })

  it('combines variant and size classes correctly', () => {
    const classes = buttonVariants({ variant: 'destructive', size: 'lg' })
    expect(classes).toContain('bg-red-500')
    expect(classes).toContain('text-white')
    expect(classes).toContain('hover:bg-red-600')
    expect(classes).toContain('h-11')
    expect(classes).toContain('rounded-md')
    expect(classes).toContain('px-8')
  })
})