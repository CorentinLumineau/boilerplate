import { cn } from '../../../app/lib/theme/base'

describe('Theme Utility Functions', () => {
  describe('cn function', () => {
    it('combines class names correctly', () => {
      const result = cn('class1', 'class2', 'class3')
      expect(result).toBe('class1 class2 class3')
    })

    it('handles conditional classes', () => {
      const isActive = true
      const isDisabled = false
      
      const result = cn(
        'base-class',
        isActive && 'active-class',
        isDisabled && 'disabled-class'
      )
      
      expect(result).toBe('base-class active-class')
    })

    it('filters out falsy values', () => {
      const result = cn(
        'base-class',
        null,
        undefined,
        false,
        '',
        0,
        'valid-class'
      )
      
      expect(result).toBe('base-class valid-class')
    })

    it('handles empty input', () => {
      const result = cn()
      expect(result).toBe('')
    })

    it('handles single class', () => {
      const result = cn('single-class')
      expect(result).toBe('single-class')
    })

    it('handles mixed types', () => {
      const result = cn(
        'string-class',
        ['array-class-1', 'array-class-2'],
        { 'object-class': true, 'false-class': false }
      )
      
      expect(result).toBe('string-class array-class-1 array-class-2 object-class')
    })

    it('handles nested arrays', () => {
      const result = cn(
        'base',
        ['level1', ['level2', 'level3']],
        'end'
      )
      
      expect(result).toBe('base level1 level2 level3 end')
    })

    it('handles complex conditional logic', () => {
      const userRole = 'admin'
      const isLoggedIn = true
      const hasPermission = false
      
      const result = cn(
        'base-button',
        userRole === 'admin' && 'admin-button',
        isLoggedIn && 'logged-in',
        hasPermission && 'has-permission',
        'always-present'
      )
      
      expect(result).toBe('base-button admin-button logged-in always-present')
    })
  })
})