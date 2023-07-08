import { BuildOptions } from 'esbuild'
import { copy } from 'esbuild-plugin-copy';

export const getBuildContext = (watch = false): BuildOptions => ({
    entryPoints: ['./src/browser.ts'],
    bundle: true,
    minify: true,
    sourcemap: 'external',
    outfile: './dist/bookshelf-adventures.js',
    plugins: [
      copy({
        resolveFrom: 'cwd',
        assets: [{
          from: ['./index.html'],
          to: ['./dist/index.html'],
        }, {
          from: ['./styles.css'],
          to: ['./dist/styles.css'],
        }],
        watch,
      }),
    ],
  })