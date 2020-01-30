import { SourceLocation } from "@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree"
import { MainMethod } from "src/analyzers/helpers";

export class Astmethod {
    name: string;
    params: string[] = [];
    loc: SourceLocation;
    body: MainMethod;
    statements: number[];
}