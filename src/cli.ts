#!/usr/bin/env node

import { validateDirectory, validateWithSchema } from './lib';
import { program } from 'commander';

async function run() {
    program
        .command('dir', { isDefault: true })
        .argument('<root-directory>')
        .argument('[exclude-patterns...]', 'glob patterns for YAML files to be excluded from validation', [])
        .option('--yamlVersion', 'YAML version to use for validation')
        .description('Validate YAML files of a directory.')
        .action(async (rootPath, excludePatterns, options) => {
            if (rootPath) {
                const errors = await validateDirectory({ yamlVersion: options.yamlVersion }, rootPath, excludePatterns);
                if (errors !== undefined && errors.length > 0) {
                    process.exit(1);
                }
            }
        });

    program
        .command('schema')
        .argument('<schema>', 'schema to use for validation')
        .argument('<patterns...>', 'glob patterns for YAML files to be validated')
        .option('--yamlVersion', 'YAML version to use for validation')
        .description('Validate YAML files against the given schema path or URI.')
        .action(async (schema, files, options) => {
            const errors = await validateWithSchema({ yamlVersion: options.yamlVersion }, schema, files);
            if (errors !== undefined && errors.length > 0) {
                process.exit(1);
            }
        });

    if (!process.argv.slice(2).length) {
        program.outputHelp();
        return;
    }

    program.parse(process.argv);
}

(async function () {
    await run();
})();
