#!/usr/bin/env node

import { Command } from 'commander';
import { Parser } from './parser';
import { Generator } from './generator';
import * as fs from 'fs';
import * as path from 'path';
import { CommandOptions, OutputFormat } from './types';

const program = new Command();

program
  .name('tsmocker')
  .description('Generate realistic mock data from TypeScript interfaces')
  .version('1.0.0')
  .requiredOption('-s, --schema <path>', 'Path to TypeScript file containing interfaces')
  .requiredOption('-i, --interface <name>', 'Name of the interface to mock')
  .option('-c, --count <number>', 'Number of mock objects to generate', '1')
  .option('-o, --output <format>', 'Output format (json or csv)', 'json')
  .option('-f, --out-file <path>', 'Output file path (if not specified, prints to stdout)')
  .action(async (options: CommandOptions) => {
    try {
      const schemaPath = path.resolve(process.cwd(), options.schema);
      if (!fs.existsSync(schemaPath)) {
        console.error(`❌ File not found: ${options.schema}`);
        console.log('💡 Make sure the file path is correct and the file exists.');
        process.exit(1);
      }

      const count = parseInt(options.count);
      if (isNaN(count) || count < 1) {
        console.error(`❌ Invalid count: ${options.count}. Must be a positive number.`);
        process.exit(1);
      }

      if (!['json', 'csv'].includes(options.output)) {
        console.error(`❌ Invalid output format: ${options.output}. Use 'json' or 'csv'.`);
        process.exit(1);
      }

      console.log(`🔍 Parsing interface "${options.interface}" from ${options.schema}...`);

      const parser = new Parser();
      const interfaceInfo = parser.parseFile(options.schema, options.interface);

      console.log(`✅ Found interface with ${interfaceInfo.properties.length} properties`);

      const generator = new Generator();
      const mockData = generator.generateMockData(interfaceInfo, count);

      console.log(`🎲 Generated ${mockData.length} mock objects`);

      const output = generator.formatOutput(mockData, options.output as OutputFormat);

      if (options.outFile) {
        fs.writeFileSync(options.outFile, output);
        console.log(`💾 Output written to ${options.outFile}`);
      } else {
        console.log('\n📄 Generated Data:');
        console.log(output);
      }

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      if (errorMessage.includes('not found')) {
        console.error(`❌ Interface "${options.interface}" not found in ${options.schema}`);
        console.log('💡 Check the interface name and make sure it exists in the file.');
      } else if (errorMessage.includes('parse')) {
        console.error(`❌ Failed to parse TypeScript file: ${errorMessage}`);
        console.log('💡 Make sure the file contains valid TypeScript interfaces.');
      } else {
        console.error(`❌ Error: ${errorMessage}`);
      }
      
      process.exit(1);
    }
  });

program.parse(process.argv); 