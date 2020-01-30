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
    private isVerbose;

    constructor(config: Config, isVerbose: any = false){
        this.parser = new AstParser();
        this.extractor = new DataExtractor();
        this.config = config;
        this.isVerbose = isVerbose;
    }

    findSourceMaps(blobPattern:string[] = ["*.map"]) {
        const pattern = this.config.sourceMaps? this.config.sourceMaps.pattern : blobPattern 
    
        console.log(`Searching source maps using pattern ${pattern}`)
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

            this.log(JSON.stringify(data, null, 2))

            results.push({filePath:filePath, data})
        });
    
        return results
    }

    private log(text){
        if(this.isVerbose){
            console.log(text)
        }
    }
}