import { Program, MethodDefinition } from "@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree";
import { extractMethods } from "./analyzers/extract_all_methods";
import { extractClassName } from "./analyzers/extract_class_name";

export class DataExtractor {

    constructor(){}

    public getClassMethods(ast: Program){
        const methods = extractMethods(ast)

        let  className = extractClassName(ast)

        const result = {
            className: className,
            methods : methods
        }

        return result
    }
}