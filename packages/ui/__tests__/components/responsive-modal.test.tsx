import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { ResponsiveModal } from '../../src/components/responsive-modal'

// Mock Next.js components
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => React.createElement('img', props)
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: (props: any) => React.createElement('a', props)
}))

// Mock the components
jest.mock('../../src/components/dialog', () => ({
  Dialog: ({ children, open, onOpenChange }: any) => (
    <div data-testid="dialog" style={{ display: open ? 'block' : 'none' }}>
      {children}
    </div>
  ),
  DialogContent: ({ children, className, ...props }: any) => (
    <div className={className} data-testid="dialog-content" {...props}>
      {children}
    </div>
  ),
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <div>{children}</div>,
  DialogDescription: ({ children }: any) => <div>{children}</div>,
  DialogFooter: ({ children }: any) => <div>{children}</div>,
}))

jest.mock('../../src/components/bottom-sheet', () => ({
  BottomSheet: ({ children, isOpen, className, ...props }: any) => (
    <div data-testid="bottom-sheet" className={className} style={{ display: isOpen ? 'block' : 'none' }}>
      {children}
    </div>
  ),
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

describe('ResponsiveModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    title: 'Test Modal',
    description: 'Test Description',
    children: 'Test Content'
  }

  beforeEach(() => {
    // Mock window.innerWidth for mobile detection
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375 // Mobile width
    })
    jest.clearAllMocks()
  })

  afterEach(() => {
    // Restore original innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024
    })
  })

  it('renders when open', async () => {
    await act(async () => {
      render(<ResponsiveModal {...defaultProps} />)
    })
    
    // Check if the title and description are rendered in the BottomSheet header
    expect(screen.getByTestId('bottom-sheet-title')).toBeInTheDocument()
    expect(screen.getByTestId('bottom-sheet-subtitle')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('does not render when closed', async () => {
    await act(async () => {
      render(<ResponsiveModal {...defaultProps} isOpen={false} />)
    })
    
    expect(screen.queryByTestId('bottom-sheet-title')).not.toBeInTheDocument()
    expect(screen.queryByTestId('bottom-sheet-subtitle')).not.toBeInTheDocument()
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', async () => {
    await act(async () => {
      render(<ResponsiveModal {...defaultProps} />)
    })
    
    const closeButton = screen.getByTestId('bottom-sheet-close')
    fireEvent.click(closeButton)
    
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('calls onClose when backdrop is clicked', async () => {
    await act(async () => {
      render(<ResponsiveModal {...defaultProps} />)
    })
    
    const backdrop = screen.getByTestId('bottom-sheet').parentElement
    fireEvent.click(backdrop!)
    
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('applies custom className to modal', async () => {
    await act(async () => {
      render(<ResponsiveModal {...defaultProps} className="custom-modal" />)
    })
    
    expect(screen.getByTestId('bottom-sheet')).toHaveClass('custom-modal')
  })

  it('applies custom contentClassName to content', async () => {
    await act(async () => {
      render(<ResponsiveModal {...defaultProps} contentClassName="custom-content" />)
    })
    
    const contentArea = screen.getByTestId('bottom-sheet').querySelector('.space-y-4')
    expect(contentArea).toHaveClass('custom-content')
  })

  it('handles missing description', async () => {
    const propsWithoutDescription = { ...defaultProps }
    delete propsWithoutDescription.description
    
    await act(async () => {
      render(<ResponsiveModal {...propsWithoutDescription} />)
    })
    
    expect(screen.getByTestId('bottom-sheet-title')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
    expect(screen.queryByTestId('bottom-sheet-subtitle')).not.toBeInTheDocument()
  })

  it('handles missing title', async () => {
    const propsWithoutTitle = { ...defaultProps }
    delete propsWithoutTitle.title
    
    await act(async () => {
      render(<ResponsiveModal {...propsWithoutTitle} />)
    })
    
    expect(screen.getByTestId('bottom-sheet-subtitle')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
    expect(screen.queryByTestId('bottom-sheet-title')).not.toBeInTheDocument()
  })

  it('handles missing children', async () => {
    const propsWithoutChildren = { ...defaultProps }
    delete propsWithoutChildren.children
    
    await act(async () => {
      render(<ResponsiveModal {...propsWithoutChildren} />)
    })
    
    expect(screen.getByTestId('bottom-sheet-title')).toBeInTheDocument()
    expect(screen.getByTestId('bottom-sheet-subtitle')).toBeInTheDocument()
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument()
  })

  it('handles footer', async () => {
    const footer = <button>Save</button>
    
    await act(async () => {
      render(<ResponsiveModal {...defaultProps} footer={footer} />)
    })
    
    expect(screen.getByText('Save')).toBeInTheDocument()
  })

  it('handles complex title', async () => {
    const complexTitle = (
      <div>
        <span>Complex</span>
        <span>Title</span>
      </div>
    )
    
    await act(async () => {
      render(<ResponsiveModal {...defaultProps} title={complexTitle} />)
    })
    
    expect(screen.getByText('Complex')).toBeInTheDocument()
    expect(screen.getByText('Title')).toBeInTheDocument()
  })

  it('handles complex description', async () => {
    const complexDescription = (
      <div>
        <span>Complex</span>
        <span>Description</span>
      </div>
    )
    
    await act(async () => {
      render(<ResponsiveModal {...defaultProps} description={complexDescription} />)
    })
    
    expect(screen.getByText('Complex')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
  })

  it('handles complex children', async () => {
    const complexChildren = (
      <div>
        <h1>Complex Content</h1>
        <p>With multiple elements</p>
      </div>
    )
    
    await act(async () => {
      render(<ResponsiveModal {...defaultProps} children={complexChildren} />)
    })
    
    expect(screen.getByText('Complex Content')).toBeInTheDocument()
    expect(screen.getByText('With multiple elements')).toBeInTheDocument()
  })

  it('handles null children', async () => {
    await act(async () => {
      render(<ResponsiveModal {...defaultProps} children={null} />)
    })
    
    expect(screen.getByTestId('bottom-sheet-title')).toBeInTheDocument()
    expect(screen.getByTestId('bottom-sheet-subtitle')).toBeInTheDocument()
  })

  it('handles undefined children', async () => {
    await act(async () => {
      render(<ResponsiveModal {...defaultProps} children={undefined} />)
    })
    
    expect(screen.getByTestId('bottom-sheet-title')).toBeInTheDocument()
    expect(screen.getByTestId('bottom-sheet-subtitle')).toBeInTheDocument()
  })

  it('handles boolean children', async () => {
    await act(async () => {
      render(<ResponsiveModal {...defaultProps} children={false} />)
    })
    
    expect(screen.getByTestId('bottom-sheet-title')).toBeInTheDocument()
    expect(screen.getByTestId('bottom-sheet-subtitle')).toBeInTheDocument()
  })

  it('handles number children', async () => {
    await act(async () => {
      render(<ResponsiveModal {...defaultProps} children={42} />)
    })
    
    expect(screen.getByTestId('bottom-sheet-title')).toBeInTheDocument()
    expect(screen.getByTestId('bottom-sheet-subtitle')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('handles string children', async () => {
    await act(async () => {
      render(<ResponsiveModal {...defaultProps} children="String Content" />)
    })
    
    expect(screen.getByTestId('bottom-sheet-title')).toBeInTheDocument()
    expect(screen.getByTestId('bottom-sheet-subtitle')).toBeInTheDocument()
    expect(screen.getByText('String Content')).toBeInTheDocument()
  })

  it('handles empty string children', async () => {
    await act(async () => {
      render(<ResponsiveModal {...defaultProps} children="" />)
    })
    
    expect(screen.getByTestId('bottom-sheet-title')).toBeInTheDocument()
    expect(screen.getByTestId('bottom-sheet-subtitle')).toBeInTheDocument()
  })

  it('handles zero children', async () => {
    await act(async () => {
      render(<ResponsiveModal {...defaultProps} children={0} />)
    })
    
    expect(screen.getByTestId('bottom-sheet-title')).toBeInTheDocument()
    expect(screen.getByTestId('bottom-sheet-subtitle')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('handles negative number children', async () => {
    await act(async () => {
      render(<ResponsiveModal {...defaultProps} children={-42} />)
    })
    
    expect(screen.getByTestId('bottom-sheet-title')).toBeInTheDocument()
    expect(screen.getByTestId('bottom-sheet-subtitle')).toBeInTheDocument()
    expect(screen.getByText('-42')).toBeInTheDocument()
  })

  it('handles decimal number children', async () => {
    await act(async () => {
      render(<ResponsiveModal {...defaultProps} children={3.14} />)
    })
    
    expect(screen.getByTestId('bottom-sheet-title')).toBeInTheDocument()
    expect(screen.getByTestId('bottom-sheet-subtitle')).toBeInTheDocument()
    expect(screen.getByText('3.14')).toBeInTheDocument()
  })

  it('handles responsive breakpoint changes', async () => {
    // Start with mobile
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375
    })
    
    await act(async () => {
      render(<ResponsiveModal {...defaultProps} />)
    })
    
    // Should be mobile (BottomSheet)
    expect(screen.getByTestId('bottom-sheet')).toBeInTheDocument()
    
    // Change to desktop
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024
    })
    
    // Trigger resize event
    await act(async () => {
      window.dispatchEvent(new Event('resize'))
    })
    
    // Should now be desktop (Dialog)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})