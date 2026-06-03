import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

/** Resolve plugin paths so Prettier finds them under Yarn PnP (no physical node_modules). */
const plugins = [
  require.resolve('prettier-plugin-organize-imports'),
  require.resolve('prettier-plugin-css-order'),
]

export default {
  trailingComma: 'all',
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  plugins,
}
