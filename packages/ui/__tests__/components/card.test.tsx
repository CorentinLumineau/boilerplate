import React from 'react'
import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from '../../src/components/card'

describe('Card', () => {
  it('renders with default styling', () => {
    render(<Card>Card content</Card>)
    
    const card = screen.getByText('Card content')
    expect(card).toBeInTheDocument()
    expect(card).toHaveClass('rounded-lg', 'border', 'bg-card', 'text-card-foreground', 'shadow-sm')
  })

  it('applies custom className', () => {
    render(<Card className="custom-card">Test</Card>)
    
    const card = screen.getByText('Test')
    expect(card).toHaveClass('custom-card')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<Card ref={ref}>Test</Card>)
    
    expect(ref.current).toBeInTheDocument()
  })

  it('forwards additional props', () => {
    render(<Card data-testid="custom-card" aria-label="Custom card">Test</Card>)
    
    const card = screen.getByTestId('custom-card')
    expect(card).toHaveAttribute('aria-label', 'Custom card')
  })
})

describe('CardHeader', () => {
  it('renders with default styling', () => {
    render(<CardHeader>Header content</CardHeader>)
    
    const header = screen.getByText('Header content')
    expect(header).toBeInTheDocument()
    expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6')
  })

  it('applies custom className', () => {
    render(<CardHeader className="custom-header">Test</CardHeader>)
    
    const header = screen.getByText('Test')
    expect(header).toHaveClass('custom-header')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<CardHeader ref={ref}>Test</CardHeader>)
    
    expect(ref.current).toBeInTheDocument()
  })

  it('forwards additional props', () => {
    render(<CardHeader data-testid="custom-header" aria-label="Custom header">Test</CardHeader>)
    
    const header = screen.getByTestId('custom-header')
    expect(header).toHaveAttribute('aria-label', 'Custom header')
  })
})

describe('CardTitle', () => {
  it('renders with default styling', () => {
    render(<CardTitle>Card Title</CardTitle>)
    
    const title = screen.getByText('Card Title')
    expect(title).toBeInTheDocument()
    expect(title).toHaveClass('text-2xl', 'font-semibold', 'leading-none', 'tracking-tight')
  })

  it('applies custom className', () => {
    render(<CardTitle className="custom-title">Test</CardTitle>)
    
    const title = screen.getByText('Test')
    expect(title).toHaveClass('custom-title')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<CardTitle ref={ref}>Test</CardTitle>)
    
    expect(ref.current).toBeInTheDocument()
  })

  it('forwards additional props', () => {
    render(<CardTitle data-testid="custom-title" aria-label="Custom title">Test</CardTitle>)
    
    const title = screen.getByTestId('custom-title')
    expect(title).toHaveAttribute('aria-label', 'Custom title')
  })
})

describe('CardDescription', () => {
  it('renders with default styling', () => {
    render(<CardDescription>Card description</CardDescription>)
    
    const description = screen.getByText('Card description')
    expect(description).toBeInTheDocument()
    expect(description).toHaveClass('text-sm', 'text-muted-foreground')
  })

  it('applies custom className', () => {
    render(<CardDescription className="custom-description">Test</CardDescription>)
    
    const description = screen.getByText('Test')
    expect(description).toHaveClass('custom-description')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<CardDescription ref={ref}>Test</CardDescription>)
    
    expect(ref.current).toBeInTheDocument()
  })

  it('forwards additional props', () => {
    render(<CardDescription data-testid="custom-desc" aria-label="Custom description">Test</CardDescription>)
    
    const description = screen.getByTestId('custom-desc')
    expect(description).toHaveAttribute('aria-label', 'Custom description')
  })
})

describe('CardContent', () => {
  it('renders with default styling', () => {
    render(<CardContent>Content text</CardContent>)
    
    const content = screen.getByText('Content text')
    expect(content).toBeInTheDocument()
    expect(content).toHaveClass('p-6', 'pt-0')
  })

  it('applies custom className', () => {
    render(<CardContent className="custom-content">Test</CardContent>)
    
    const content = screen.getByText('Test')
    expect(content).toHaveClass('custom-content')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<CardContent ref={ref}>Test</CardContent>)
    
    expect(ref.current).toBeInTheDocument()
  })

  it('forwards additional props', () => {
    render(<CardContent data-testid="custom-content" aria-label="Custom content">Test</CardContent>)
    
    const content = screen.getByTestId('custom-content')
    expect(content).toHaveAttribute('aria-label', 'Custom content')
  })
})

describe('CardFooter', () => {
  it('renders with default styling', () => {
    render(<CardFooter>Footer content</CardFooter>)
    
    const footer = screen.getByText('Footer content')
    expect(footer).toBeInTheDocument()
    expect(footer).toHaveClass('flex', 'items-center', 'p-6', 'pt-0')
  })

  it('applies custom className', () => {
    render(<CardFooter className="custom-footer">Test</CardFooter>)
    
    const footer = screen.getByText('Test')
    expect(footer).toHaveClass('custom-footer')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<CardFooter ref={ref}>Test</CardFooter>)
    
    expect(ref.current).toBeInTheDocument()
  })

  it('forwards additional props', () => {
    render(<CardFooter data-testid="custom-footer" aria-label="Custom footer">Test</CardFooter>)
    
    const footer = screen.getByTestId('custom-footer')
    expect(footer).toHaveAttribute('aria-label', 'Custom footer')
  })
})

describe('Card composition', () => {
  it('renders complete card with all components', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>Main content goes here</CardContent>
        <CardFooter>Footer actions</CardFooter>
      </Card>
    )
    
    expect(screen.getByText('Card Title')).toBeInTheDocument()
    expect(screen.getByText('Card Description')).toBeInTheDocument()
    expect(screen.getByText('Main content goes here')).toBeInTheDocument()
    expect(screen.getByText('Footer actions')).toBeInTheDocument()
  })

  it('renders card with only header and content', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Simple Card</CardTitle>
        </CardHeader>
        <CardContent>Content only</CardContent>
      </Card>
    )
    
    expect(screen.getByText('Simple Card')).toBeInTheDocument()
    expect(screen.getByText('Content only')).toBeInTheDocument()
  })

  it('renders card with only content', () => {
    render(
      <Card>
        <CardContent>Minimal card</CardContent>
      </Card>
    )
    
    expect(screen.getByText('Minimal card')).toBeInTheDocument()
  })

  it('renders card with only header', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Header Only</CardTitle>
        </CardHeader>
      </Card>
    )
    
    expect(screen.getByText('Header Only')).toBeInTheDocument()
  })

  it('renders card with only footer', () => {
    render(
      <Card>
        <CardFooter>Footer Only</CardFooter>
      </Card>
    )
    
    expect(screen.getByText('Footer Only')).toBeInTheDocument()
  })
})