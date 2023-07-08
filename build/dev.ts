import * as esbuild from 'esbuild'
import { getBuildContext } from './build_context';

(async () => {
  const ctx = await esbuild.context(getBuildContext(true))
  await ctx.watch()

  const { host, port } = await ctx.serve({
    servedir: 'dist',
  })

  console.log({ host, port });
})();