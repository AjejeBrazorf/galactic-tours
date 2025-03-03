import { config } from '@galactic-tours/eslint-config/react'
import tseslint from 'typescript-eslint'

export default tseslint.config({
  extends: [config],
})
