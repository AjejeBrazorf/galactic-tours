import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { Button } from '@repo/ui'

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
}

export default meta

type Story = StoryObj<typeof Button>

type StoryArgs = {
  label: string
  dataTestId: string
}

const playFunction = async (
  { label, dataTestId }: StoryArgs,
  canvasElement: HTMLElement
) => {
  const canvas = within(canvasElement)
  const button = await canvas.findByTestId(dataTestId)
  await expect(button).toBeInTheDocument()
  await expect(button).toHaveTextContent(label)
  await userEvent.click(button)
}

const PRIMARY_BUTTON = {
  label: "That's the primary!",
  dataTestId: 'primary-button',
} as StoryArgs

export const Primary: Story = {
  args: {
    children: PRIMARY_BUTTON.label,
    dataTestId: PRIMARY_BUTTON.dataTestId,
    onClick: () => console.log('primary button clicked'),
    variant: 'primary',
  },
  play: async ({ canvasElement }) =>
    await playFunction(PRIMARY_BUTTON, canvasElement),
}

const SECONDARY_BUTTON = {
  label: "That's the secondary!",
  dataTestId: 'secondary-button',
} as StoryArgs

export const Secondary: Story = {
  args: {
    children: SECONDARY_BUTTON.label,
    dataTestId: SECONDARY_BUTTON.dataTestId,
    onClick: () => console.log('button clicked'),
    variant: 'secondary',
  },
  play: async ({ canvasElement }) =>
    await playFunction(SECONDARY_BUTTON, canvasElement),
}
