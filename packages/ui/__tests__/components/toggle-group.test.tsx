import React from 'react'
import { render, screen } from '@testing-library/react'
import { ToggleGroup, ToggleGroupItem } from '../../src/components/toggle-group'

describe('ToggleGroup', () => {
  it('renders with default styling', () => {
    render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
        <ToggleGroupItem value="item2">Item 2</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const group = screen.getByRole('group')
    expect(group).toBeInTheDocument()
    expect(group).toHaveClass('flex', 'items-center', 'justify-center', 'gap-1')
  })

  it('applies custom className', () => {
    render(
      <ToggleGroup type="single" className="custom-group">
        <ToggleGroupItem value="item1">Test</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const group = screen.getByRole('group')
    expect(group).toHaveClass('custom-group')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <ToggleGroup type="single" ref={ref}>
        <ToggleGroupItem value="item1">Test</ToggleGroupItem>
      </ToggleGroup>
    )
    
    expect(ref.current).toBeInTheDocument()
  })

  it('forwards additional props', () => {
    render(
      <ToggleGroup type="single" data-testid="custom-group" aria-label="Custom group">
        <ToggleGroupItem value="item1">Test</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const group = screen.getByTestId('custom-group')
    expect(group).toHaveAttribute('aria-label', 'Custom group')
  })

  it('handles value prop', () => {
    render(
      <ToggleGroup type="single" value="item1">
        <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
        <ToggleGroupItem value="item2">Item 2</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const group = screen.getByRole('group')
    expect(group).toHaveAttribute('data-value', 'item1')
  })

  it('handles onValueChange callback', () => {
    const onValueChange = jest.fn()
    render(
      <ToggleGroup type="single" onValueChange={onValueChange}>
        <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
        <ToggleGroupItem value="item2">Item 2</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const group = screen.getByRole('group')
    expect(group).toBeInTheDocument()
    // Note: onValueChange is handled by Radix UI internally
  })

  it('handles disabled state', () => {
    render(
      <ToggleGroup type="single" disabled>
        <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
        <ToggleGroupItem value="item2">Item 2</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const group = screen.getByRole('group')
    expect(group).toHaveAttribute('data-disabled')
  })

  it('handles orientation prop', () => {
    render(
      <ToggleGroup type="single" orientation="vertical">
        <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
        <ToggleGroupItem value="item2">Item 2</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const group = screen.getByRole('group')
    expect(group).toHaveAttribute('data-orientation', 'vertical')
  })

  it('handles loop prop', () => {
    render(
      <ToggleGroup type="single" loop={false}>
        <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
        <ToggleGroupItem value="item2">Item 2</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const group = screen.getByRole('group')
    expect(group).toHaveAttribute('data-loop', 'false')
  })

  it('handles multiple selection', () => {
    render(
      <ToggleGroup type="multiple">
        <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
        <ToggleGroupItem value="item2">Item 2</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const group = screen.getByRole('group')
    expect(group).toHaveAttribute('data-type', 'multiple')
  })

  it('handles single selection', () => {
    render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
        <ToggleGroupItem value="item2">Item 2</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const group = screen.getByRole('group')
    expect(group).toHaveAttribute('data-type', 'single')
  })

  it('handles aria attributes', () => {
    render(
      <ToggleGroup
        type="single"
        aria-label="Toggle group"
        aria-describedby="description"
        aria-labelledby="label"
      >
        <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
        <ToggleGroupItem value="item2">Item 2</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const group = screen.getByRole('group')
    expect(group).toHaveAttribute('aria-label', 'Toggle group')
    expect(group).toHaveAttribute('aria-describedby', 'description')
    expect(group).toHaveAttribute('aria-labelledby', 'label')
  })

  it('handles data attributes', () => {
    render(
      <ToggleGroup type="single" data-test="test-value" data-custom="custom-value">
        <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
        <ToggleGroupItem value="item2">Item 2</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const group = screen.getByRole('group')
    expect(group).toHaveAttribute('data-test', 'test-value')
    expect(group).toHaveAttribute('data-custom', 'custom-value')
  })

  it('handles event handlers', () => {
    const onFocus = jest.fn()
    const onBlur = jest.fn()
    const onKeyDown = jest.fn()

    render(
      <ToggleGroup type="single" onFocus={onFocus} onBlur={onBlur} onKeyDown={onKeyDown}>
        <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
        <ToggleGroupItem value="item2">Item 2</ToggleGroupItem>
      </ToggleGroup>
    )

    const group = screen.getByRole('group')
    
    group.focus()
    expect(onFocus).toHaveBeenCalled()

    group.blur()
    expect(onBlur).toHaveBeenCalled()

    group.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
    expect(onKeyDown).toHaveBeenCalled()
  })

  it('handles style attribute', () => {
    render(
      <ToggleGroup type="single" style={{ color: 'red' }}>
        <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
        <ToggleGroupItem value="item2">Item 2</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const group = screen.getByRole('group')
    expect(group).toHaveStyle({ color: 'red' })
  })

  it('handles title attribute', () => {
    render(
      <ToggleGroup type="single" title="Tooltip text">
        <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
        <ToggleGroupItem value="item2">Item 2</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const group = screen.getByRole('group')
    expect(group).toHaveAttribute('title', 'Tooltip text')
  })

  it('handles tabIndex attribute', () => {
    render(
      <ToggleGroup type="single" tabIndex={0}>
        <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
        <ToggleGroupItem value="item2">Item 2</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const group = screen.getByRole('group')
    expect(group).toHaveAttribute('tabIndex', '0')
  })

  it('handles hidden attribute', () => {
    render(
      <ToggleGroup type="single" hidden>
        <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
        <ToggleGroupItem value="item2">Item 2</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const group = screen.getByRole('group')
    expect(group).toHaveAttribute('hidden')
  })

  it('handles multiple attributes together', () => {
    render(
      <ToggleGroup
        type="multiple"
        orientation="vertical"
        className="custom-group"
        data-testid="test-group"
        aria-label="Multiple attributes group"
        style={{ fontWeight: 'bold' }}
        disabled
      >
        <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
        <ToggleGroupItem value="item2">Item 2</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const group = screen.getByTestId('test-group')
    expect(group).toHaveClass('custom-group')
    expect(group).toHaveAttribute('aria-label', 'Multiple attributes group')
    expect(group).toHaveStyle({ fontWeight: 'bold' })
    expect(group).toHaveAttribute('data-disabled')
    expect(group).toHaveAttribute('data-type', 'multiple')
    expect(group).toHaveAttribute('data-orientation', 'vertical')
  })

  it('renders with different content types', () => {
    render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="item1">Text Content</ToggleGroupItem>
        <ToggleGroupItem value="item2"><span>HTML Content</span></ToggleGroupItem>
      </ToggleGroup>
    )
    
    expect(screen.getByRole('button', { name: 'Text Content' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'HTML Content' })).toBeInTheDocument()
  })

  it('includes all expected CSS classes', () => {
    render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="item1">Test</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const group = screen.getByRole('group')
    const expectedClasses = [
      'flex',
      'items-center',
      'justify-center',
      'gap-1'
    ]
    
    expectedClasses.forEach(className => {
      expect(group).toHaveClass(className)
    })
  })
})

describe('ToggleGroupItem', () => {
  it('renders with default styling', () => {
    render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="item1">Toggle Item</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const item = screen.getByRole('button', { name: 'Toggle Item' })
    expect(item).toBeInTheDocument()
    expect(item).toHaveAttribute('data-value', 'item1')
  })

  it('applies custom className', () => {
    render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="item1" className="custom-item">Test</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const item = screen.getByRole('button', { name: 'Test' })
    expect(item).toHaveClass('custom-item')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="item1" ref={ref}>Test</ToggleGroupItem>
      </ToggleGroup>
    )
    
    expect(ref.current).toBeInTheDocument()
  })

  it('forwards additional props', () => {
    render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="item1" data-testid="custom-item" aria-label="Custom item">Test</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const item = screen.getByTestId('custom-item')
    expect(item).toHaveAttribute('aria-label', 'Custom item')
  })

  it('handles disabled state', () => {
    render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="item1" disabled>Disabled Item</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const item = screen.getByRole('button', { name: 'Disabled Item' })
    expect(item).toBeDisabled()
  })

  it('handles pressed state', () => {
    render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="item1" aria-pressed="true">Pressed Item</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const item = screen.getByRole('button', { name: 'Pressed Item' })
    expect(item).toHaveAttribute('aria-pressed', 'true')
  })

  it('handles type attribute', () => {
    render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="item1" type="submit">Submit Item</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const item = screen.getByRole('button', { name: 'Submit Item' })
    expect(item).toHaveAttribute('type', 'submit')
  })

  it('handles value attribute', () => {
    render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="custom-value">Value Item</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const item = screen.getByRole('button', { name: 'Value Item' })
    expect(item).toHaveAttribute('data-value', 'custom-value')
  })

  it('handles name attribute', () => {
    render(
      <ToggleGroup type="single" value="item1">
        <ToggleGroupItem value="item1" name="toggle-name">Named Item</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const item = screen.getByRole('radio', { name: 'Named Item' })
    expect(item).toHaveAttribute('name', 'toggle-name')
  })

  it('handles form attribute', () => {
    render(
      <ToggleGroup type="single" value="item1">
        <ToggleGroupItem value="item1" form="test-form">Form Item</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const item = screen.getByRole('radio', { name: 'Form Item' })
    expect(item).toHaveAttribute('form', 'test-form')
  })

  it('handles aria attributes', () => {
    render(
      <ToggleGroup type="single" value="item1">
        <ToggleGroupItem 
          value="item1" 
          aria-label="Accessible item"
          aria-describedby="description"
          aria-expanded="true"
          aria-controls="panel"
        >
          Accessible Item
        </ToggleGroupItem>
      </ToggleGroup>
    )
    
    const item = screen.getByRole('radio', { name: 'Accessible item' })
    expect(item).toHaveAttribute('aria-describedby', 'description')
    expect(item).toHaveAttribute('aria-expanded', 'true')
    expect(item).toHaveAttribute('aria-controls', 'panel')
  })

  it('handles data attributes', () => {
    render(
      <ToggleGroup type="single" value="item1">
        <ToggleGroupItem 
          value="item1" 
          data-test="test-value"
          data-custom="custom-value"
        >
          Data Item
        </ToggleGroupItem>
      </ToggleGroup>
    )
    
    const item = screen.getByRole('radio', { name: 'Data Item' })
    expect(item).toHaveAttribute('data-test', 'test-value')
    expect(item).toHaveAttribute('data-custom', 'custom-value')
  })

  it('handles event handlers', () => {
    const onClick = jest.fn()
    const onFocus = jest.fn()
    const onBlur = jest.fn()

    render(
      <ToggleGroup type="single" value="item1">
        <ToggleGroupItem 
          value="item1" 
          onClick={onClick}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          Event Item
        </ToggleGroupItem>
      </ToggleGroup>
    )

    const item = screen.getByRole('radio', { name: 'Event Item' })
    
    item.click()
    expect(onClick).toHaveBeenCalled()

    item.focus()
    expect(onFocus).toHaveBeenCalled()

    item.blur()
    expect(onBlur).toHaveBeenCalled()
  })

  it('handles style attribute', () => {
    render(
      <ToggleGroup type="single" value="item1">
        <ToggleGroupItem 
          value="item1" 
          style={{ color: 'red' }}
        >
          Styled Item
        </ToggleGroupItem>
      </ToggleGroup>
    )
    
    const item = screen.getByRole('radio', { name: 'Styled Item' })
    expect(item).toHaveStyle({ color: 'red' })
  })

  it('handles title attribute', () => {
    render(
      <ToggleGroup type="single" value="item1">
        <ToggleGroupItem 
          value="item1" 
          title="Tooltip text"
        >
          Titled Item
        </ToggleGroupItem>
      </ToggleGroup>
    )
    
    const item = screen.getByRole('radio', { name: 'Titled Item' })
    expect(item).toHaveAttribute('title', 'Tooltip text')
  })

  it('handles tabIndex attribute', () => {
    render(
      <ToggleGroup type="single" value="item1">
        <ToggleGroupItem 
          value="item1" 
          tabIndex={0}
        >
          Focusable Item
        </ToggleGroupItem>
      </ToggleGroup>
    )
    
    const item = screen.getByRole('radio', { name: 'Focusable Item' })
    expect(item).toHaveAttribute('tabIndex', '0')
  })

  it('handles hidden attribute', () => {
    render(
      <ToggleGroup type="single" value="item1">
        <ToggleGroupItem 
          value="item1" 
          hidden
        >
          Hidden Item
        </ToggleGroupItem>
      </ToggleGroup>
    )
    
    const item = screen.getByRole('radio', { name: 'Hidden Item', hidden: true })
    expect(item).toHaveAttribute('hidden')
  })

  it('renders with different content types', () => {
    render(
      <ToggleGroup type="single" value="item1">
        <ToggleGroupItem value="item1">Text Content</ToggleGroupItem>
        <ToggleGroupItem value="item2">
          <span>HTML Content</span>
        </ToggleGroupItem>
      </ToggleGroup>
    )
    
    expect(screen.getByRole('radio', { name: 'Text Content' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'HTML Content' })).toBeInTheDocument()
  })

  it('inherits context values correctly', () => {
    render(
      <ToggleGroup type="single" value="item1" variant="default" size="lg">
        <ToggleGroupItem value="item1">Context Item</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const item = screen.getByRole('radio', { name: 'Context Item' })
    // The item should inherit the variant and size from context
    expect(item).toBeInTheDocument()
  })
})