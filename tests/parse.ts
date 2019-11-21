import { AstParser } from ".."
import { extractMethods } from "../analyzers/extract_all_methods"
import { extractMethodName } from "../analyzers/extract_method_name"
import { extractMethodParams } from "../analyzers/extractMethodParams"
import { extractClassName } from "../analyzers/extract_class_name"
import { writeJson, emptyDirSync } from "fs-extra"

const parser = new AstParser("./tests/test-data/episode.ts")

const ast = parser.parse()

const methods = extractMethods(ast)

const  className = extractClassName(ast)
//console.log(className)

const result = {
    className: className,
    methods : []
}

methods.forEach(m  => {
    
    const methodName = extractMethodName(m)
    const params = extractMethodParams(m)

    const method = {
        name: methodName,
        params: params
    }

    result.methods.push(method)
})

//console.log(JSON.stringify(result, null, 2))

function writeFile(name, object){
    writeJson(name, object, {spaces:2}, err => {
        if (err) return console.error(err)
      
        console.log('success!')
      })
}

emptyDirSync('./data')

writeFile('./data/result.json', result)
writeFile('./data/ast.json', ast)