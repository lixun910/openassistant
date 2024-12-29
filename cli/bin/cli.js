#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';

async function main() {
  try {
    // Get target directory
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'directory',
        message: 'Where should we add the AI chat components?',
        default: './src/components',
      },
      {
        type: 'confirm',
        name: 'typescript',
        message: 'Are you using TypeScript?',
        default: true,
      },
    ]);

    const targetDir = path.resolve(process.cwd(), answers.directory);
    const extension = answers.typescript ? '.tsx' : '.jsx';

    // Create target directory if it doesn't exist
    await fs.ensureDir(targetDir);

    // Copy template files
    const templateDir = path.join(__dirname, './node_modules/@openassistant/ui/src/components');
    const files = await fs.readdir(templateDir);

    for (const file of files) {
      const sourcePath = path.join(templateDir, file);
      const targetPath = path.join(
        targetDir,
        file.replace('.tsx', extension)
      );

      await fs.copy(sourcePath, targetPath);
      console.log(
        chalk.green(`✓ Created ${path.relative(process.cwd(), targetPath)}`)
      );
    }

    // Print success message and next steps
    console.log('\n' + chalk.green('Success! 🎉 AI chat components have been added.'));
    console.log('\nNext steps:');
    console.log('1. Install required dependencies:');
    console.log(chalk.cyan('   npm install @react-ai-assist/core @nextui-org/react framer-motion next-themes html2canvas'));
    console.log('\n2. Import and use the AI Assistant component:');
    console.log(chalk.cyan(`
   import { AiAssistant } from './components/assistant';

   function App() {
     return (
       <AiAssistant
         modelProvider="openai"
         model="gpt-4"
         apiKey="your-api-key"
         welcomeMessage="Hello! How can I help you today?"
       />
     );
   }
    `));

  } catch (error) {
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

main();
