import type { StorybookConfig } from '@storybook/react-vite'

import { resolve } from 'path'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: (config) => {
    if (!config.resolve) config.resolve = {}
    if (!config.resolve.alias) config.resolve.alias = {}

    config.resolve.alias['@repo/ui'] = resolve(
      __dirname,
      '../../../packages/ui/dist/index.mjs'
    )

    return config
  },
}

export default config
