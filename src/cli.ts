#!/usr/bin/env node

import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { Parser } from './parser';
import { Generator } from './generator';
import { CommandOptions, OutputFormat } from './types';

// Get package version from package.json
const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')
);

const program = new Command();

program
  .name('tsmocker')
  .description('Generate mock data from TypeScript interfaces')
  .version(packageJson.version);

program
  .requiredOption('-s, --schema <file>', 'Path to TypeScript file containing interfaces')
  .requiredOption('-i, --interface <name>', 'Name of the interface to mock')
  .option('-c, --count <number>', 'Number of mock objects to generate', '1')
  .option('-o, --output <format>', 'Output format (json or csv)', 'json')
  .option('-f, --out-file <file>', 'Output file path (if not specified, prints to stdout)');

program.parse(process.argv);

const run = async () => {
  try {
    const options = program.opts() as CommandOptions;
    
    // Validate options
    if (!fs.existsSync(options.schema)) {
      console.error(`Error: Schema file not found: ${options.schema}`);
      process.exit(1);
    }

    if (!['json', 'csv'].includes(options.output)) {
      console.error(`Error: Invalid output format: ${options.output}. Use 'json' or 'csv'.`);
      process.exit(1);
    }

    // Parse count as number
    const count = parseInt(options.count.toString(), 10);
    if (isNaN(count) || count < 1) {
      console.error('Error: Count must be a positive number');
      process.exit(1);
    }

    // Parse the TypeScript interface
    const parser = new Parser();
    const interfaceInfo = parser.parseFile(options.schema, options.interface);

    // Generate mock data
    const generator = new Generator();
    const mockData = generator.generateMockData(interfaceInfo, count);
    
    // Format output
    const output = generator.formatOutput(mockData, options.output as OutputFormat);
    
    // Output the result
    if (options.outFile) {
      fs.writeFileSync(options.outFile, output);
      console.log(`Mock data written to ${options.outFile}`);
    } else {
      console.log(output);
    }
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
};

run(); 