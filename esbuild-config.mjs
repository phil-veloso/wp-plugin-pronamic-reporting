import path from "node:path";
import { fileURLToPath } from "url";
import fs from "fs";
import { readFileSync } from "fs";
import { build } from "esbuild";
import eslint from "esbuild-plugin-eslint";
import { copy } from "esbuild-plugin-copy";

const packageJSON = JSON.parse(readFileSync("./package.json"));
const name = packageJSON.name;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  const entryFile = path.join(__dirname, "src", "js", "index.jsx");
  const outDir = path.join(__dirname, "dist", name);

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const res = await build({
    entryPoints: [entryFile],
    bundle: true,
    minify: true,
    sourcemap: true,
    format: "iife",
    jsx: "automatic",
    outfile: path.join(outDir, "assets", "bundle.js"),
    define: {
      "process.env.NODE_ENV": "'production'",
    },
    plugins: [
      eslint(),
      copy({
        assets: [
          {
            from: ["./src/static/**/*"],
            to: [outDir],
            // disable watching mode for this assets pair only
            watch: false,
          },
          {
            from: ["./src/php/**/*"],
            to: [outDir],
            // disable watching mode for this assets pair only
            watch: false,
          },
          {
            from: ["./src/css/**/*"],
            to: [path.join(outDir, "css")],
            // disable watching mode for this assets pair only
            watch: false,
          },
          {
            from: ["./src/js/**/*"],
            to: [path.join(outDir, "app")],
            // disable watching mode for this assets pair only
            watch: false,
          },
        ],
      }),
    ],
  });
})();
