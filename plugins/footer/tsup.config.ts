import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "components/index": "src/components/index.ts",
  },
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  target: "es2022",
  splitting: false,
  outDir: "dist",
  esbuildOptions(options) {
    options.jsx = "automatic";
    options.jsxImportSource = "preact";
  },
  esbuildPlugins: [
    {
      name: "text-loader",
      setup(build) {
        build.onLoad({ filter: /\.scss$/ }, async (args) => {
          const sass = await import("sass");
          const result = sass.compile(args.path);
          return { contents: result.css, loader: "text" };
        });

        build.onLoad({ filter: /\.inline\.ts$/ }, async (args) => {
          const fs = await import("fs");
          const text = await fs.promises.readFile(args.path, "utf8");
          return {
            contents: text,
            loader: "text",
          };
        });
      },
    },
  ],
});
