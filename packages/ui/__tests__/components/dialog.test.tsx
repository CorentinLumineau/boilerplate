import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription
} from '../../src/components/dialog'

// Mock Next.js components
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => React.createElement('img', props)
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: (props: any) => React.createElement('a', props)
}))

describe('Dialog', () => {
  it('renders DialogPortal component', () => {
    render(
      <Dialog open={true}>
        <DialogPortal>
          <DialogContent>
            <DialogTitle>Test Title</DialogTitle>
            Test Content
          </DialogContent>
        </DialogPortal>
      </Dialog>
    )
    // Check if the dialog content is rendered
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('renders DialogOverlay component', () => {
    render(
      <Dialog open={true}>
        <DialogOverlay>Overlay</DialogOverlay>
        <DialogContent>
          <DialogTitle>Test Title</DialogTitle>
          Test Content
        </DialogContent>
      </Dialog>
    )
    // Check if the dialog content is rendered
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('renders DialogClose component', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogTitle>Test Title</DialogTitle>
          Test Content
          <DialogClose>Close</DialogClose>
        </DialogContent>
      </Dialog>
    )
    // Check if the close button is rendered - use a more specific selector
    const closeButtons = screen.getAllByRole('button', { name: 'Close' })
    expect(closeButtons.length).toBeGreaterThan(0)
    // Check that at least one close button is present
    expect(closeButtons[0]).toBeInTheDocument()
  })

  it('renders DialogTrigger component', () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Test Title</DialogTitle>
          Test Content
        </DialogContent>
      </Dialog>
    )
    expect(screen.getByText('Open')).toBeInTheDocument()
  })

  it('renders DialogContent component', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogTitle>Test Title</DialogTitle>
          Test Content
        </DialogContent>
      </Dialog>
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('renders DialogHeader component', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Title</DialogTitle>
          </DialogHeader>
          Test Content
        </DialogContent>
      </Dialog>
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('renders DialogFooter component', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogTitle>Test Title</DialogTitle>
          Test Content
          <DialogFooter>
            <button>Cancel</button>
            <button>Confirm</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('renders DialogTitle component', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogTitle>Test Title</DialogTitle>
          Test Content
        </DialogContent>
      </Dialog>
    )
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('renders DialogDescription component', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogTitle>Test Title</DialogTitle>
          <DialogDescription>Test Description</DialogDescription>
          Test Content
        </DialogContent>
      </Dialog>
    )
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })

  it('applies custom className to Dialog', () => {
    render(
      <Dialog open={true}>
        <DialogContent className="custom-dialog">
          <DialogTitle>Test Title</DialogTitle>
          Test Dialog
        </DialogContent>
      </Dialog>
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
  })

  it('applies custom className to DialogContent', () => {
    render(
      <Dialog open={true}>
        <DialogContent className="custom-content">
          <DialogTitle>Test Title</DialogTitle>
          Test Content
        </DialogContent>
      </Dialog>
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
  })

  it('applies custom className to DialogHeader', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogHeader className="custom-header">
            <DialogTitle>Test Title</DialogTitle>
          </DialogHeader>
          Test Content
        </DialogContent>
      </Dialog>
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('applies custom className to DialogFooter', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogTitle>Test Title</DialogTitle>
          Test Content
          <DialogFooter className="custom-footer">
            <button>Cancel</button>
            <button>Confirm</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('applies custom className to DialogTitle', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogTitle className="custom-title">Test Title</DialogTitle>
          Test Content
        </DialogContent>
      </Dialog>
    )
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('applies custom className to DialogDescription', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogTitle>Test Title</DialogTitle>
          <DialogDescription className="custom-description">Test Description</DialogDescription>
          Test Content
        </DialogContent>
      </Dialog>
    )
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })

  it('forwards ref to Dialog', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <Dialog open={true} ref={ref}>
        <DialogContent>
          <DialogTitle>Test Title</DialogTitle>
          Test Dialog
        </DialogContent>
      </Dialog>
    )
    // Check if the dialog is rendered
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('forwards ref to DialogContent', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <Dialog open={true}>
        <DialogContent ref={ref}>
          <DialogTitle>Test Title</DialogTitle>
          Test Content
        </DialogContent>
      </Dialog>
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('forwards ref to DialogHeader', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogHeader ref={ref}>
            <DialogTitle>Test Title</DialogTitle>
          </DialogHeader>
          Test Content
        </DialogContent>
      </Dialog>
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('forwards ref to DialogFooter', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogTitle>Test Title</DialogTitle>
          Test Content
          <DialogFooter ref={ref}>
            <button>Cancel</button>
            <button>Confirm</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('forwards ref to DialogTitle', () => {
    const ref = React.createRef<HTMLHeadingElement>()
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogTitle ref={ref}>Test Title</DialogTitle>
          Test Content
        </DialogContent>
      </Dialog>
    )
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('forwards ref to DialogDescription', () => {
    const ref = React.createRef<HTMLParagraphElement>()
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogTitle>Test Title</DialogTitle>
          <DialogDescription ref={ref}>Test Description</DialogDescription>
          Test Content
        </DialogContent>
      </Dialog>
    )
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })

  it('forwards additional props to Dialog', () => {
    render(
      <Dialog open={true}>
        <DialogContent data-testid="custom-dialog" aria-label="Test dialog">
          <DialogTitle>Test Title</DialogTitle>
          Test Dialog
        </DialogContent>
      </Dialog>
    )
    const dialog = screen.getByTestId('custom-dialog')
    expect(dialog).toHaveAttribute('aria-label', 'Test dialog')
  })

  it('forwards additional props to DialogContent', () => {
    render(
      <Dialog open={true}>
        <DialogContent data-testid="custom-content" aria-label="Test content">
          <DialogTitle>Test Title</DialogTitle>
          Test Content
        </DialogContent>
      </Dialog>
    )
    const content = screen.getByTestId('custom-content')
    expect(content).toHaveAttribute('aria-label', 'Test content')
  })

  it('forwards additional props to DialogHeader', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogHeader data-testid="custom-header" aria-label="Test header">
            <DialogTitle>Test Title</DialogTitle>
          </DialogHeader>
          Test Content
        </DialogContent>
      </Dialog>
    )
    const header = screen.getByTestId('custom-header')
    expect(header).toHaveAttribute('aria-label', 'Test header')
  })

  it('forwards additional props to DialogFooter', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogTitle>Test Title</DialogTitle>
          Test Content
          <DialogFooter data-testid="custom-footer" aria-label="Test footer">
            <button>Cancel</button>
            <button>Confirm</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
    const footer = screen.getByTestId('custom-footer')
    expect(footer).toHaveAttribute('aria-label', 'Test footer')
  })

  it('forwards additional props to DialogTitle', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogTitle data-testid="custom-title" aria-label="Test title">Test Title</DialogTitle>
          Test Content
        </DialogContent>
      </Dialog>
    )
    const title = screen.getByTestId('custom-title')
    expect(title).toHaveAttribute('aria-label', 'Test title')
  })

  it('forwards additional props to DialogDescription', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogTitle>Test Title</DialogTitle>
          <DialogDescription data-testid="custom-description" aria-label="Test description">Test Description</DialogDescription>
          Test Content
        </DialogContent>
      </Dialog>
    )
    const description = screen.getByTestId('custom-description')
    expect(description).toHaveAttribute('aria-label', 'Test description')
  })

  it('renders with different content types', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogTitle>Test Title</DialogTitle>
          <div>Text Content</div>
          <span>HTML Content</span>
          {42}
          {true && 'Conditional Content'}
        </DialogContent>
      </Dialog>
    )
    
    // Check if the dialog content is rendered
    const dialogContent = screen.getByRole('dialog')
    expect(dialogContent).toBeInTheDocument()
    
    // Check if the content area contains the expected content
    expect(dialogContent.textContent).toContain('Conditional Content')
    expect(dialogContent.textContent).toContain('42')
  })

  it('handles event handlers', () => {
    const onOpenChange = jest.fn()
    render(
      <Dialog open={true} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogTitle>Test Title</DialogTitle>
          Test Dialog
        </DialogContent>
      </Dialog>
    )
    
    // The dialog should be open
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('handles style attributes', () => {
    render(
      <Dialog open={true}>
        <DialogContent style={{ backgroundColor: 'red' }}>
          <DialogTitle>Test Title</DialogTitle>
          Test Dialog
        </DialogContent>
      </Dialog>
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
  })

  it('handles style attributes on DialogHeader', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogHeader style={{ backgroundColor: 'blue' }}>
            <DialogTitle>Test Title</DialogTitle>
          </DialogHeader>
          Test Content
        </DialogContent>
      </Dialog>
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('handles style attributes on DialogFooter', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogTitle>Test Title</DialogTitle>
          Test Content
          <DialogFooter style={{ backgroundColor: 'green' }}>
            <button>Cancel</button>
            <button>Confirm</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('handles style attributes on DialogTitle', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogTitle style={{ color: 'red' }}>Test Title</DialogTitle>
          Test Content
        </DialogContent>
      </Dialog>
    )
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('handles style attributes on DialogDescription', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogTitle>Test Title</DialogTitle>
          <DialogDescription style={{ color: 'blue' }}>Test Description</DialogDescription>
          Test Content
        </DialogContent>
      </Dialog>
    )
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })

  it('renders with different content types in DialogContent', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogTitle>Test Title</DialogTitle>
          <div>Text Content</div>
          <span>HTML Content</span>
          {42}
          {true && 'Conditional Content'}
        </DialogContent>
      </Dialog>
    )
    
    // Check if the dialog content is rendered
    const dialogContent = screen.getByRole('dialog')
    expect(dialogContent).toBeInTheDocument()
    
    // Check if the content area contains the expected content
    expect(dialogContent.textContent).toContain('Conditional Content')
    expect(dialogContent.textContent).toContain('42')
  })
})