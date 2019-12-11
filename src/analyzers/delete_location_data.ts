import { Node, MethodDefinition } from "@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree";
import traverser  from "eslint/lib/shared/traverser";
import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import { MainMethod } from "./extract_all_methods";

export function deleteLocationData(method){
    traverser.traverse(method, {
        enter(node: Node) {
            delete node.loc
            delete node.range
        }
    })
    return method;
}