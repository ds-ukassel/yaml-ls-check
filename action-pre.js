const cwd = process.cwd();
require('child_process').spawnSync('corepack', [
    'pnpm',
    'install',
    '--prod',
], {stdio: [0, 1, 2], cwd});
