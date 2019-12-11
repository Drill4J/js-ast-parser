import { MainMethod } from "src/analyzers/extract_all_methods"
import { SourceLocation } from "@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree"

export class Astmethod {
    name: string;
    params: string[] = [];
    loc: SourceLocation;
    body: MainMethod;
}