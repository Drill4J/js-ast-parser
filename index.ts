import { parse, TSESTreeOptions, TSESTree, AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import { Node, Program, Parameter, MethodDefinition } from "@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree";
import fs from "fs-extra";
import traverser  from "eslint/lib/shared/traverser";
import { extractMethodName } from "./analyzers/extract_method_name";
import { extractMethodParams } from "./analyzers/extractMethodParams";
import { extractMethods } from "./analyzers/extract_all_methods";


const options: TSESTreeOptions = {
  comment: false,
  jsx: false
}

const source = fs.readFileSync('test-data/episode.ts', 'utf8')

const ast = parse(source, options)

const methods = extractMethods(ast)

methods.forEach(m  => {
    const methodName = extractMethodName(m)
    const params = extractMethodParams(m)
    console.log(`${methodName}(${params.join(",")})`)
})