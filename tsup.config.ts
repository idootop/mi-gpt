import { defineConfig } from "tsup";

export default defineConfig(() => ({
  entry: ["src/index.ts"],
  outDir: "dist",
  target: "node16",
  platform: "node",
  format: ["esm", "cjs"],
  splitting: false,
  sourcemap: false,
  treeshake: true,
  minify: true,
  clean: true,
  shims: true,
  dts: true, // Generate declaration file
}));
