import { BuildOptions } from "esbuild";
import { copy } from "esbuild-plugin-copy";

export const getBuildContext = (dev = false): BuildOptions => {
  let watch = false;
  let sourcemap: BuildOptions["sourcemap"] = false;
  if (dev) {
    watch = true;
    sourcemap = "linked";
  }
  return {
    entryPoints: ["./src/js/browser.ts"],
    bundle: true,
    minify: false,
    sourcemap: false && sourcemap, // FIXME
    outfile: "./dist/bookshelf-adventures.js",
    plugins: [
      copy({
        resolveFrom: "cwd",
        assets: [
          {
            from: ["./src/index.html"],
            to: ["./dist/index.html"],
          },
          {
            from: ["./src/styles.css"],
            to: ["./dist/styles.css"],
          },
        ],
        watch,
      }),
    ],
  };
};
