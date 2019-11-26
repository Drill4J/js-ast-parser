#!/usr/bin/env node
import program from 'commander';
import { AstParser } from './parser';
import { DataExtractor } from './extractor';
import { saveData, getFiles } from './utils';
import path from 'path'

// program
//   .requiredOption('-d, --dir <path>', 'source code path should be specified')
//   .option('-i, --ignore', 'files to ignore', ["*.css", "*.html", "*.js"])
//   .option('-u, --url  <url>', 'url to send data to')
//   .parse(process.argv);


export function parseFiles(folder, url, ignore){
  const parser = new AstParser()
  const extractor = new DataExtractor();
  
  const files = getFiles(folder, ignore)
  
  let results = []
  files.forEach(file => {
      const ast = parser.parse(file)
      const data = extractor.getClassMethods(ast)      
      results.push({filePath:file, result: data})
  });
  
  saveData(url, results)
}

function ignoreFolder(file, stats) {
  // `file` is the absolute path to the file, and `stats` is an `fs.Stats`
  // object returned from `fs.lstat()`.
  return stats.isDirectory() && path.basename(file) == "coverage";
}

parseFiles("/home/sergey/Github/todomvc/examples/typescript-angular/js", "http://localhost:5000/compare", ["*.js", "*.js.map", "*.css", "*.html","_all.ts" ,"*.d.ts",ignoreFolder])
//parseFiles(program.dir, program.url, program.ignore)



