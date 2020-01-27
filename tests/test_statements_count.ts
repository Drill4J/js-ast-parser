import test from 'ava';
import { AstParser } from 'src/parser';
import { DataExtractor } from 'src/extractor';
import traverser  from "eslint/lib/shared/traverser";
import { isExpressionStatement } from 'typescript';
import { Node, Program, ObjectExpression, Property } from "@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree";
import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";

const parser = new AstParser()
const extractor = new DataExtractor();

test('test can exract expression statements', t => {

    const source = `class Test {
        newMethod(name: string){
            console.log(name)
            const a = 5;
          
            const b = extract()
            
            const c =() => {
            
            
            }
            
            return 5
        }
    }
    `

    const ast = parser.parseSource(source)
    const data = extractor.getClassMethods(ast)
    
    t.assert(data.methods.length === 1)

    const method = data.methods[0]
    t.deepEqual(method.statements,new Set<number>([3, 4, 6, 8, 11, 13]))
});

test('test can exract expression statements from ', t => {

    const source = `class Test {
        static newMethod(name: string){
            console.log(name)
            const a = 5;
          
            const b = extract()
            
            const c =() => {
            
            
            }
            
            return 5
        }
    }
    `

    const ast = parser.parseSource(source)
    const data = extractor.getClassMethods(ast)
    
    t.assert(data.methods.length === 1)

    const method = data.methods[0]
    t.deepEqual(method.statements,new Set<number>([3, 4, 6, 8, 11, 13]))
});