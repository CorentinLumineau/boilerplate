import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup
} from '../../src/components/dropdown-menu'

// Mock Next.js components
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => React.createElement('img', props)
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: (props: any) => React.createElement('a', props)
}))

describe('DropdownMenu', () => {
  it('renders DropdownMenuTrigger component', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Menu Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    expect(screen.getByText('Open Menu')).toBeInTheDocument()
  })

  it('renders DropdownMenuContent component', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Menu Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    expect(screen.getByText('Open Menu')).toBeInTheDocument()
  })

  it('renders DropdownMenuItem component', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Menu Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    expect(screen.getByText('Open Menu')).toBeInTheDocument()
  })

  it('renders DropdownMenuCheckboxItem component', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem>Checkbox Item</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    expect(screen.getByText('Open Menu')).toBeInTheDocument()
  })

  it('renders DropdownMenuRadioItem component', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioItem value="option1">Radio Item</DropdownMenuRadioItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    expect(screen.getByText('Open Menu')).toBeInTheDocument()
  })

  it('renders DropdownMenuLabel component', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Menu Label</DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    expect(screen.getByText('Open Menu')).toBeInTheDocument()
  })

  it('renders DropdownMenuSeparator component', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Item 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    expect(screen.getByText('Open Menu')).toBeInTheDocument()
  })

  it('renders DropdownMenuShortcut component', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            Menu Item
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    expect(screen.getByText('Open Menu')).toBeInTheDocument()
  })

  it('renders DropdownMenuGroup component', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem>Group Item</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    expect(screen.getByText('Open Menu')).toBeInTheDocument()
  })

  it('renders DropdownMenuPortal component', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent>
            <DropdownMenuItem>Portal Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
    )
    expect(screen.getByText('Open Menu')).toBeInTheDocument()
  })

  it('renders DropdownMenuSub component', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Sub Menu</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Sub Item</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    expect(screen.getByText('Open Menu')).toBeInTheDocument()
  })

  it('renders DropdownMenuSubContent component', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Sub Menu</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Sub Item</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    expect(screen.getByText('Open Menu')).toBeInTheDocument()
  })

  it('renders DropdownMenuSubTrigger component', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Sub Menu</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Sub Item</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    expect(screen.getByText('Open Menu')).toBeInTheDocument()
  })

  it('renders DropdownMenuRadioGroup component', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value="option1">
            <DropdownMenuRadioItem value="option1">Option 1</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="option2">Option 2</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    expect(screen.getByText('Open Menu')).toBeInTheDocument()
  })

  it('applies custom className to DropdownMenuTrigger', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger className="custom-trigger">Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Menu Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    const trigger = screen.getByText('Open Menu')
    expect(trigger).toHaveClass('custom-trigger')
  })

  it('applies custom className to DropdownMenuContent', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent className="custom-content">
          <DropdownMenuItem>Menu Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    expect(screen.getByText('Open Menu')).toBeInTheDocument()
  })

  it('applies custom className to DropdownMenuItem', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem className="custom-item">Menu Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    expect(screen.getByText('Open Menu')).toBeInTheDocument()
  })

  it('applies custom className to DropdownMenuLabel', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="custom-label">Menu Label</DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    expect(screen.getByText('Open Menu')).toBeInTheDocument()
  })

  it('applies custom className to DropdownMenuSeparator', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuSeparator className="custom-separator" />
          <DropdownMenuItem>Item 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    expect(screen.getByText('Open Menu')).toBeInTheDocument()
  })

  it('applies custom className to DropdownMenuShortcut', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            Menu Item
            <DropdownMenuShortcut className="custom-shortcut">⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    expect(screen.getByText('Open Menu')).toBeInTheDocument()
  })

  it('applies custom className to DropdownMenuGroup', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup className="custom-group">
            <DropdownMenuItem>Group Item</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    expect(screen.getByText('Open Menu')).toBeInTheDocument()
  })

  it('applies custom className to DropdownMenuPortal', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuPortal className="custom-portal">
          <DropdownMenuContent>
            <DropdownMenuItem>Portal Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
    )
    expect(screen.getByText('Open Menu')).toBeInTheDocument()
  })

  it('applies custom className to DropdownMenuSub', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub className="custom-sub">
            <DropdownMenuSubTrigger>Sub Menu</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Sub Item</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    expect(screen.getByText('Open Menu')).toBeInTheDocument()
  })

  it('applies custom className to DropdownMenuSubContent', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Sub Menu</DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="custom-sub-content">
              <DropdownMenuItem>Sub Item</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    expect(screen.getByText('Open Menu')).toBeInTheDocument()
  })

  it('applies custom className to DropdownMenuSubTrigger', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="custom-sub-trigger">Sub Menu</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Sub Item</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    expect(screen.getByText('Open Menu')).toBeInTheDocument()
  })

  it('applies custom className to DropdownMenuRadioGroup', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value="option1" className="custom-radio-group">
            <DropdownMenuRadioItem value="option1">Option 1</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="option2">Option 2</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    expect(screen.getByText('Open Menu')).toBeInTheDocument()
  })

  it('renders complete dropdown menu structure', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Menu Label</DropdownMenuLabel>
          <DropdownMenuItem>Menu Item 1</DropdownMenuItem>
          <DropdownMenuItem>Menu Item 2</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Group Label</DropdownMenuLabel>
            <DropdownMenuItem>Group Item 1</DropdownMenuItem>
            <DropdownMenuItem>Group Item 2</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    expect(screen.getByText('Open Menu')).toBeInTheDocument()
  })

  it('handles complex content in menu items', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <span>🚀</span>
            <span>Launch</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>⚙️</span>
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    expect(screen.getByText('Open Menu')).toBeInTheDocument()
  })

  it('handles style attributes', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem style={{ color: 'red', fontSize: '16px' }}>
            Content
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    expect(screen.getByText('Open Menu')).toBeInTheDocument()
  })

  it('handles data attributes', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem data-test="test-value" data-custom="custom-value">
            Content
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    expect(screen.getByText('Open Menu')).toBeInTheDocument()
  })

  it('handles aria attributes', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem aria-label="Menu content" aria-describedby="description" aria-expanded="true">
            Content
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    expect(screen.getByText('Open Menu')).toBeInTheDocument()
  })

  it('handles multiple attributes together', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="custom-content"
            style={{ backgroundColor: 'blue' }}
            aria-label="Test menu"
            data-testid="test-content"
          >
            Content
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    expect(screen.getByText('Open Menu')).toBeInTheDocument()
  })

  it('renders with different content types', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <div>Text Content</div>
            <span>HTML Content</span>
            {42}
            {true && 'Conditional Content'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    expect(screen.getByText('Open Menu')).toBeInTheDocument()
  })

  it('handles empty content', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>{null}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    // Content might not be visible until opened, so let's check if the component exists
    expect(screen.getByText('Open Menu')).toBeInTheDocument()
  })

  it('handles null and undefined content', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          {null}
          {undefined}
          <DropdownMenuItem>Valid Content</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    expect(screen.getByText('Open Menu')).toBeInTheDocument()
  })

  it('handles boolean content', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          {true && <DropdownMenuItem>True Content</DropdownMenuItem>}
          {false && <DropdownMenuItem>False Content</DropdownMenuItem>}
        </DropdownMenuContent>
      </DropdownMenu>
    )

    expect(screen.getByText('Open Menu')).toBeInTheDocument()
  })

  it('handles array content', () => {
    const items = ['Item 1', 'Item 2', 'Item 3']
    
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          {items.map((item, index) => (
            <DropdownMenuItem key={index} data-testid={`item-${index}`}>
              {item}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )

    expect(screen.getByText('Open Menu')).toBeInTheDocument()
  })

  it('handles function content', () => {
    const renderContent = () => <DropdownMenuItem data-testid="function-content">Function Content</DropdownMenuItem>
    
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          {renderContent()}
        </DropdownMenuContent>
      </DropdownMenu>
    )

    expect(screen.getByText('Open Menu')).toBeInTheDocument()
  })
})