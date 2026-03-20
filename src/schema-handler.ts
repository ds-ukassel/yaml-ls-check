import * as fs from 'fs';

import { URI } from 'vscode-uri';

import { isRelativePath } from 'yaml-language-server/lib/esm/languageservice/utils/paths';
import { SchemaRequestService } from 'yaml-language-server/lib/esm/languageservice/yamlLanguageService';
import { relativeToAbsolutePath, trimStartChars } from './util';

export function createSchemaRequestHandler(rootPath?: string): SchemaRequestService {
    return async (uri: string) => {
        if (!uri) {
            return Promise.reject('No schema specified');
        }

        // If the requested schema URI is a relative file path
        // Convert it into a proper absolute path URI
        if (rootPath && isRelativePath(uri)) {
            uri = relativeToAbsolutePath(rootPath, uri);
        }

        let scheme = URI.parse(uri).scheme.toLowerCase();

        // test if uri is windows path, ie starts with 'c:\'
        if (/^[a-z]:[\\/]/i.test(uri)) {
            const winUri = URI.file(uri);
            scheme = winUri.scheme.toLowerCase();
            uri = winUri.toString();
        }

        // If the requested schema is a local file, read and return the file contents
        if (scheme === 'file') {
            return new Promise<string>((callback, error) => {
                const fsPath = trimStartChars(URI.parse(uri).fsPath, '\\');

                fs.readFile(fsPath, (err, result) => {
                    // If there was an error reading the file, return empty error message
                    // Otherwise return the file contents as a string
                    if (err) {
                        console.error(`Could not find schema file at: ${fsPath}`);
                    }
                    return err ? error('') : callback(result.toString());
                });
            });
        }

        const response = await fetch(uri);
        return response.ok
            ? response.text()
            : Promise.reject(`Unable to load schema at ${uri}: ${response.statusText}`);
    };
}
