import { MainMethod } from "./helpers";
import traverser  from "eslint/lib/shared/traverser";
import { Node, Program, ObjectExpression, Property } from "@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree";
import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";

export function extractStatements(node: Node): number[]{
    const result = new Set<number>();

    traverser.traverse(node, {
        enter(node: Node) {
            switch(node.type){
                case AST_NODE_TYPES.BlockStatement:
                    node.body.forEach((statement) => {
                        const startLine = statement?.loc?.start?.line;
                        const endLine = statement?.loc?.end?.line;
                        result.add(startLine);
                        result.add(endLine);
                    })      
    }}})

    return Array.from(result)
}   