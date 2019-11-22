import { AstParser } from "../parser"
import { extractMethods } from "../analyzers/extract_all_methods"
import { extractMethodName } from "../analyzers/extract_method_name"
import { extractMethodParams } from "../analyzers/extractMethodParams"
import { extractClassName } from "../analyzers/extract_class_name"
import { writeJson, emptyDirSync } from "fs-extra"
import { DataExtractor } from "../extractor"

const parser = new AstParser()

const ast = parser.parse("./tests/test-data/episode.ts")

const newAst = parser.parse("./tests/test-data/episode_fixed.ts")

const extractor = new DataExtractor(); 

const data = extractor.getClassMethods(ast)
const newData = extractor.getClassMethods(newAst)

function writeFile(name, object){
    writeJson(name, object, {spaces:2}, err => {
        if (err) return console.error(err)
      
        console.log('success!')
      })
}

console.log(JSON.stringify(data, null, 2))

emptyDirSync('./data')

writeFile('./data/result.json', data)
writeFile('./data/result2.json', newData)
writeFile('./data/ast.json', ast)
writeFile('./data/newAst.json', newAst)