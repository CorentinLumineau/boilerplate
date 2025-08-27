import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from '../../src/components/input'

describe('Input', () => {
  it('renders with default styling', () => {
    render(<Input placeholder="Enter text" />)
    
    const input = screen.getByPlaceholderText('Enter text')
    expect(input).toBeInTheDocument()
    expect(input).toHaveClass('flex', 'h-10', 'w-full', 'rounded-md', 'border', 'border-input', 'bg-background', 'px-3', 'py-2', 'text-base')
  })

  it('renders with different types', () => {
    const { rerender } = render(<Input type="text" placeholder="Text input" />)
    expect(screen.getByPlaceholderText('Text input')).toHaveAttribute('type', 'text')

    rerender(<Input type="email" placeholder="Email input" />)
    expect(screen.getByPlaceholderText('Email input')).toHaveAttribute('type', 'email')

    rerender(<Input type="password" placeholder="Password input" />)
    expect(screen.getByPlaceholderText('Password input')).toHaveAttribute('type', 'password')

    rerender(<Input type="number" placeholder="Number input" />)
    expect(screen.getByPlaceholderText('Number input')).toHaveAttribute('type', 'number')
  })

  it('applies custom className', () => {
    render(<Input className="custom-input" placeholder="Test" />)
    
    const input = screen.getByPlaceholderText('Test')
    expect(input).toHaveClass('custom-input')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>()
    render(<Input ref={ref} placeholder="Test" />)
    
    expect(ref.current).toBeInTheDocument()
  })

  it('forwards additional props', () => {
    render(<Input data-testid="custom-input" aria-label="Custom input" placeholder="Test" />)
    
    const input = screen.getByTestId('custom-input')
    expect(input).toHaveAttribute('aria-label', 'Custom input')
  })

  it('handles value prop', () => {
    render(<Input value="test value" onChange={() => {}} />)
    
    const input = screen.getByDisplayValue('test value')
    expect(input).toBeInTheDocument()
  })

  it('handles defaultValue prop', () => {
    render(<Input defaultValue="default value" />)
    
    const input = screen.getByDisplayValue('default value')
    expect(input).toBeInTheDocument()
  })

  it('handles disabled state', () => {
    render(<Input disabled placeholder="Disabled input" />)
    
    const input = screen.getByPlaceholderText('Disabled input')
    expect(input).toBeDisabled()
  })

  it('handles required state', () => {
    render(<Input required placeholder="Required input" />)
    
    const input = screen.getByPlaceholderText('Required input')
    expect(input).toBeRequired()
  })

  it('handles name attribute', () => {
    render(<Input name="test-input" placeholder="Named input" />)
    
    const input = screen.getByPlaceholderText('Named input')
    expect(input).toHaveAttribute('name', 'test-input')
  })

  it('handles id attribute', () => {
    render(<Input id="test-id" placeholder="ID input" />)
    
    const input = screen.getByPlaceholderText('ID input')
    expect(input).toHaveAttribute('id', 'test-id')
  })

  it('handles placeholder attribute', () => {
    render(<Input placeholder="Custom placeholder" />)
    
    const input = screen.getByPlaceholderText('Custom placeholder')
    expect(input).toBeInTheDocument()
  })

  it('handles aria attributes', () => {
    render(<Input aria-describedby="description" aria-invalid="true" placeholder="Accessible input" />)
    
    const input = screen.getByPlaceholderText('Accessible input')
    expect(input).toHaveAttribute('aria-describedby', 'description')
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('handles form attributes', () => {
    render(<Input form="test-form" placeholder="Form input" />)
    
    const input = screen.getByPlaceholderText('Form input')
    expect(input).toHaveAttribute('form', 'test-form')
  })

  it('handles pattern attribute', () => {
    render(<Input pattern="[A-Za-z]{3}" placeholder="Pattern input" />)
    
    const input = screen.getByPlaceholderText('Pattern input')
    expect(input).toHaveAttribute('pattern', '[A-Za-z]{3}')
  })

  it('handles min and max attributes for number inputs', () => {
    render(<Input type="number" min="0" max="100" placeholder="Number range input" />)
    
    const input = screen.getByPlaceholderText('Number range input')
    expect(input).toHaveAttribute('min', '0')
    expect(input).toHaveAttribute('max', '100')
  })

  it('handles step attribute for number inputs', () => {
    render(<Input type="number" step="0.1" placeholder="Step input" />)
    
    const input = screen.getByPlaceholderText('Step input')
    expect(input).toHaveAttribute('step', '0.1')
  })

  it('handles autocomplete attribute', () => {
    render(<Input autoComplete="email" placeholder="Autocomplete input" />)
    
    const input = screen.getByPlaceholderText('Autocomplete input')
    expect(input).toHaveAttribute('autocomplete', 'email')
  })

  it('handles readonly state', () => {
    render(<Input readOnly placeholder="Readonly input" />)
    
    const input = screen.getByPlaceholderText('Readonly input')
    expect(input).toHaveAttribute('readonly')
  })

  it('handles size attribute', () => {
    render(<Input size={20} placeholder="Sized input" />)
    
    const input = screen.getByPlaceholderText('Sized input')
    expect(input).toHaveAttribute('size', '20')
  })

  it('handles maxLength attribute', () => {
    render(<Input maxLength={50} placeholder="Max length input" />)
    
    const input = screen.getByPlaceholderText('Max length input')
    expect(input).toHaveAttribute('maxlength', '50')
  })

  it('handles minLength attribute', () => {
    render(<Input minLength={3} placeholder="Min length input" />)
    
    const input = screen.getByPlaceholderText('Min length input')
    expect(input).toHaveAttribute('minlength', '3')
  })

  it('handles multiple event handlers', () => {
    const onChange = jest.fn()
    const onFocus = jest.fn()
    const onBlur = jest.fn()
    const onKeyDown = jest.fn()

    render(<Input onChange={onChange} onFocus={onFocus} onBlur={onBlur} onKeyDown={onKeyDown} />)

    const input = screen.getByRole('textbox')

    input.focus()
    expect(onFocus).toHaveBeenCalled()

    input.blur()
    expect(onBlur).toHaveBeenCalled()

    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onKeyDown).toHaveBeenCalled()
  })

  it('includes all expected CSS classes', () => {
    render(<Input placeholder="Test" />)
    
    const input = screen.getByPlaceholderText('Test')
    const expectedClasses = [
      'flex', 'h-10', 'w-full', 'rounded-md', 'border', 'border-input',
      'bg-background', 'px-3', 'py-2', 'text-base', 'ring-offset-background',
      'file:border-0', 'file:bg-transparent', 'file:text-sm', 'file:font-medium',
      'file:text-foreground', 'placeholder:text-muted-foreground',
      'focus-visible:outline-none', 'focus-visible:ring-2', 'focus-visible:ring-ring',
      'focus-visible:ring-offset-2', 'disabled:cursor-not-allowed', 'disabled:opacity-50',
      'md:text-sm'
    ]
    
    expectedClasses.forEach(className => {
      expect(input).toHaveClass(className)
    })
  })
})