#!/usr/bin/env node
import program from 'commander';
import { parseFiles, writeFile, saveData, getFiles } from './utils';
import { readFileSync } from 'fs-extra';
import { App } from './app';

program
  .option('-c, --config <path>', 'path to config.json file')
  .option('-g, --generate-config <path>', 'generate sample config')
  .option('-s, --sourceMaps', 'upload source maps')
  .parse(process.argv);

 
const app = new App(program.config)

if(program.generateConfig){
  app.generateSampleConfig(program.generateConfig)
}

if(program.config){
  let config = JSON.parse(readFileSync(program.config).toString())
  console.log(`-----\n Start parsing project ${config.projectName}\n-----`)

  const files = getFiles(config.source_dir, config.ignoreFiles).filter(it => !config.ignoreFolders.some(x => it.includes(x)))

  const data = app.parseFiles(files)

  saveData(config.url, data)

  if(program.sourceMaps){
    const data = app.findSourceMaps()
    saveData(config.url, data)
  }
}

