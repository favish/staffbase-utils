import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

/** Resolve plugin paths so Prettier finds them regardless of the install layout. */
const plugins = [require.resolve('prettier-plugin-organize-imports')]

export default {
  trailingComma: 'all',
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  plugins,
}
