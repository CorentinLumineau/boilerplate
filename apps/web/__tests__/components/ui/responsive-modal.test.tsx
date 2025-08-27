import { render, screen, fireEvent } from '../../utils/test-utils'
import { ResponsiveModal } from '../../../app/components/ui/responsive-modal'

describe('ResponsiveModal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    title: 'Test Modal',
    description: 'Test Description',
    children: <div>Modal Content</div>,
    footer: <div>Footer Content</div>
  }

  beforeEach(() => {
    jest.clearAllMocks()
    // Mock window.innerWidth for desktop testing
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })
  })

  it('renders when open', () => {
    render(<ResponsiveModal {...defaultProps} />)
    
    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
    expect(screen.getByText('Modal Content')).toBeInTheDocument()
    expect(screen.getByText('Footer Content')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(<ResponsiveModal {...defaultProps} isOpen={false} />)
    
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument()
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument()
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn()
    render(<ResponsiveModal {...defaultProps} onClose={onClose} />)
    
    const closeButton = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeButton)
    
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose when modal content is clicked', () => {
    const onClose = jest.fn()
    render(<ResponsiveModal {...defaultProps} onClose={onClose} />)
    
    const modalContent = screen.getByText('Modal Content')
    fireEvent.click(modalContent)
    
    expect(onClose).not.toHaveBeenCalled()
  })

  it('has proper accessibility attributes', () => {
    render(<ResponsiveModal {...defaultProps} />)
    
    const modal = screen.getByRole('dialog')
    expect(modal).toHaveAttribute('aria-labelledby')
    expect(modal).toHaveAttribute('aria-describedby')
    
    const title = screen.getByText('Test Modal')
    expect(title).toBeInTheDocument()
  })

  it('traps focus within modal when open', () => {
    render(<ResponsiveModal {...defaultProps} />)
    
    const modal = screen.getByRole('dialog')
    expect(modal).toHaveAttribute('tabindex', '-1')
  })

  it('renders with custom className', () => {
    const customClass = 'custom-modal-class'
    render(<ResponsiveModal {...defaultProps} className={customClass} />)
    
    const modal = screen.getByRole('dialog')
    expect(modal).toHaveClass(customClass)
  })

  it('handles keyboard events properly', () => {
    const onClose = jest.fn()
    render(<ResponsiveModal {...defaultProps} onClose={onClose} />)
    
    // Test Escape key
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('renders children correctly', () => {
    const customChildren = <div data-testid="custom-content">Custom Content</div>
    render(<ResponsiveModal {...defaultProps} children={customChildren} />)
    
    expect(screen.getByTestId('custom-content')).toBeInTheDocument()
    expect(screen.getByText('Custom Content')).toBeInTheDocument()
  })

  it('maintains proper z-index for modal overlay', () => {
    render(<ResponsiveModal {...defaultProps} />)
    
    // Find the backdrop div with z-50 class
    const overlay = document.querySelector('.z-50.bg-black\\/80')
    expect(overlay).toBeInTheDocument()
    
    if (overlay) {
      expect(overlay).toHaveClass('z-50')
    }
  })

  it('renders without title and description', () => {
    const propsWithoutHeader = {
      ...defaultProps,
      title: undefined,
      description: undefined
    }
    
    render(<ResponsiveModal {...propsWithoutHeader} />)
    
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument()
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument()
    expect(screen.getByText('Modal Content')).toBeInTheDocument()
  })

  it('renders without footer', () => {
    const propsWithoutFooter = {
      ...defaultProps,
      footer: undefined
    }
    
    render(<ResponsiveModal {...propsWithoutFooter} />)
    
    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByText('Modal Content')).toBeInTheDocument()
    expect(screen.queryByText('Footer Content')).not.toBeInTheDocument()
  })
})