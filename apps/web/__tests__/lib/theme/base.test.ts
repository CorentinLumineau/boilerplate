import { baseTheme } from '../../../app/lib/theme/base'

describe('Theme Base', () => {
  describe('baseTheme', () => {
    it('should have correct radius value', () => {
      expect(baseTheme.radius).toBe('0.5rem')
    })

    it('should be an object', () => {
      expect(typeof baseTheme).toBe('object')
      expect(baseTheme).not.toBeNull()
    })

    it('should have radius property', () => {
      expect(baseTheme).toHaveProperty('radius')
    })
  })
})