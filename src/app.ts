import { Config } from "./model/config";
import { writeFile, getFiles } from "./utils";
import glob from 'fast-glob'
import fs from 'fs-extra'
import { AstParser } from "./parser";
import { DataExtractor } from "./extractor";
import path from 'path'

export class App {
  
    private config: Config;
    private parser: AstParser;
    private extractor: DataExtractor;

    constructor(config: Config){
        this.parser = new AstParser()
        this.extractor = new DataExtractor();
        this.config = config
    }

    findSourcemaps() {
        console.log('-----\n Source files parsing anabled \n-----')
        const pattern = this.config.sourceMaps.pattern
    
        const files = glob.sync(pattern)
    
        const data = [];

        files.forEach(f => {
          console.log(`Reading source map file ${f}`)
          data.push(JSON.parse(fs.readFileSync(f, 'utf8')));
        })

        return data;
    }

    generateSampleConfig(fileName: string){
        const configSample = {
            projectName: "demo",
            source_dir: "./src",
            url: "http://localhost:8081/saveAst",
            ignoreFiles: [
                "*.js.map",
                "*.js",
                "*.html",
                "*.css",
                "*.json"
            ],
            ignoreFolders: [
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
        
          console.log(`Creating sample config file at ${fileName}`)
          writeFile(fileName, configSample)
    }

    findSourceFiles(){
        return getFiles(this.config.source_dir, this.config.ignoreFiles)
        .filter(it => !this.config.ignoreFolders.some(x => it.includes(x)))
    }

    parseFiles(files: string[]): any {
        let results = []
        files.forEach(file => {
            let filePath = file
        
            if(!path.isAbsolute(file)){
                filePath = path.sep + file
            }

            console.log("Parsing " + filePath)
        
            const ast = this.parser.parse(file)
            const data = this.extractor.getClassMethods(ast)      
            results.push({filePath:filePath, data})
        });
    
        console.log("Saving ast data...")
  
        return results
    }
}