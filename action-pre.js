require('child_process').spawnSync('corepack', [
    'pnpm',
    'install',
    '--prod',
], {
    stdio: "inherit",
    cwd: __dirname,
});
