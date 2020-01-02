#!/usr/bin/env node
import program from 'commander';
import { parseFiles, writeFile } from './utils';
import { readFileSync } from 'fs';

program
  .option('-c, --config <path>', 'path to config.json file')
  .option('-g, --example-config <path>', 'generate sample config')
  .parse(process.argv);


if(program.config){  
  let config = JSON.parse(readFileSync(program.config).toString())

  parseFiles(config.projectName, config.source_dir, config.url, config.ignoreFiles, config.ignoreFolders)
} 

if(program.exampleConfig){
  const configSample = {
    "projectName": "demo",
    "source_dir": "./src",
    "url": "http://localhost:8081/saveAst",
    "ignoreFiles": [
        "*.js.map",
        "*.js",
        "*.html",
        "*.css",
        "*.json"
    ],
    "ignoreFolders": [
        "libs",
        "coverage",
        "interfaces"
    ]
  }

  console.log(`Creating sample config file at ${program.exampleConfig}`)
  writeFile(program.exampleConfig, configSample)
}



