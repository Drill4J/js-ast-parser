import { parse, TSESTreeOptions, TSESTree, AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import { Node, Program, Parameter, MethodDefinition } from "@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree";
import fs from "fs-extra";
import traverser  from "eslint/lib/shared/traverser";
import { from } from "rxjs";


const options: TSESTreeOptions = {
  comment: false,
  jsx: false
}

const source = fs.readFileSync('test-data/episode.ts', 'utf8')

const ast = parse(source, options)

function extractMethods(program: Program){
    const methods:TSESTree.MethodDefinition[] = [] 
    traverser.traverse(program, {
        enter(node: Node) {
            if(node.type == AST_NODE_TYPES.MethodDefinition){
                methods.push(node)
        }
    }})
    return methods
}

function extractMethodParams(method: MethodDefinition){
    let params:Parameter[];
    traverser.traverse(method, {
        enter(node: Node) {
            if(node.type == AST_NODE_TYPES.FunctionExpression){
               this.break()
               
               traverser.traverse(node, {
                   enter(node){
                    if(node.type == AST_NODE_TYPES.Identifier){
                        console.log(node.name)
                    }
                }
               })
        }
    }})
    return params;
}

const methods = extractMethods(ast)

methods.forEach(m  => {
    const params = extractMethodParams(m)
    console.log(m)
})