import test from 'ava';
import { AstParser } from 'src/parser';
import { DataExtractor } from 'src/extractor';

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
    t.deepEqual(method.params, ["name"])
})