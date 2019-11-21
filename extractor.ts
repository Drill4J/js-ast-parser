import { Program } from "@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree";
import { extractMethods } from "./analyzers/extract_all_methods";
import { extractClassName } from "./analyzers/extract_class_name";
import { extractMethodName } from "./analyzers/extract_method_name";
import { extractMethodParams } from "./analyzers/extractMethodParams";

export class DataExtractor {

    constructor(){}

    public getClassMethods(ast: Program){
        const methods = extractMethods(ast)

        const  className = extractClassName(ast)

        const result = {
            className: className,
            methods : []
        }

        methods.forEach(m  => {
            
            const methodName = extractMethodName(m)
            const params = extractMethodParams(m)

            const method = {
                name: methodName,
                params: params
            }

            result.methods.push(method)
        })
        return result
    }
}