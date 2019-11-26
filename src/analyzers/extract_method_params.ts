import { MethodDefinition, FunctionExpression } from "@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree";
import traverser  from "eslint/lib/shared/traverser";
import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import { MainMethod } from "./extract_all_methods";

export function extractMethodParams(method: MainMethod){
    let params = [];
    traverser.traverse(method, {
        enter(node){
            if(node.type == AST_NODE_TYPES.FunctionExpression){
                this.break()
                params = extractParams(node)
            }
        }
    })
    return params;
}

function extractParams(expression: FunctionExpression){
    const paramNames = []

    expression.params.forEach(p =>{
        traverser.traverse(p, {
            enter(node){
                if(node.type == AST_NODE_TYPES.Identifier){
                    paramNames.push(node.name)
                }
            }})
    })

    
    return paramNames
}