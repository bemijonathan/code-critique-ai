import { EsLinter } from './linting';
// import { Docker } from './docker';
// import { Testing } from './testing';
// import { Logging } from './logging';

export class AutoReviewer {
    // private docker: Docker;
    // private testing: Testing;
    private linting: EsLinter;

    constructor(args: Record<string, string>) {
        if (!args.path) {
            throw new Error('Path to project is required');
        }
        // this.docker = new Docker();
        // this.testing = new Testing();
        this.linting = new EsLinter(args.path);
    }

    public async lint(filePath: string) {
        const result = await this.linting.lint(filePath);
        this.linting.logFeedBack(result);
    }

    // public async buildDockerImage(tag: string, filePath: string) {
    //     await this.docker.build(tag, filePath);
    //     this.logging.logDockerBuildSuccess(tag, filePath);
    // }

    // public async runTests(filePath: string) {
    //     const result = await this.testing.run(filePath);
    //     this.logging.logTestResults(result, filePath);
    // }

    // public async runAll(filePath: string, tag: string) {
    //     await this.lint(filePath);
    //     await this.buildDockerImage(tag, filePath);
    //     await this.runTests(filePath);
    // }
}