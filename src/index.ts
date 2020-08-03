#!/usr/bin/env node
import program from 'commander';
import { readFileSync } from 'fs-extra';
import { App } from './app';
import { saveData, getFiles } from './utils';

program
  .option('-c, --config <path>', 'path to config.json file')
  .option('-g, --generate-config <path>', 'generate sample config')
  .option('-s, --sourceMaps', 'upload source maps')
  .option('-o, --verbose', 'verbose output')
  .option('-b, --build-version <version>', 'build version')
  .parse(process.argv);

const app = new App();

if (program.generateConfig) {
  app.generateSampleConfig(program.generateConfig);
  process.exit(0);
}

if (!program.config) {
  throw new Error('Config file should be provided as drill4js-cli -c <path>');
}

const config = JSON.parse(readFileSync(program.config).toString());

console.log(`-----\n Start parsing project ${config.projectName}\n`);
console.log(` build: ${program.buildVersion} \n-----`);

const files = getFiles(config.source_dir, config.ignoreFiles).filter(
  it => !config.ignoreFolders.some(x => it.includes(x))
);

const data = app.parseFiles(files);

console.log('Saving ast data...');

const result = {
  buildVersion: program.buildVersion,
  data: data,
};

saveData(config.url, result).then(() => {
  if (program.sourceMaps) {
    console.log('-----\n Source files parsing anabled \n-----');
    const data = app.findSourceMaps(config);
    data.forEach(m => {
      saveData(config.sourceMaps.url, m);
    });
  }
});
