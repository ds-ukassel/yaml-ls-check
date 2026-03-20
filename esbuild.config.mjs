import {build} from "esbuild";
import {rm} from "node:fs/promises";

const outdir = "github-action/dist";

await rm(outdir, {recursive: true, force: true});

await build({
    entryPoints: ["github-action/index.ts"],
    outfile: "github-action/dist/index.js",

    bundle: true,
    minify: true,
    treeShaking: true,
    lineLimit: 120,

    platform: "node",
    target: "node24",
    format: "cjs",
    packages: "bundle",
    mainFields: ["module", "main"],
    external: [
        "vscode-json-languageservice",
        "jsonc-parser",
    ],

    sourcemap: false,
    legalComments: 'inline',
    logLevel: "info",
});
