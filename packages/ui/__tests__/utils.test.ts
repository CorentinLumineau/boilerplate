import { cn } from '../src/utils'

describe('cn utility function', () => {
  it('combines multiple class names', () => {
    const result = cn('class1', 'class2', 'class3')
    expect(result).toBe('class1 class2 class3')
  })

  it('handles empty strings', () => {
    const result = cn('class1', '', 'class3')
    expect(result).toBe('class1 class3')
  })

  it('handles undefined values', () => {
    const result = cn('class1', undefined, 'class3')
    expect(result).toBe('class1 class3')
  })

  it('handles null values', () => {
    const result = cn('class1', null, 'class3')
    expect(result).toBe('class1 class3')
  })

  it('handles boolean values', () => {
    const result = cn('class1', true && 'class2', false && 'class3', 'class4')
    expect(result).toBe('class1 class2 class4')
  })

  it('handles conditional classes', () => {
    const isActive = true
    const isDisabled = false
    const result = cn(
      'base-class',
      isActive && 'active',
      isDisabled && 'disabled'
    )
    expect(result).toBe('base-class active')
  })

  it('handles arrays of classes', () => {
    const result = cn(['class1', 'class2'], 'class3', ['class4', 'class5'])
    expect(result).toBe('class1 class2 class3 class4 class5')
  })

  it('handles nested arrays', () => {
    const result = cn(['class1', ['class2', 'class3']], 'class4')
    expect(result).toBe('class1 class2 class3 class4')
  })

  it('handles objects with boolean values', () => {
    const result = cn({
      'base-class': true,
      'active': true,
      'disabled': false,
      'hidden': false
    })
    expect(result).toBe('base-class active')
  })

  it('handles mixed input types', () => {
    const result = cn(
      'base-class',
      ['array-class1', 'array-class2'],
      { 'object-class': true, 'hidden': false },
      'string-class',
      undefined,
      null,
      ''
    )
    expect(result).toBe('base-class array-class1 array-class2 object-class string-class')
  })

  it('handles complex conditional logic', () => {
    const userRole = 'admin'
    const isLoggedIn = true
    const theme = 'dark'
    
    const result = cn(
      'base-button',
      'px-4 py-2',
      isLoggedIn && 'logged-in',
      userRole === 'admin' && 'admin-only',
      theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
    )
    
    expect(result).toBe('base-button px-4 py-2 logged-in admin-only bg-gray-800 text-white')
  })

  it('handles empty input', () => {
    const result = cn()
    expect(result).toBe('')
  })

  it('handles single class', () => {
    const result = cn('single-class')
    expect(result).toBe('single-class')
  })

  it('handles whitespace in class names', () => {
    const result = cn('  class1  ', '  class2  ', '  class3  ')
    expect(result).toBe('class1 class2 class3')
  })

  it('handles duplicate classes', () => {
    const result = cn('class1', 'class2', 'class1', 'class3')
    expect(result).toBe('class1 class2 class1 class3')
  })

  it('handles numbers', () => {
    const result = cn('class1', 42, 'class3')
    expect(result).toBe('class1 42 class3')
  })

  it('handles functions that return strings', () => {
    const getClass = () => 'dynamic-class'
    const result = cn('static-class', getClass())
    expect(result).toBe('static-class dynamic-class')
  })

  it('handles empty arrays', () => {
    const result = cn('class1', [], 'class3')
    expect(result).toBe('class1 class3')
  })

  it('handles arrays with empty strings', () => {
    const result = cn(['class1', '', 'class2'], 'class3')
    expect(result).toBe('class1 class2 class3')
  })

  it('handles objects with all false values', () => {
    const result = cn({
      'class1': false,
      'class2': false,
      'class3': false
    })
    expect(result).toBe('')
  })

  it('handles objects with mixed boolean values', () => {
    const result = cn({
      'base': true,
      'primary': true,
      'secondary': false,
      'danger': false,
      'success': true
    })
    expect(result).toBe('base primary success')
  })

  it('handles deeply nested conditional logic', () => {
    const user = {
      isAdmin: true,
      permissions: ['read', 'write'],
      preferences: {
        theme: 'dark',
        notifications: true
      }
    }
    
    const result = cn(
      'base-component',
      user.isAdmin && 'admin-component',
      user.permissions.includes('write') && 'writable',
      user.preferences.theme === 'dark' && 'dark-theme',
      user.preferences.notifications && 'notifications-enabled'
    )
    
    expect(result).toBe('base-component admin-component writable dark-theme notifications-enabled')
  })

  it('handles complex array conditions', () => {
    const items = ['item1', 'item2', 'item3']
    const selectedItems = ['item1', 'item3']
    
    const result = cn(
      'list-container',
      items.length > 0 && 'has-items',
      selectedItems.length > 0 && 'has-selection',
      selectedItems.length === items.length && 'all-selected'
    )
    
    expect(result).toBe('list-container has-items has-selection')
  })

  it('handles template literals', () => {
    const size = 'lg'
    const variant = 'primary'
    
    const result = cn(
      'button',
      `button--${size}`,
      `button--${variant}`,
      size === 'lg' && 'button--large'
    )
    
    expect(result).toBe('button button--lg button--primary button--large')
  })

  it('handles edge cases with special characters', () => {
    const result = cn(
      'class-with-dash',
      'class_with_underscore',
      'class.with.dots',
      'class:with:colons',
      'class[with]brackets'
    )
    
    expect(result).toBe('class-with-dash class_with_underscore class.with.dots class:with:colons class[with]brackets')
  })

  it('handles falsy values that are not false', () => {
    const result = cn(
      'base',
      0 && 'zero',
      '' && 'empty',
      NaN && 'nan',
      false && 'false'
    )
    
    expect(result).toBe('base')
  })

  it('handles truthy values that are not true', () => {
    const result = cn(
      'base',
      'string' && 'truthy-string',
      42 && 'truthy-number',
      {} && 'truthy-object',
      [] && 'truthy-array'
    )
    
    expect(result).toBe('base truthy-string truthy-number truthy-object truthy-array')
  })
})