
import traverser  from "eslint/lib/shared/traverser";
import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import { Node, MethodDefinition, Program, FunctionDeclaration, ArrowFunctionExpression, FunctionExpression, ExportNamedDeclaration } from "@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree";

export type MainMethod = FunctionDeclaration | MethodDefinition | ExportNamedDeclaration | ArrowFunctionExpression | FunctionExpression

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

                case AST_NODE_TYPES.VariableDeclaration:
                    this.skip()
                    traverser.traverse(node, {
                        enter(innerNode: Node) {
                          switch(innerNode.type) {
                            case AST_NODE_TYPES.VariableDeclarator:
                              // const name = () => {}
                                if (innerNode.init.type === AST_NODE_TYPES.ArrowFunctionExpression) {
                                    methods.push(innerNode.init)
                                    this.break()
                                }
                                // const name = function() {}
                                else if (innerNode.init.type === AST_NODE_TYPES.FunctionExpression) {
                                    methods.push(innerNode.init)
                                    this.break()
                                }
                            break;
                        }
                }});    
            }}})
    return methods
}