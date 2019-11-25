#!/usr/bin/env node
import program from 'commander';
import { AstParser } from './parser';
import recursive from "recursive-readdir";
import { writeJson } from "fs-extra"
import { DataExtractor } from './extractor';
import axios from "axios"

function writeFile(name, object){
    writeJson(name, object, {spaces:2}, err => {
        if (err) return console.error(err)
      
        console.log('success!')
      })
}

program
  .requiredOption('-d, --dir <path>', 'source code path should be specified')
  .requiredOption('-u, --url  <url>', 'url to send data to')
  .parse(process.argv);

const parser = new AstParser()
const extractor = new DataExtractor(); 

recursive(program.dir ,["*.css", "*.html", "*.js"], function (err, files) {
    let results = []
    files.forEach(file => {
        const ast = parser.parse(file)
        const data = extractor.getClassMethods(ast)      
        results.push({filePath:file, result: data})
    });
    console.log(results)
    if(program.url){
        axios.post(program.url, {
            results
        }, { headers : {'Content-Type': 'application/json;charset=UTF-8'}}).then( res =>{
            console.log(`statusCode: ${res.status}`)
            console.log(res.data)
        }).catch( err => {
            console.error(err);
        })
    } else {
        writeFile("all_result.json", results)
    }
});




