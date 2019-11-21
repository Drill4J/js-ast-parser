import { AstParser } from ".."
import { extractMethods } from "../analyzers/extract_all_methods"
import { extractMethodName } from "../analyzers/extract_method_name"
import { extractMethodParams } from "../analyzers/extractMethodParams"
import { extractClassName } from "../analyzers/extract_class_name"

const parser = new AstParser("./tests/test-data/episode.ts")

const ast = parser.parse()

const methods = extractMethods(ast)

const  className = extractClassName(ast)
console.log(className)

methods.forEach(m  => {
    
    const methodName = extractMethodName(m)
    const params = extractMethodParams(m)

    console.log(`${methodName}(${params.join(",")})`)
})