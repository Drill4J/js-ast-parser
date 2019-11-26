#!/usr/bin/env node
import program from 'commander';
import { AstParser } from './parser';
import { DataExtractor } from './extractor';
import { saveData, getFiles } from './utils';
import { readFileSync } from 'fs';

program
  .requiredOption('-c, --cfg <path>', 'path to config.json file')
  .parse(process.argv);

let cfg = readFileSync(program.cfg)

let config = JSON.parse(cfg.toString())

export function parseFiles(folder, url, ignoreFiles, ignoreFolders){
  const parser = new AstParser()
  const extractor = new DataExtractor();
  
  const files = getFiles(folder, ignoreFiles).filter(it => !ignoreFolders.some(x => it.includes(x)))
  
  let results = []
  files.forEach(file => {
      console.log("Parsing "+ file)
      const ast = parser.parse(file)
      const data = extractor.getClassMethods(ast)      
      results.push({filePath:file, result: data})
  });
  
  console.log("Save data")

  saveData(url, results)
}

parseFiles(config.dir, config.url, config.ignoreFiles, config.ignoreFolders)



