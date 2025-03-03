import type { StorybookConfig } from '@storybook/react-vite'

import { resolve } from 'path'

const config: StorybookConfig = {
  stories: [
    '../src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../../../packages/ui/src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
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

    config.resolve.alias['@galactic-tours/ui'] = resolve(
      __dirname,
      '../../../packages/ui/dist'
    )

    config.resolve.alias['@galactic-tours/ui/theme.css'] = resolve(
      __dirname,
      '../../../packages/ui/dist/theme.css'
    )

    return config
  },
}

export default config
