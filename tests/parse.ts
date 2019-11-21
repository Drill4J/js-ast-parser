import { AstParser } from "../parser"
import { extractMethods } from "../analyzers/extract_all_methods"
import { extractMethodName } from "../analyzers/extract_method_name"
import { extractMethodParams } from "../analyzers/extractMethodParams"
import { extractClassName } from "../analyzers/extract_class_name"
import { writeJson, emptyDirSync } from "fs-extra"
import { DataExtractor } from "../extractor"

const parser = new AstParser("./tests/test-data/episode.ts")

const ast = parser.parse()

const extractor = new DataExtractor(); 

const data = extractor.getClassMethods(ast)

function writeFile(name, object){
    writeJson(name, object, {spaces:2}, err => {
        if (err) return console.error(err)
      
        console.log('success!')
      })
}

emptyDirSync('./data')

writeFile('./data/result.json', data)
writeFile('./data/ast.json', ast)