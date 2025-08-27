import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Label } from '../../src/components/label'

describe('Label', () => {
  it('renders with default styling', () => {
    render(<Label>Form Label</Label>)
    
    const label = screen.getByText('Form Label')
    expect(label).toBeInTheDocument()
    expect(label).toHaveClass('text-sm', 'font-medium', 'leading-none', 'peer-disabled:cursor-not-allowed', 'peer-disabled:opacity-70')
  })

  it('applies custom className', () => {
    render(<Label className="custom-label">Test</Label>)
    
    const label = screen.getByText('Test')
    expect(label).toHaveClass('custom-label')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLLabelElement>()
    render(<Label ref={ref}>Test</Label>)
    
    expect(ref.current).toBeInTheDocument()
  })

  it('forwards additional props', () => {
    render(<Label data-testid="custom-label" aria-label="Test label">Test</Label>)
    
    const label = screen.getByTestId('custom-label')
    expect(label).toHaveAttribute('aria-label', 'Test label')
  })

  it('renders with different content types', () => {
    render(<Label>Text Content</Label>)
    expect(screen.getByText('Text Content')).toBeInTheDocument()

    render(<Label><span>HTML Content</span></Label>)
    expect(screen.getByText('HTML Content')).toBeInTheDocument()
  })

  it('handles htmlFor attribute', () => {
    render(<Label htmlFor="input-id">Input Label</Label>)
    
    const label = screen.getByText('Input Label')
    expect(label).toHaveAttribute('for', 'input-id')
  })

  it('handles id attribute', () => {
    render(<Label id="label-id">ID Label</Label>)
    
    const label = screen.getByText('ID Label')
    expect(label).toHaveAttribute('id', 'label-id')
  })

  it('handles aria attributes', () => {
    render(<Label aria-describedby="description" aria-invalid="true">Accessible Label</Label>)
    
    const label = screen.getByText('Accessible Label')
    expect(label).toHaveAttribute('aria-describedby', 'description')
    expect(label).toHaveAttribute('aria-invalid', 'true')
  })

  it('handles form attribute', () => {
    render(<Label form="test-form">Form Label</Label>)
    
    const label = screen.getByText('Form Label')
    expect(label).toHaveAttribute('form', 'test-form')
  })

  it('handles data attributes', () => {
    render(<Label data-test="test-value" data-custom="custom-value">Data Label</Label>)
    
    const label = screen.getByText('Data Label')
    expect(label).toHaveAttribute('data-test', 'test-value')
    expect(label).toHaveAttribute('data-custom', 'custom-value')
  })

  it('handles event handlers', () => {
    const onClick = jest.fn()
    const onFocus = jest.fn()
    const onBlur = jest.fn()

    render(<Label onClick={onClick} onFocus={onFocus} onBlur={onBlur}>Test</Label>)

    const label = screen.getByText('Test')

    label.click()
    expect(onClick).toHaveBeenCalled()

    fireEvent.focus(label)
    expect(onFocus).toHaveBeenCalled()

    fireEvent.blur(label)
    expect(onBlur).toHaveBeenCalled()
  })

  it('handles style attribute', () => {
    render(<Label style={{ color: 'red' }}>Styled Label</Label>)
    
    const label = screen.getByText('Styled Label')
    expect(label).toHaveStyle({ color: 'red' })
  })

  it('handles title attribute', () => {
    render(<Label title="Tooltip text">Titled Label</Label>)
    
    const label = screen.getByText('Titled Label')
    expect(label).toHaveAttribute('title', 'Tooltip text')
  })

  it('handles lang attribute', () => {
    render(<Label lang="en">English Label</Label>)
    
    const label = screen.getByText('English Label')
    expect(label).toHaveAttribute('lang', 'en')
  })

  it('handles dir attribute', () => {
    render(<Label dir="rtl">RTL Label</Label>)
    
    const label = screen.getByText('RTL Label')
    expect(label).toHaveAttribute('dir', 'rtl')
  })

  it('handles tabIndex attribute', () => {
    render(<Label tabIndex={0}>Focusable Label</Label>)
    
    const label = screen.getByText('Focusable Label')
    expect(label).toHaveAttribute('tabIndex', '0')
  })

  it('handles hidden attribute', () => {
    render(<Label hidden>Hidden Label</Label>)
    
    const label = screen.getByText('Hidden Label')
    expect(label).toHaveAttribute('hidden')
  })

  it('handles spellCheck attribute', () => {
    render(<Label spellCheck={false}>Spell Check Label</Label>)
    
    const label = screen.getByText('Spell Check Label')
    expect(label).toHaveAttribute('spellcheck', 'false')
  })

  it('handles contentEditable attribute', () => {
    render(<Label contentEditable>Editable Label</Label>)
    
    const label = screen.getByText('Editable Label')
    expect(label).toHaveAttribute('contenteditable')
  })

  it('handles draggable attribute', () => {
    render(<Label draggable>Draggable Label</Label>)
    
    const label = screen.getByText('Draggable Label')
    expect(label).toHaveAttribute('draggable')
  })

  it('handles contextMenu attribute', () => {
    render(<Label contextMenu="menu-id">Context Menu Label</Label>)
    
    const label = screen.getByText('Context Menu Label')
    expect(label).toHaveAttribute('contextmenu', 'menu-id')
  })

  it('handles accessKey attribute', () => {
    render(<Label accessKey="l">Access Key Label</Label>)
    
    const label = screen.getByText('Access Key Label')
    expect(label).toHaveAttribute('accesskey', 'l')
  })

  it('handles multiple attributes together', () => {
    render(
      <Label
        htmlFor="input-1"
        id="label-1"
        className="custom-class"
        data-testid="test-label"
        aria-label="Multiple attributes label"
        style={{ fontWeight: 'bold' }}
      >
        Multiple Attributes
      </Label>
    )
    
    const label = screen.getByTestId('test-label')
    expect(label).toHaveAttribute('for', 'input-1')
    expect(label).toHaveAttribute('id', 'label-1')
    expect(label).toHaveClass('custom-class')
    expect(label).toHaveAttribute('aria-label', 'Multiple attributes label')
    expect(label).toHaveStyle({ fontWeight: 'bold' })
  })

  it('includes all expected CSS classes', () => {
    render(<Label>Test</Label>)
    
    const label = screen.getByText('Test')
    const expectedClasses = [
      'text-sm',
      'font-medium',
      'leading-none',
      'peer-disabled:cursor-not-allowed',
      'peer-disabled:opacity-70'
    ]
    
    expectedClasses.forEach(className => {
      expect(label).toHaveClass(className)
    })
  })
})