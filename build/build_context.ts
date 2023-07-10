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
    sourcemap,
    outfile: "./dist/bookshelf-adventures.js",
    plugins: [
      copy({
        resolveFrom: "cwd",
        assets: [
          {
            from: ["./index.html"],
            to: ["./dist/index.html"],
          },
          {
            from: ["./styles.css"],
            to: ["./dist/styles.css"],
          },
        ],
        watch,
      }),
    ],
  };
};
