import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Toggle, toggleVariants } from '../../src/components/toggle'

describe('Toggle', () => {
  it('renders with default variant and size', () => {
    render(<Toggle>Toggle Button</Toggle>)
    
    const toggle = screen.getByRole('button', { name: 'Toggle Button' })
    expect(toggle).toBeInTheDocument()
    expect(toggle).toHaveClass('border', 'border-input', 'bg-transparent')
    expect(toggle).toHaveClass('h-10', 'px-3', 'min-w-10')
  })

  it('renders with default variant', () => {
    render(<Toggle variant="default">Default Toggle</Toggle>)
    
    const toggle = screen.getByRole('button', { name: 'Default Toggle' })
    expect(toggle).toHaveClass('bg-transparent')
  })

  it('renders with outline variant', () => {
    render(<Toggle variant="outline">Outline Toggle</Toggle>)
    
    const toggle = screen.getByRole('button', { name: 'Outline Toggle' })
    expect(toggle).toHaveClass('border', 'border-input', 'bg-transparent')
  })

  it('renders with default size', () => {
    render(<Toggle size="default">Default Size</Toggle>)
    
    const toggle = screen.getByRole('button', { name: 'Default Size' })
    expect(toggle).toHaveClass('h-10', 'px-3', 'min-w-10')
  })

  it('renders with small size', () => {
    render(<Toggle size="sm">Small Toggle</Toggle>)
    
    const toggle = screen.getByRole('button', { name: 'Small Toggle' })
    expect(toggle).toHaveClass('h-9', 'px-2.5', 'min-w-9')
  })

  it('renders with large size', () => {
    render(<Toggle size="lg">Large Toggle</Toggle>)
    
    const toggle = screen.getByRole('button', { name: 'Large Toggle' })
    expect(toggle).toHaveClass('h-11', 'px-5', 'min-w-11')
  })

  it('applies custom className', () => {
    render(<Toggle className="custom-toggle">Test</Toggle>)
    
    const toggle = screen.getByRole('button', { name: 'Test' })
    expect(toggle).toHaveClass('custom-toggle')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<Toggle ref={ref}>Test</Toggle>)
    
    expect(ref.current).toBeInTheDocument()
  })

  it('forwards additional props', () => {
    render(<Toggle data-testid="custom-toggle" aria-label="Custom toggle">Test</Toggle>)
    
    const toggle = screen.getByTestId('custom-toggle')
    expect(toggle).toHaveAttribute('aria-label', 'Custom toggle')
  })

  it('handles pressed state', () => {
    render(<Toggle aria-pressed="true">Pressed Toggle</Toggle>)
    
    const toggle = screen.getByRole('button', { name: 'Pressed Toggle' })
    expect(toggle).toHaveAttribute('aria-pressed', 'true')
  })

  it('handles disabled state', () => {
    render(<Toggle disabled>Disabled Toggle</Toggle>)
    
    const toggle = screen.getByRole('button', { name: 'Disabled Toggle' })
    expect(toggle).toBeDisabled()
  })

  it('handles type attribute', () => {
    render(<Toggle type="submit">Submit Toggle</Toggle>)
    
    const toggle = screen.getByRole('button', { name: 'Submit Toggle' })
    expect(toggle).toHaveAttribute('type', 'submit')
  })

  it('handles value attribute', () => {
    render(<Toggle value="toggle-value">Value Toggle</Toggle>)
    
    const toggle = screen.getByRole('button', { name: 'Value Toggle' })
    expect(toggle).toHaveAttribute('value', 'toggle-value')
  })

  it('handles name attribute', () => {
    render(<Toggle name="toggle-name">Named Toggle</Toggle>)
    
    const toggle = screen.getByRole('button', { name: 'Named Toggle' })
    expect(toggle).toHaveAttribute('name', 'toggle-name')
  })

  it('handles form attribute', () => {
    render(<Toggle form="test-form">Form Toggle</Toggle>)
    
    const toggle = screen.getByRole('button', { name: 'Form Toggle' })
    expect(toggle).toHaveAttribute('form', 'test-form')
  })

  it('handles aria attributes', () => {
    render(
      <Toggle
        aria-describedby="description"
        aria-expanded="true"
        aria-controls="panel"
        aria-label="Accessible toggle"
      >
        Accessible Toggle
      </Toggle>
    )
    
    const toggle = screen.getByRole('button', { name: 'Accessible toggle' })
    expect(toggle).toHaveAttribute('aria-describedby', 'description')
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(toggle).toHaveAttribute('aria-controls', 'panel')
  })

  it('handles data attributes', () => {
    render(<Toggle data-test="test-value" data-custom="custom-value">Data Toggle</Toggle>)
    
    const toggle = screen.getByRole('button', { name: 'Data Toggle' })
    expect(toggle).toHaveAttribute('data-test', 'test-value')
    expect(toggle).toHaveAttribute('data-custom', 'custom-value')
  })

  it('handles event handlers', () => {
    const onClick = jest.fn()
    const onFocus = jest.fn()
    const onBlur = jest.fn()
    const onKeyDown = jest.fn()

    render(<Toggle onClick={onClick} onFocus={onFocus} onBlur={onBlur} onKeyDown={onKeyDown}>Event Toggle</Toggle>)

    const toggle = screen.getByRole('button')

    toggle.click()
    expect(onClick).toHaveBeenCalled()

    fireEvent.focus(toggle)
    expect(onFocus).toHaveBeenCalled()

    fireEvent.blur(toggle)
    expect(onBlur).toHaveBeenCalled()

    fireEvent.keyDown(toggle, { key: 'Enter' })
    expect(onKeyDown).toHaveBeenCalled()
  })

  it('handles style attribute', () => {
    render(<Toggle style={{ color: 'red' }}>Styled Toggle</Toggle>)
    
    const toggle = screen.getByRole('button', { name: 'Styled Toggle' })
    expect(toggle).toHaveStyle({ color: 'red' })
  })

  it('handles title attribute', () => {
    render(<Toggle title="Tooltip text">Titled Toggle</Toggle>)
    
    const toggle = screen.getByRole('button', { name: 'Titled Toggle' })
    expect(toggle).toHaveAttribute('title', 'Tooltip text')
  })

  it('handles tabIndex attribute', () => {
    render(<Toggle tabIndex={0}>Focusable Toggle</Toggle>)
    
    const toggle = screen.getByRole('button', { name: 'Focusable Toggle' })
    expect(toggle).toHaveAttribute('tabIndex', '0')
  })

  it('handles hidden attribute', () => {
    render(<Toggle hidden>Hidden Toggle</Toggle>)
    
    const toggle = screen.getByRole('button', { hidden: true })
    expect(toggle).toHaveAttribute('hidden')
  })

  it('handles multiple attributes together', () => {
    render(
      <Toggle
        variant="outline"
        size="lg"
        className="custom-class"
        data-testid="test-toggle"
        aria-label="Multiple attributes toggle"
        style={{ fontWeight: 'bold' }}
        disabled
      >
        Multiple Attributes
      </Toggle>
    )
    
    const toggle = screen.getByTestId('test-toggle')
    expect(toggle).toHaveClass('custom-class')
    expect(toggle).toHaveAttribute('aria-label', 'Multiple attributes toggle')
    expect(toggle).toHaveStyle({ fontWeight: 'bold' })
    expect(toggle).toBeDisabled()
  })

  it('renders with different content types', () => {
    render(<Toggle>Text Content</Toggle>)
    expect(screen.getByRole('button', { name: 'Text Content' })).toBeInTheDocument()

    render(<Toggle><span>HTML Content</span></Toggle>)
    expect(screen.getByRole('button', { name: 'HTML Content' })).toBeInTheDocument()
  })
})

describe('toggleVariants', () => {
  it('returns correct classes for default variant', () => {
    const classes = toggleVariants({ variant: 'default' })
    expect(classes).toContain('bg-transparent')
  })

  it('returns correct classes for outline variant', () => {
    const classes = toggleVariants({ variant: 'outline' })
    expect(classes).toContain('border')
    expect(classes).toContain('border-input')
    expect(classes).toContain('bg-transparent')
  })

  it('returns correct classes for default size', () => {
    const classes = toggleVariants({ size: 'default' })
    expect(classes).toContain('h-10')
    expect(classes).toContain('px-3')
    expect(classes).toContain('min-w-10')
  })

  it('returns correct classes for small size', () => {
    const classes = toggleVariants({ size: 'sm' })
    expect(classes).toContain('h-9')
    expect(classes).toContain('px-2.5')
    expect(classes).toContain('min-w-9')
  })

  it('returns correct classes for large size', () => {
    const classes = toggleVariants({ size: 'lg' })
    expect(classes).toContain('h-11')
    expect(classes).toContain('px-5')
    expect(classes).toContain('min-w-11')
  })

  it('returns default variant and size when none specified', () => {
    const classes = toggleVariants({})
    expect(classes).toContain('border')
    expect(classes).toContain('border-input')
    expect(classes).toContain('bg-transparent')
    expect(classes).toContain('h-10')
    expect(classes).toContain('px-3')
    expect(classes).toContain('min-w-10')
  })

  it('includes base classes for all variants', () => {
    const classes = toggleVariants({ variant: 'default', size: 'default' })
    expect(classes).toContain('inline-flex')
    expect(classes).toContain('items-center')
    expect(classes).toContain('justify-center')
    expect(classes).toContain('rounded-md')
    expect(classes).toContain('text-sm')
    expect(classes).toContain('font-medium')
    expect(classes).toContain('ring-offset-background')
    expect(classes).toContain('transition-colors')
    expect(classes).toContain('hover:bg-muted')
    expect(classes).toContain('hover:text-muted-foreground')
    expect(classes).toContain('focus-visible:outline-none')
    expect(classes).toContain('focus-visible:ring-2')
    expect(classes).toContain('focus-visible:ring-ring')
    expect(classes).toContain('focus-visible:ring-offset-2')
    expect(classes).toContain('disabled:pointer-events-none')
    expect(classes).toContain('disabled:opacity-50')
    expect(classes).toContain('data-[state=on]:bg-accent')
    expect(classes).toContain('data-[state=on]:text-accent-foreground')
    expect(classes).toContain('[&_svg]:pointer-events-none')
    expect(classes).toContain('[&_svg]:size-4')
    expect(classes).toContain('[&_svg]:shrink-0')
    expect(classes).toContain('gap-2')
  })

  it('combines variant and size classes correctly', () => {
    const classes = toggleVariants({ variant: 'outline', size: 'lg' })
    expect(classes).toContain('border')
    expect(classes).toContain('border-input')
    expect(classes).toContain('bg-transparent')
    expect(classes).toContain('h-11')
    expect(classes).toContain('px-5')
    expect(classes).toContain('min-w-11')
  })
})