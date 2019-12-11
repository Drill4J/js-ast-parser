import test from 'ava';
import { parseFiles } from 'src/utils';
import { AstParser } from 'src/parser';
import { DataExtractor } from 'src/extractor';

test('test can find MethodDefinition', t => {
    const parser = new AstParser()
    const extractor = new DataExtractor();

    const ast = parser.parse("./fixtures/original/method_definition.ts")
    const data = extractor.getClassMethods(ast)
    
    t.is(data.methods.length, 1)
    t.is(data.className, "Test")

    const method = data.methods[0]
    t.is(method.name, "newMethod")
    t.deepEqual(method.params, ["name"])
    t.deepEqual(method.loc, {start: { line: 2, column: 4} , end: { line: 4, column: 5} })
    t.truthy(method.body)
})

test('test can find FunctionDeclaration', t => {
    const parser = new AstParser()
    const extractor = new DataExtractor();

    const ast = parser.parse("./fixtures/original/function_declaration.ts")
    const data = extractor.getClassMethods(ast)
    
    t.is(data.methods.length, 1)
    t.is(data.className, undefined)

    const method = data.methods[0]
    t.is(method.name, "newMethod")
    t.deepEqual(method.params, ["name"])
    t.deepEqual(method.loc, {start: { line: 1, column: 7 } , end: { line: 3, column: 1 } })
    t.truthy(method.body)
})

test('test can find all methods', t => {
	const parser = new AstParser()
    const extractor = new DataExtractor();

    const ast = parser.parse("./fixtures/original/episode.ts")
    const data = extractor.getClassMethods(ast)
    
    t.assert(data.methods.length === 16)
});

// test('test can find arrow function', t => {
// 	const parser = new AstParser()
//     const extractor = new DataExtractor();

//     const ast = parser.parse("./fixtures/original/selectable-table.tsx")
//     const data = extractor.getClassMethods(ast)
    
//     t.assert(data.methods.length === 1)
// });