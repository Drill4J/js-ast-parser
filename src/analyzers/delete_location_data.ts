import { Node } from "@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree";
import traverser  from "eslint/lib/shared/traverser";

export function deleteLocationData(method){
    traverser.traverse(method, {
        enter(node: Node) {
            delete node.loc
            delete node.range
        }
    })
    return method;
}