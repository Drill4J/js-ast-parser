
import traverser  from "eslint/lib/shared/traverser";
import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import { Node, MethodDefinition, Program, FunctionDeclaration, ArrowFunctionExpression, FunctionExpression, ExportNamedDeclaration } from "@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree";

export type MainMethod = FunctionDeclaration | MethodDefinition | ExportNamedDeclaration

export function extractMethods(program: Program){
    const methods: MainMethod[] = [] 
    traverser.traverse(program, {
        enter(node: Node) {
            switch(node.type){
                case AST_NODE_TYPES.MethodDefinition:
                    methods.push(node)
                    break;

                case AST_NODE_TYPES.FunctionDeclaration:
                    methods.push(node)
                    break;
            }
    }})
    return methods
}