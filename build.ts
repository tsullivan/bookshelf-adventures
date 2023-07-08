import * as esbuild from 'esbuild'
import { copy } from 'esbuild-plugin-copy';

(async () => {
  const ctx = await esbuild.context({
    entryPoints: ['./src/browser.ts'],
    bundle: true,
    minify: true,
    sourcemap: 'external',
    outfile: './dist/main.js',
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
        watch: true,
      }),
    ],
  })
  await ctx.watch()
  const { host, port } = await ctx.serve({
    servedir: 'dist',
  })
  console.log({ host, port });
})();