import { OpenAI } from "../ai/openai";

interface Feedback {
    line: number;
    message: string;
}

export default class CodeReviewer {
    private openAI: OpenAI;

    private rules: string;

    private feedbacks: Feedback[];

    private getRules(filePath: string) {
        return filePath
    };

    constructor(rulesFilePath: string) {
        this.openAI = new OpenAI();
        this.feedbacks = [];
        this.rules = this.getRules(rulesFilePath);
    }

    public getFeedbacks(): Feedback[] {
        return this.feedbacks;
    }

    public async queue(files: string[]): Promise<void> {
        // TODO: Implement file queue
    }

    public async fileParser(filePath: string): Promise<void> {
        // TODO: Implement file parsing and openAI prompt
    }

    public async printCodeReview(): Promise<void> {
        // TODO: Implement code review printing
    }
}
