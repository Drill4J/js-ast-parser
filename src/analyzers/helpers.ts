import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import { FunctionDeclaration, MethodDefinition, VariableDeclarator } from "@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree";

export declare type MainMethod = MethodDefinition | FunctionDeclaration | VariableDeclarator

export function getFunctionName(node: MainMethod): string {
    let  name = ""
    if(node.type === AST_NODE_TYPES.MethodDefinition && node.key.type === AST_NODE_TYPES.Identifier){
        return  node.key.name;
    }
    else if(node.type === AST_NODE_TYPES.FunctionDeclaration && node.id.type === AST_NODE_TYPES.Identifier){
        return node.id.name;
    }
    else if(node.type === AST_NODE_TYPES.VariableDeclarator &&  node.id && node.id.type == AST_NODE_TYPES.Identifier){
        return node.id.name
    }

    return name
}


