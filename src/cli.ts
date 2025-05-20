#!/usr/bin/env node

import { Command } from 'commander';
import { Parser } from './parser';
import { Generator } from './generator';
import * as fs from 'fs';
import { CommandOptions, OutputFormat } from './types';

const program = new Command();

program
  .name('tsmocker')
  .description('Generate mock data from TypeScript interfaces')
  .version('1.0.0')
  .requiredOption('-s, --schema <path>', 'Path to TypeScript file containing interfaces')
  .requiredOption('-i, --interface <name>', 'Name of the interface to mock')
  .option('-c, --count <number>', 'Number of mock objects to generate', '1')
  .option('-o, --output <format>', 'Output format (json or csv)', 'json')
  .option('-f, --out-file <path>', 'Output file path (if not specified, prints to stdout)')
  .parse(process.argv);

const options = program.opts() as CommandOptions;

try {
  // Parse the TypeScript interface
  const parser = new Parser();
  const interfaceInfo = parser.parseFile(options.schema, options.interface);

  // Generate mock data
  const generator = new Generator();
  const mockData = generator.generateMockData(interfaceInfo, options.count);

  // Format output
  const output = generator.formatOutput(mockData, options.output as OutputFormat);

  // Write output
  if (options.outFile) {
    fs.writeFileSync(options.outFile, output);
    console.log(`Output written to ${options.outFile}`);
  } else {
    console.log(output);
  }
} catch (error: unknown) {
  console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
} 