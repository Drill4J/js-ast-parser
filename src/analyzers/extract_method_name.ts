import traverser  from "eslint/lib/shared/traverser";
import { Node,  MethodDefinition } from "@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree";
import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import { MainMethod } from "./helpers";

export function extractMethodName(method: MainMethod){
    let name: string;
    traverser.traverse(method, {
        enter(node: Node) {
            if(node.type == AST_NODE_TYPES.Identifier){
               this.break()
               name = node.name
        }
    }})
    return name.trim();
}