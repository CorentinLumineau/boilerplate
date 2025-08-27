import { render, screen } from '../utils/test-utils'
import Page from '../../app/page'

// Mock the components that might not be available in test environment
jest.mock('../../app/components/ui/responsive-modal', () => ({
  ResponsiveModal: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-modal">{children}</div>,
}))

describe('Page Component', () => {
  beforeEach(() => {
    // Setup test environment
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<Page />)
    expect(screen.getByTestId('responsive-modal')).toBeInTheDocument()
  })

  it('renders with correct structure', () => {
    render(<Page />)
    
    // Check if the main container is present
    const mainElement = screen.getByRole('main')
    expect(mainElement).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<Page />)
    
    // Check for proper heading structure
    const headings = screen.getAllByRole('heading')
    expect(headings.length).toBeGreaterThan(0)
  })

  it('renders consistently across renders', () => {
    const { rerender } = render(<Page />)
    
    // First render
    expect(screen.getByTestId('responsive-modal')).toBeInTheDocument()
    
    // Re-render
    rerender(<Page />)
    expect(screen.getByTestId('responsive-modal')).toBeInTheDocument()
  })
})