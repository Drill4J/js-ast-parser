
import traverser  from "eslint/lib/shared/traverser";
import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import { Node, MethodDefinition, Program } from "@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree";

export function extractMethods(program: Program){
    const methods: MethodDefinition[] = [] 
    traverser.traverse(program, {
        enter(node: Node) {
            if(node.type == AST_NODE_TYPES.MethodDefinition){
                methods.push(node)
        }
    }})
    return methods
}