import * as esbuild from "esbuild";

import { BuildOptions } from "esbuild";
import { copy } from "esbuild-plugin-copy";

export const getBuildContext = ({ outDir = "./docs" } = {}): BuildOptions => {
  return {
    entryPoints: [`./src/browser.ts`],
    bundle: true,
    minify: false,
    sourcemap: false,
    outfile: `${outDir}/bookshelf-adventures.js`,
    plugins: [
      copy({
        resolveFrom: `cwd`,
        assets: [
          {
            from: [`./src/index.html`],
            to: [`${outDir}/index.html`],
          },
          {
            from: [`./src/styles.css`],
            to: [`${outDir}/styles.css`],
          },
        ],
      }),
    ],
  };
};

esbuild.build(getBuildContext());
