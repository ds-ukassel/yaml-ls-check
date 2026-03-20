import {build} from "esbuild";
import {rm} from "node:fs/promises";

const outdir = "github-action/dist";

await rm(outdir, {recursive: true, force: true});

/*
 * This does not work and probably will never.
 * See https://github.com/ds-ukassel/yaml-ls-check/pull/10
 * Kept here so noone ever attempts it.
 */
await build({
    entryPoints: ["github-action/index.ts"],
    outfile: "github-action/dist/index.mjs",

    bundle: true,
    minify: false,
    treeShaking: true,
    lineLimit: 120,

    platform: "node",
    target: "node24",
    format: "esm",
    packages: "external",

    sourcemap: false,
    logLevel: "info",
});
