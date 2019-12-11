import { Program, MethodDefinition } from "@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree";
import { extractMethods } from "./analyzers/extract_all_methods";
import { extractClassName } from "./analyzers/extract_class_name";
import { extractMethodName } from "./analyzers/extract_method_name";
import { extractMethodParams } from "./analyzers/extract_method_params";
import { deleteLocationData } from "./analyzers/delete_location_data";

export class DataExtractor {

    constructor(){}

    public getClassMethods(ast: Program){
        const methods = extractMethods(ast)

        let  className = extractClassName(ast)

        const result = {
            className: className,
            methods : methods
        }

        // methods.forEach(m  => {
            
        //     // const methodName = extractMethodName(m)
        //     // const params = extractMethodParams(m)
            
        //     // const method = {
        //     //     name: methodName,
        //     //     params: params,
        //     //     loc: m.loc,
        //     //     body: deleteLocationData(m)
        //     // }

        //     // result.methods.push(method)
        // })
        return result
    }
}