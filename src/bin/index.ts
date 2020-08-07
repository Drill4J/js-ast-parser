#!/usr/bin/env node
import program from 'commander';
import fsExtra from 'fs-extra';
import {
  findFilePaths,
  getConfig,
  send,
} from './utils';
import processSource from '../index';

program
  .option('-c, --config <path>', 'path to config file')
  .option('-b, --build-version <version>', 'build version')
  // .option('-g, --generate-config <path>', 'generate sample config')
  .parse(process.argv);

if (!program.config) {
  throw new Error('path to config file is required (use -c or --config)');
}

const config = getConfig(program.config);
const sourcePaths = findFilePaths(config.sources.pattern, config.sources.ignore);

const result = [];
sourcePaths.forEach(filePath => {
  const source = fsExtra.readFileSync(filePath, 'utf8');
  const data = processSource(source);
  data.forEach(x => result.push({
    filePath,
    suffix: x.name,
    methods: x.functions,
  }));
});

let sourcemaps
if (config.sourcemaps) {
  const sourcemapPaths = findFilePaths(config.sourcemaps.pattern, config.sourcemaps.ignore);
  sourcemaps = sourcemapPaths.map(x => fsExtra.readJSONSync(x, { encoding: 'utf-8' }));
}

(async () => {  
  const { url, path, spaces } = config.sources.output

  if (path) {
    await fsExtra.writeJSON(path, result, { spaces });
  }

  if (url) {
    await send(url, {
      buildVersion: program.buildVersion,
      data: result,
    });
  }

  if (config.sourcemaps) {
    await Promise.all(sourcemaps.map(sourcemap => send(config.sourcemaps.output.url, sourcemap))) ;
  }
})()