const cwd = process.cwd();
require('child_process').spawnSync('npm', [
    'install',
    '-g',
    'vscode-json-languageservice',
    'jsonc-parser'
], {stdio: [0, 1, 2], cwd});
