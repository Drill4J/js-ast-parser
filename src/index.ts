#!/usr/bin/env node
import program from 'commander';
import { AstParser } from './parser';
import { DataExtractor } from './extractor';
import { saveData, getFiles } from './utils';

program
  .requiredOption('-d, --dir <path>', 'source code path should be specified')
  .option('-i, --ignore', 'files to ignore', ["*.css", "*.html", "*.js"])
  .option('-u, --url  <url>', 'url to send data to')
  .parse(process.argv);

const parser = new AstParser()
const extractor = new DataExtractor();

const files = getFiles(program.dir, program.ignore)

let results = []
files.forEach(file => {
    const ast = parser.parse(file)
    const data = extractor.getClassMethods(ast)      
    results.push({filePath:file, result: data})
});

saveData(program.url, results)



