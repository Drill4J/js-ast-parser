import { Program, Node, ClassDeclaration } from "@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree";
import traverser  from "eslint/lib/shared/traverser";
import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";

export function extractClassName(program: Program){
    let name:string;
    traverser.traverse(program, {
        enter(node: Node) {
            if(node.type == AST_NODE_TYPES.ClassDeclaration){
                this.break()
                name = extractName(node)
        }
    }})
    return name
}

function extractName(classDeclaration: ClassDeclaration){
    let name:string;
    traverser.traverse(classDeclaration, {
        enter(node: Node) {
            if(node.type == AST_NODE_TYPES.Identifier){
                this.break()
                name = node.name
        }
    }})

    return name
}