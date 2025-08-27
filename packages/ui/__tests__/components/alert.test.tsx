import React from 'react'
import { render, screen } from '@testing-library/react'
import { Alert, AlertTitle, AlertDescription } from '../../src/components/alert'

describe('Alert', () => {
  it('renders with default variant', () => {
    render(<Alert>Test alert content</Alert>)
    
    const alert = screen.getByRole('alert')
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveTextContent('Test alert content')
    expect(alert).toHaveClass('bg-background', 'text-foreground')
  })

  it('renders with destructive variant', () => {
    render(<Alert variant="destructive">Destructive alert</Alert>)
    
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('border-red-500/50', 'text-red-500')
  })

  it('applies custom className', () => {
    render(<Alert className="custom-class">Test</Alert>)
    
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<Alert ref={ref}>Test</Alert>)
    
    expect(ref.current).toBeInTheDocument()
  })

  it('forwards additional props', () => {
    render(<Alert data-testid="custom-alert" aria-label="Custom alert">Test</Alert>)
    
    const alert = screen.getByTestId('custom-alert')
    expect(alert).toHaveAttribute('aria-label', 'Custom alert')
  })
})

describe('AlertTitle', () => {
  it('renders with default styling', () => {
    render(<AlertTitle>Alert Title</AlertTitle>)
    
    const title = screen.getByText('Alert Title')
    expect(title).toBeInTheDocument()
    expect(title.tagName).toBe('H5')
    expect(title).toHaveClass('mb-1', 'font-medium', 'leading-none', 'tracking-tight')
  })

  it('applies custom className', () => {
    render(<AlertTitle className="custom-title">Test</AlertTitle>)
    
    const title = screen.getByText('Test')
    expect(title).toHaveClass('custom-title')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLHeadingElement>()
    render(<AlertTitle ref={ref}>Test</AlertTitle>)
    
    expect(ref.current).toBeInTheDocument()
  })

  it('forwards additional props', () => {
    render(<AlertTitle data-testid="custom-title" aria-label="Custom title">Test</AlertTitle>)
    
    const title = screen.getByTestId('custom-title')
    expect(title).toHaveAttribute('aria-label', 'Custom title')
  })
})

describe('AlertDescription', () => {
  it('renders with default styling', () => {
    render(<AlertDescription>Alert description text</AlertDescription>)
    
    const description = screen.getByText('Alert description text')
    expect(description).toBeInTheDocument()
    expect(description.tagName).toBe('DIV')
    expect(description).toHaveClass('text-sm', '[&_p]:leading-relaxed')
  })

  it('applies custom className', () => {
    render(<AlertDescription className="custom-description">Test</AlertDescription>)
    
    const description = screen.getByText('Test')
    expect(description).toHaveClass('custom-description')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<AlertDescription ref={ref}>Test</AlertDescription>)
    
    expect(ref.current).toBeInTheDocument()
  })

  it('forwards additional props', () => {
    render(<AlertDescription data-testid="custom-desc" aria-label="Custom description">Test</AlertDescription>)
    
    const description = screen.getByTestId('custom-desc')
    expect(description).toHaveAttribute('aria-label', 'Custom description')
  })
})

describe('Alert composition', () => {
  it('renders complete alert with title and description', () => {
    render(
      <Alert>
        <AlertTitle>Important Notice</AlertTitle>
        <AlertDescription>This is a detailed description of the alert.</AlertDescription>
      </Alert>
    )
    
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Important Notice')).toBeInTheDocument()
    expect(screen.getByText('This is a detailed description of the alert.')).toBeInTheDocument()
  })

  it('renders alert with only title', () => {
    render(
      <Alert>
        <AlertTitle>Title Only</AlertTitle>
      </Alert>
    )
    
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Title Only')).toBeInTheDocument()
  })

  it('renders alert with only description', () => {
    render(
      <Alert>
        <AlertDescription>Description Only</AlertDescription>
      </Alert>
    )
    
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Description Only')).toBeInTheDocument()
  })
})