import cli from 'argparse';
import { AutoReviewer } from './src/index';
const chalk = require('chalk');

/**
 * Show the welcome message to the user
 */
const showWelcomeMessage = () => {
    const welcomeText = `
        =======================================================
        
            Welcome to AutoReviewer - Your Code Review Helper

        =======================================================
    `;
    console.log(chalk.red.bold(welcomeText));
}

showWelcomeMessage();

const parser = new cli.ArgumentParser({
    description: 'Auto Reviewer CLI Tool',
});

parser.add_argument('--path', {
    help: 'Path to the project',
})

parser.add_argument('--lint', {
    help: 'Lint the project',
});


const args = parser.parse_args();

if (args.path) {
    const autoReviewer = new AutoReviewer(args);
    console.log(`Linting ${args.path}`);
    autoReviewer.lint(args.path);
}


