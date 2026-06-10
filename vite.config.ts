import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

/**
 * One Rollup entry per subpath module. Add a line here when a new module ships.
 * ESM uses .mjs so Node treats outputs as ESM in all contexts.
 */
const entries = {
  api: resolve(__dirname, 'src/api/index.ts'),
  'classic-editor': resolve(__dirname, 'src/classic-editor/index.ts'),
  content: resolve(__dirname, 'src/content/index.ts'),
  i18n: resolve(__dirname, 'src/i18n/index.ts'),
  log: resolve(__dirname, 'src/log/index.ts'),
  device: resolve(__dirname, 'src/device/index.ts'),
  dom: resolve(__dirname, 'src/dom/index.ts'),
  host: resolve(__dirname, 'src/host/index.ts'),
  html: resolve(__dirname, 'src/html/index.ts'),
  links: resolve(__dirname, 'src/links/index.ts'),
  'links/react': resolve(__dirname, 'src/links/react/index.ts'),
  news: resolve(__dirname, 'src/news/index.ts'),
  pagination: resolve(__dirname, 'src/pagination/index.ts'),
  react: resolve(__dirname, 'src/react/index.ts'),
  storage: resolve(__dirname, 'src/storage/index.ts'),
  text: resolve(__dirname, 'src/text/index.ts'),
  shadow: resolve(__dirname, 'src/shadow/index.ts'),
  'shadow/portal': resolve(__dirname, 'src/shadow/portal/index.ts'),
  'shadow/react': resolve(__dirname, 'src/shadow/react/index.ts'),
  widgets: resolve(__dirname, 'src/widgets/index.ts'),
  'widgets/react': resolve(__dirname, 'src/widgets/react/index.ts'),
  types: resolve(__dirname, 'src/types/content/index.ts'),
  'types/news': resolve(__dirname, 'src/types/news/index.ts'),
  'types/pages': resolve(__dirname, 'src/types/pages/index.ts'),
  'types/user': resolve(__dirname, 'src/types/user/index.ts'),
  'types/groups': resolve(__dirname, 'src/types/groups/index.ts'),
}

export default defineConfig({
  plugins: [
    dts({
      include: ['src/**/*'],
      exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
      bundleTypes: false,
      outDirs: './dist',
    }),
  ],
  build: {
    outDir: resolve(__dirname, 'dist'),
    lib: {
      entry: entries,
      formats: ['es', 'cjs'],
      fileName: (format: string, entryName: string): string =>
        format === 'es' ? `${entryName}.es.mjs` : `${entryName}.cjs.js`,
    },
    rollupOptions: {
      external: [
        '@emotion/cache',
        'dompurify',
        'react',
        'react-dom',
        'react-dom/client',
        'react/jsx-runtime',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsx',
        },
        exports: 'named',
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
})
