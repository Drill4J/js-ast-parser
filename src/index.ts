#!/usr/bin/env ts-node
import program from 'commander';
import { AstParser } from './parser';
import recursive from "recursive-readdir";
import { writeJson } from "fs-extra"

function writeFile(name, object){
    writeJson(name, object, {spaces:2}, err => {
        if (err) return console.error(err)
      
        console.log('success!')
      })
}

program
  .requiredOption('-f, --folder <path>', 'source code path should be specified');

program.parse(process.argv);

const parser = new AstParser()

if (!program.folder){
    console.error("source code path should be specified via -f parameter")
}


recursive(program.folder ,["*.css", "*.html", "*.js"], function (err, files) {
    let results = []
    files.forEach(file => {
        const ast = parser.parse(file)      
        results.push({filePath:file, tree: ast})
    });
    console.log(results)
    writeFile("all_result.json", results)
});




