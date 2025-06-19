#!/usr/bin/env node

import { Command } from 'commander';
import inquirer from 'inquirer';
import { Parser } from './parser';
import { Generator } from './generator';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import figlet from 'figlet';
import { OutputFormat } from './types';

const program = new Command();

interface InteractiveOptions {
  schemaFile: string;
  interfaceName: string;
  count: number;
  format: OutputFormat;
  saveToFile: boolean;
  fileName?: string;
}

function showWelcome() {
  console.log(chalk.cyan(figlet.textSync('TSMocker', { horizontalLayout: 'full' })));
  console.log(chalk.gray('Generate realistic mock data from TypeScript interfaces\n'));
}

function findTsFiles(dir: string = process.cwd()): string[] {
  const files: string[] = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules' && item !== 'dist') {
        files.push(...findTsFiles(fullPath));
      } else if (item.endsWith('.ts') && !item.endsWith('.d.ts')) {
        const relativePath = path.relative(process.cwd(), fullPath);
        files.push(relativePath);
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not scan directory ${dir}`);
  }
  
  return files;
}

function findInterfaces(filePath: string): string[] {
  try {
    const parser = new Parser();
    const absolutePath = path.resolve(process.cwd(), filePath);
    const sourceFile = parser.getProject().addSourceFileAtPath(absolutePath);
    return sourceFile.getInterfaces().map(interfaceDecl => interfaceDecl.getName() || 'Unknown');
  } catch (error) {
    console.warn(`Warning: Could not parse interfaces from ${filePath}`);
    return [];
  }
}

async function runInteractive(): Promise<void> {
  showWelcome();
  
  const tsFiles = findTsFiles();
  
  if (tsFiles.length === 0) {
    console.log(chalk.red('❌ No TypeScript files found in the current directory!'));
    console.log(chalk.yellow('💡 Make sure you have .ts files with interfaces in your project.'));
    return;
  }

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'schemaFile',
      message: '📁 Select TypeScript file:',
      choices: tsFiles,
      pageSize: 10,
    },
  ]);

  const interfaces = findInterfaces(answers.schemaFile);
  
  if (interfaces.length === 0) {
    console.log(chalk.red(`❌ No interfaces found in ${answers.schemaFile}!`));
    console.log(chalk.yellow('💡 Make sure the file contains exported interfaces.'));
    return;
  }

  const options = await inquirer.prompt([
    {
      type: 'list',
      name: 'interfaceName',
      message: '🔧 Select interface to mock:',
      choices: interfaces,
    },
    {
      type: 'number',
      name: 'count',
      message: '🔢 How many objects to generate?',
      default: 1,
      validate: (input) => (input && input > 0) ? true : 'Please enter a number greater than 0',
    },
    {
      type: 'list',
      name: 'format',
      message: '📄 Output format:',
      choices: [
        { name: '📋 JSON (Pretty formatted)', value: 'json' },
        { name: '📊 CSV (Spreadsheet format)', value: 'csv' },
      ],
    },
    {
      type: 'confirm',
      name: 'saveToFile',
      message: '💾 Save to file?',
      default: true,
    },
  ]);

  let fileName: string | undefined;
  if (options.saveToFile) {
    const fileAnswer = await inquirer.prompt([
      {
        type: 'input',
        name: 'fileName',
        message: '📝 File name:',
        default: `mock-${options.interfaceName.toLowerCase()}.${options.format}`,
        validate: (input) => input.trim() ? true : 'Please enter a file name',
      },
    ]);
    fileName = fileAnswer.fileName;
  }

  await generateMockData({
    schemaFile: answers.schemaFile,
    interfaceName: options.interfaceName,
    count: options.count,
    format: options.format,
    saveToFile: options.saveToFile,
    fileName,
  });
}

async function generateMockData(options: InteractiveOptions): Promise<void> {
  try {
    console.log(chalk.blue(`\n🔍 Parsing interface "${options.interfaceName}" from ${options.schemaFile}...`));

    const parser = new Parser();
    const interfaceInfo = parser.parseFile(options.schemaFile, options.interfaceName);

    console.log(chalk.green(`✅ Found interface with ${interfaceInfo.properties.length} properties`));

    const generator = new Generator();
    const mockData = generator.generateMockData(interfaceInfo, options.count);

    console.log(chalk.blue(`🎲 Generated ${mockData.length} mock object${mockData.length > 1 ? 's' : ''}`));

    const output = generator.formatOutput(mockData, options.format);

    if (options.saveToFile && options.fileName) {
      fs.writeFileSync(options.fileName, output);
      console.log(chalk.green(`💾 Output written to ${options.fileName}`));
      console.log(chalk.gray(`   File size: ${(output.length / 1024).toFixed(1)} KB`));
    } else {
      console.log(chalk.cyan('\n📄 Generated Data:'));
      console.log(output);
    }

    console.log(chalk.green('\n🎉 Mock data generated successfully!'));
    
    const continueAnswer = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'continue',
        message: '🔄 Generate more mock data?',
        default: false,
      },
    ]);

    if (continueAnswer.continue) {
      await runInteractive();
    }

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    console.log(chalk.red('\n❌ Error occurred:'));
    if (errorMessage.includes('not found')) {
      console.log(chalk.red(`   Interface "${options.interfaceName}" not found in ${options.schemaFile}`));
      console.log(chalk.yellow('   💡 Check the interface name and make sure it exists in the file.'));
    } else if (errorMessage.includes('parse')) {
      console.log(chalk.red(`   Failed to parse TypeScript file: ${errorMessage}`));
      console.log(chalk.yellow('   💡 Make sure the file contains valid TypeScript interfaces.'));
    } else {
      console.log(chalk.red(`   ${errorMessage}`));
    }
  }
}

program
  .name('tsmocker')
  .description('Generate realistic mock data from TypeScript interfaces')
  .version('1.0.0')
  .option('-s, --schema <path>', 'Path to TypeScript file containing interfaces')
  .option('-i, --interface <name>', 'Name of the interface to mock')
  .option('-c, --count <number>', 'Number of mock objects to generate', '1')
  .option('-o, --output <format>', 'Output format (json or csv)', 'json')
  .option('-f, --out-file <path>', 'Output file path')
  .option('--interactive', 'Run in interactive mode (default if no options provided)')
  .action(async (options) => {
    if (!options.schema && !options.interface) {
      await runInteractive();
      return;
    }

    if (!options.schema || !options.interface) {
      console.log(chalk.red('❌ Both --schema and --interface are required for command line mode'));
      console.log(chalk.yellow('💡 Run without options for interactive mode, or use --help for details'));
      return;
    }

    const count = parseInt(options.count);
    if (isNaN(count) || count < 1) {
      console.log(chalk.red(`❌ Invalid count: ${options.count}. Must be a positive number.`));
      return;
    }

    await generateMockData({
      schemaFile: options.schema,
      interfaceName: options.interface,
      count,
      format: options.output as OutputFormat,
      saveToFile: !!options.outFile,
      fileName: options.outFile,
    });
  });

program.parse(process.argv); 