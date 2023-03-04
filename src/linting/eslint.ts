import fs from 'fs';
import chalk from 'chalk'
import { ESLint } from 'eslint';
import { Language } from '../../types';



export class EsLint {
    private language: Language;

    constructor(projectPath: string) {
        this.language = this.getLanguageType(projectPath) as Language;
    }

    private getEslintConfig(): Record<string, unknown> {
        if (this.language === Language.JAVASCRIPT) {
            return {
                parserOptions: {
                    ecmaVersion: 2018,
                    sourceType: 'module',
                },
                extends: [
                    'eslint:recommended',
                ],
                rules: {
                    // add specific rules here
                },
            };
        } else if (this.language === Language.TYPESCRIPT) {
            return {
                parser: '@typescript-eslint/parser',
                parserOptions: {
                    ecmaVersion: 2018,
                    sourceType: 'module',
                    project: './tsconfig.json',
                },
                extends: [
                    'eslint:recommended',
                    'plugin:@typescript-eslint/recommended',
                ],
                rules: {
                    // add specific rules here
                },
            };
        } else {
            throw new Error(`Unsupported language: ${this.language}`);
        }
    }

    private getLanguageType(projectPath: string): string {
        const files = fs.readdirSync(projectPath);
        const hasTypeScriptFiles = files.some((fileName) => {
            const extension = fileName.split('.').pop();
            return extension === 'ts' || extension === 'tsx';
        });
        return hasTypeScriptFiles ? Language.TYPESCRIPT : Language.JAVASCRIPT;
    }

    private async getEslintResults(projectFiles: string[]) {
        const eslintConfig = this.getEslintConfig();

        const eslint = new ESLint({
            baseConfig: eslintConfig,
        });


        const results = await eslint.lintFiles(projectFiles);

        return ESLint.getErrorResults(results);
    }

    private getFilesInDirectory(projectPath: string, extensions: string[]): string[] {
        const files = fs.readdirSync(projectPath);
        const projectFiles: string[] = [];

        files.forEach((file) => {
            const filePath = `${projectPath}/${file}`;
            const isDirectory = fs.lstatSync(filePath).isDirectory();
            const isSupportedFile = extensions.some((extension) => file.endsWith(extension));

            if (isDirectory) {
                const subFiles = this.getFilesInDirectory(filePath, extensions);
                projectFiles.push(...subFiles);
            } else if (isSupportedFile) {
                projectFiles.push(filePath);
            }
        });

        return projectFiles;
    }

    public logFeedBack(results: ESLint.LintResult[]) {
        results.forEach((result) => {
            const { filePath, errorCount, warningCount } = result;
            const hasErrors = errorCount > 0;
            const hasWarnings = warningCount > 0;

            if (!hasErrors && !hasWarnings) {
                console.log(chalk.green(`No issues found in ${filePath}`));
            } else {
                console.log(chalk.red(`Issues found in ${filePath}:`));
                result.messages.forEach((message) => {
                    const severity = message.severity === 2 ? 'Error' : 'Warning';
                    console.log(chalk.yellow(`  ${severity}: ${message.ruleId} - ${message.message} (${message.line}:${message.column})`));
                });
            }
        });
    }

    public async lint(projectPath: string) {
        if (!fs.existsSync(projectPath)) {
            throw new Error(`Directory not found: ${projectPath}`);
        }

        if (!fs.lstatSync(projectPath).isDirectory()) {
            throw new Error(`Invalid project path: ${projectPath}`);
        }

        const isTypescript = this.language === Language.TYPESCRIPT;
        const extensions = isTypescript ? ['.ts', '.tsx'] : ['.js', '.jsx'];

        const projectFiles = this.getFilesInDirectory(projectPath, extensions);

        if (projectFiles.length === 0) {
            throw new Error(`No supported files found in directory: ${projectPath}`);
        }

        return await this.getEslintResults(projectFiles);
    }
}
