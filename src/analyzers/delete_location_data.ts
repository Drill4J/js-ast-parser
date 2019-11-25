import { Node, MethodDefinition } from "@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree";
import traverser  from "eslint/lib/shared/traverser";
import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";

export function deleteLocationData(method: MethodDefinition){
    traverser.traverse(method, {
        enter(node: Node) {
            delete node.loc
            delete node.range
        }
    })
    return method;
}