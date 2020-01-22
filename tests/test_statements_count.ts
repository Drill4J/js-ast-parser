import test from 'ava';
import { AstParser } from 'src/parser';
import { DataExtractor } from 'src/extractor';
import traverser  from "eslint/lib/shared/traverser";
import { isExpressionStatement } from 'typescript';
import { Node, Program, ObjectExpression, Property } from "@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree";
import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";

const parser = new AstParser()
const extractor = new DataExtractor();

test('test can extract Identifier parameters for MethodDefinition', t => {
    const source = 
    `
    class Test {
        newMethod(name: string){
            console.log(name)
        }
    }
    `

    const ast = parser.parseSource(source)
    const data = extractor.getClassMethods(ast)
    
    t.is(data.methods.length, 1)

    const method = data.methods[0]

    traverser.traverse(method.body, {
        enter(node: Node) {
            console.log(node)
            switch(node.type){
                case AST_NODE_TYPES.ExpressionStatement:
                    console.log(node.loc)
            }
        }
    })

    t.deepEqual(method.params, ["name"])
})