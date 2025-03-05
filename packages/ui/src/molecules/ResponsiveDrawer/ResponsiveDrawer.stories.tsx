import { Button } from '@galactic-tours/ui'
import type { Meta, StoryObj } from '@storybook/react'

import { ResponsiveDrawer } from './ResponsiveDrawer'

const meta: Meta<typeof ResponsiveDrawer> = {
  title: 'Organisms/ResponsiveDrawer',
  component: ResponsiveDrawer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ResponsiveDrawer>

export const Default: Story = {
  args: {
    open: true,
    onClose: () => console.log('Drawer closed'),
    children: (
      <div style={{ padding: '20px' }}>
        <h2>Drawer Content</h2>
        <p>This is the content of the drawer.</p>
        <p>Drag the handle at the top to resize on mobile.</p>
        <div
          style={{
            height: '1000px',
            background: 'linear-gradient(to bottom, #f0f0f0, #ffffff)',
          }}>
          <p>Scrollable content</p>
        </div>
      </div>
    ),
  },
}

export const WithActions: Story = {
  args: {
    open: true,
    onClose: () => console.log('Drawer closed'),
    children: (
      <div style={{ padding: '20px' }}>
        <h2>Drawer with Actions</h2>
        <p>This drawer has action buttons at the bottom.</p>
        <div
          style={{
            height: '1000px',
            background: 'linear-gradient(to bottom, #f0f0f0, #ffffff)',
          }}>
          <p>Scrollable content</p>
        </div>
      </div>
    ),
    actions: (
      <>
        <Button variant='secondary' onClick={() => alert('Cancel clicked')}>
          Cancel
        </Button>
        <Button variant='primary' onClick={() => alert('Confirm clicked')}>
          Confirm
        </Button>
      </>
    ),
  },
}

export const Closed: Story = {
  args: {
    open: false,
    children: (
      <div style={{ padding: '20px' }}>
        <h2>Closed Drawer</h2>
        <p>This drawer starts in a closed state.</p>
      </div>
    ),
  },
}
