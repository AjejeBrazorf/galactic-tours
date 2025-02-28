import { config } from '@repo/eslint-config/react'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [config],
  }
)
