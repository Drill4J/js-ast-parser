import { AstParser } from ".."
import { extractMethods } from "../analyzers/extract_all_methods"
import { extractMethodName } from "../analyzers/extract_method_name"
import { extractMethodParams } from "../analyzers/extractMethodParams"

const parser = new AstParser("./tests/test-data/episode.ts")

const ast = parser.parse()

const methods = extractMethods(ast)

methods.forEach(m  => {
    const methodName = extractMethodName(m)
    const params = extractMethodParams(m)
    console.log(`${methodName}(${params.join(",")})`)
})