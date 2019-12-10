import { parse, TSESTreeOptions, TSESTree, AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import { Node, Program, Parameter, MethodDefinition } from "@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree";
import fs from "fs-extra";
import traverser  from "eslint/lib/shared/traverser";
import { extractMethodName } from "./analyzers/extract_method_name";
import { extractMethodParams } from "./analyzers/extract_method_params";
import { extractMethods } from "./analyzers/extract_all_methods";

export class AstParser {

    private options: TSESTreeOptions;
    
    constructor(){
        this.options =  {
            comment: false,
            jsx: true
        };
    }

    public parse(sourcePath: string){
        const source = fs.readFileSync(sourcePath, 'utf8')
        return parse(source, this.options)
    }
}