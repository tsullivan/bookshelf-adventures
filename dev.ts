import * as esbuild from 'esbuild'
import { getBuildContext } from './build';

(async () => {
  const context = getBuildContext();
  context.sourcemap = "linked";
  const ctx = await esbuild.context(context)
  await ctx.watch()

  const { host, port } = await ctx.serve({
    servedir: 'docs',
  })

  console.log({ host, port });
})();
