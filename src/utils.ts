import { writeJson } from "fs-extra"
import recursive from "recursive-readdir-synchronous";
import axios from "axios"
import { async } from "rxjs/internal/scheduler/async";
import { AstParser } from "./parser";
import { DataExtractor } from "./extractor";

export function writeFile(name, object){
    writeJson(name, object, {spaces:2}, err => {
        if (err) return console.error(err)
      
        console.log('success!')
      })
}

export function getFiles(path: string, ignoreFiles: string[]){
    return recursive(path, ignoreFiles);
}

export function saveData(url:string, data){
    if(url){
        axios.post(url, {
            data
        }, { headers : {'Content-Type': 'application/json;charset=UTF-8'}}).then( res =>{
            console.log(`statusCode: ${res.status}`)
            console.log(res.data)
        }).catch( err => {
            console.error(err);
        })
    } else {
        writeFile("all_result.json", data)
    }
}

export function parseFiles(projectName, folder, url, ignoreFiles, ignoreFolders){
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
  
    const data = {
        projectName: projectName,
        results: results
    }

    saveData(url, data)
  }