import { parse, TSESTreeOptions, TSESTree, AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import { Node, Program, Parameter, MethodDefinition } from "@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree";
import fs from "fs-extra";
import traverser  from "eslint/lib/shared/traverser";
import { extractMethodName } from "./analyzers/extract_method_name";
import { extractMethodParams } from "./analyzers/extractMethodParams";
import { extractMethods } from "./analyzers/extract_all_methods";

export class AstParser {

    private options: TSESTreeOptions;
    private sourcePath:String;

    constructor(sourcePath:String){
        this.options =  {
            comment: false,
            jsx: false
        };
        this.sourcePath = sourcePath;
    }

    public parse(){
        const source = fs.readFileSync(this.sourcePath, 'utf8')
        return parse(source, this.options)
    }
}