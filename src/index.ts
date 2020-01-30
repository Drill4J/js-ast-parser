#!/usr/bin/env node
import program from 'commander';
import { parseFiles, writeFile, saveData, getFiles } from './utils';
import { readFileSync } from 'fs-extra';
import { App } from './app';
import { version } from 'typescript';

program
  .option('-c, --config <path>', 'path to config.json file')
  .option('-g, --generate-config <path>', 'generate sample config')
  .option('-s, --sourceMaps', 'upload source maps')
  .option('-v, --verbose', 'verbose output')
  .parse(process.argv);
  
if(!program.config){
  throw new Error('Config file should be provided as drill4js-cli -c <path>')
}

let config = JSON.parse(readFileSync(program.config).toString())

const app = new App(config,program.verbose)

console.log(`-----\n Start parsing project ${config.projectName}\n-----`)

const files = getFiles(config.source_dir, config.ignoreFiles).filter(it => !config.ignoreFolders.some(x => it.includes(x)))

const data = app.parseFiles(files)

console.log("Saving ast data...")
saveData(config.url, data)

if(program.sourceMaps){
    console.log('-----\n Source files parsing anabled \n-----')
    const data = app.findSourceMaps()
    data.forEach(m => {
      saveData(config.sourceMaps.url, m)
    })
}


if(program.generateConfig){
  app.generateSampleConfig(program.generateConfig)
}