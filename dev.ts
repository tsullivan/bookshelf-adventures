import * as esbuild from 'esbuild'
import { getBuildContext } from './build';

(async () => {
  const devOutDir = './docs/dev';

  const context = getBuildContext({ outDir: devOutDir });
  context.sourcemap = "linked";

  const ctx = await esbuild.context(context)
  await ctx.watch()

  const { host, port } = await ctx.serve({
    servedir: devOutDir,
  })

  console.log({ host, port });
})();
