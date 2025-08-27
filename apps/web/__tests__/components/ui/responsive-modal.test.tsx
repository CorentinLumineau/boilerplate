import { render, screen, fireEvent } from '../../utils/test-utils'
import { ResponsiveModal } from '../../../app/components/ui/responsive-modal'

describe('ResponsiveModal Component', () => {
  const defaultProps = {
    children: <div>Modal Content</div>,
    isOpen: true,
    onClose: jest.fn(),
    title: 'Test Modal',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders when open', () => {
    render(<ResponsiveModal {...defaultProps} />)
    
    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByText('Modal Content')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(<ResponsiveModal {...defaultProps} isOpen={false} />)
    
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument()
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn()
    render(<ResponsiveModal {...defaultProps} onClose={onClose} />)
    
    const closeButton = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeButton)
    
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when backdrop is clicked', () => {
    const onClose = jest.fn()
    render(<ResponsiveModal {...defaultProps} onClose={onClose} />)
    
    const backdrop = screen.getByTestId('modal-backdrop')
    fireEvent.click(backdrop)
    
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose when modal content is clicked', () => {
    const onClose = jest.fn()
    render(<ResponsiveModal {...defaultProps} onClose={onClose} />)
    
    const modalContent = screen.getByTestId('modal-content')
    fireEvent.click(modalContent)
    
    expect(onClose).not.toHaveBeenCalled()
  })

  it('has proper accessibility attributes', () => {
    render(<ResponsiveModal {...defaultProps} />)
    
    const modal = screen.getByRole('dialog')
    expect(modal).toHaveAttribute('aria-modal', 'true')
    expect(modal).toHaveAttribute('aria-labelledby')
    
    const title = screen.getByText('Test Modal')
    expect(title).toHaveAttribute('id')
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
    const customContent = <button>Custom Button</button>
    render(<ResponsiveModal {...defaultProps}>{customContent}</ResponsiveModal>)
    
    expect(screen.getByRole('button', { name: 'Custom Button' })).toBeInTheDocument()
  })

  it('maintains proper z-index for modal overlay', () => {
    render(<ResponsiveModal {...defaultProps} />)
    
    const overlay = screen.getByTestId('modal-overlay')
    expect(overlay).toHaveStyle({ zIndex: expect.any(String) })
  })
})