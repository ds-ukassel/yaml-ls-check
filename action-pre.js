const cwd = process.cwd();
console.log(cwd);
require('child_process').spawnSync('npm', [
    'install',
    'vscode-json-languageservice',
    'jsonc-parser'
], {stdio: [0, 1, 2], cwd});
