import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

/**
 * One Rollup entry per subpath module. Add a line here when a new module ships.
 * ESM uses .mjs so Node treats outputs as ESM in all contexts.
 */
const entries = {
  log: resolve(__dirname, 'src/log/index.ts'),
  device: resolve(__dirname, 'src/device/index.ts'),
  html: resolve(__dirname, 'src/html/index.ts'),
  links: resolve(__dirname, 'src/links/index.ts'),
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
