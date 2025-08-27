import { render, screen } from './test-utils'
import { mockUser, mockSession } from './test-utils'

describe('Test Utilities', () => {
  it('should render components with custom render function', () => {
    const TestComponent = () => <div>Test Component</div>
    render(<TestComponent />)
    
    expect(screen.getByText('Test Component')).toBeInTheDocument()
  })

  it('should provide mock user data', () => {
    expect(mockUser).toHaveProperty('id')
    expect(mockUser).toHaveProperty('email')
    expect(mockUser).toHaveProperty('name')
    expect(mockUser.id).toBe('test-user-id')
    expect(mockUser.email).toBe('test@example.com')
  })

  it('should provide mock session data', () => {
    expect(mockSession).toHaveProperty('user')
    expect(mockSession).toHaveProperty('expires')
    expect(mockSession.user).toBe(mockUser)
  })
})