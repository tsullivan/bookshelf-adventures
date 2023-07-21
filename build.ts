import * as esbuild from 'esbuild'

import { BuildOptions } from "esbuild";
import { copy } from "esbuild-plugin-copy";

export const getBuildContext = (): BuildOptions => {
  return {
    entryPoints: ["./src/browser.ts"],
    bundle: true,
    minify: false,
    sourcemap: false,
    outfile: "./docs/bookshelf-adventures.js",
    plugins: [
      copy({
        resolveFrom: "cwd",
        assets: [
          {
            from: ["./src/index.html"],
            to: ["./docs/index.html"],
          },
          {
            from: ["./src/styles.css"],
            to: ["./docs/styles.css"],
          },
        ],
      }),
    ],
  };
};

esbuild.build(getBuildContext())
