import type { Preview } from '@storybook/react'
import { Layout } from '@repo/ui'

import '@repo/ui/theme.css'

const preview: Preview = {
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Layout>
        <Story />
      </Layout>
    ),
  ],
}

export default preview
