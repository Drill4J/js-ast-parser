#!/usr/bin/env node
import program from 'commander';
import fsExtra from 'fs-extra';
import {
  findFilePaths,
  getConfig,
  send,
} from './utils';
import processSource from '../index';

process.on('uncaughtException', (error) => {
  if (error instanceof Error) {
    console.log('Error:', error.message, '\n', error.stack);
  } else {
    console.log('Error:', JSON.stringify(error));
  }
  process.exit(1);
})

program
  .option('-c, --config <path>', 'path to config file')
  .option('-b, --build-version <version>', 'build version')
  .option('-s, --skip-errors', 'skip files with processing errors')
  .parse(process.argv);

console.log('Program started\n');

if (!program.config) {
  throw new Error('path to config file is required (use -c or --config)');
}

console.log('Searching sources');
const config = getConfig(program.config);
const sourcePaths = findFilePaths(config.sources.pattern, config.sources.ignore);
console.log('Found sources:\n\t', sourcePaths.join('\n\t'), '\n')

console.log('Processing sources');
const result = [];
sourcePaths.forEach(filePath => {
  try {
    console.log('\t', filePath);
    const source = fsExtra.readFileSync(filePath, 'utf8');
    const data = processSource(source);
    data.forEach(x => result.push({
      filePath,
      suffix: x.name,
      methods: x.functions,
    }));
  } catch(e) {
    console.log('\t failed to parse', filePath, 'due to\n', JSON.stringify(e), '\n')
    if (!program.skipErrors) {
      throw e;
    }
  }
});
console.log('Sources processed\n')

console.log('Searching sourcemaps')
let sourcemaps
if (config.sourcemaps) {
  const sourcemapPaths = findFilePaths(config.sourcemaps.pattern, config.sourcemaps.ignore);
  console.log('Sourcemaps found:\n\t', sourcemapPaths.join('\n\t'), '\n')
  sourcemaps = sourcemapPaths.map(x => fsExtra.readJSONSync(x, { encoding: 'utf-8' }));
}

(async () => {  
  const { url, path, spaces } = config.sources.output

  if (path) {
    console.log('Write AST data to', path, '\n')
    await fsExtra.writeJSON(path, result, { spaces });
  }

  if (url) {
    console.log('Send AST to', url, '\n')
    await send(url, {
      buildVersion: program.buildVersion,
      data: result,
    });
  }

  if (config.sourcemaps) {
    console.log('Send sourcemaps to', config.sourcemaps.output.url, '\n')
    await Promise.all(sourcemaps.map(sourcemap => send(config.sourcemaps.output.url, sourcemap)));
  }

  console.log('Program finished. Exiting...');
})()