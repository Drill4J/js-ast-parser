#!/usr/bin/env node
import program from 'commander';
import { parseFiles, writeFile, saveData } from './utils';
import { readFileSync } from 'fs-extra';
import glob from 'fast-glob'
import fs from 'fs-extra'

program
  .option('-c, --config <path>', 'path to config.json file')
  .option('-gc, --generate-config <path>', 'generate sample config')
  .option('-s, --sourceMaps', 'upload source maps')
  .parse(process.argv);


if(program.config){  
  let config = JSON.parse(readFileSync(program.config).toString())

  parseFiles(config.projectName, config.source_dir, config.url, config.ignoreFiles, config.ignoreFolders)

  if(program.sourceMaps){
    console.log('-----\n Source files parsing anabled \n-----')
    const pattern = config.sourceMaps.pattern

    const files = glob.sync(pattern)

    files.forEach(f => {
      console.log(`Reading source map file ${f}`)
      const data = JSON.parse(fs.readFileSync(f, 'utf8'));
      
      saveData(config.sourceMaps.url, data)
    })

  }
} 



if(program.generateConfig){
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
    ],
    sourceMaps: {
      url: "http://localhost:3000/source-maps",
      pattern: [
        "./dist/main.*.js.map"
      ]
    }
  }

  console.log(`Creating sample config file at ${program.generateConfig}`)
  writeFile(program.generateConfig, configSample)
}



