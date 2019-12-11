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

test('test can find ArrowFunctionExpression', t => {
    const parser = new AstParser()
    const extractor = new DataExtractor();

    const ast = parser.parse("./fixtures/original/arrow_function.ts")
    const data = extractor.getClassMethods(ast)
    
    t.is(data.methods.length, 1)
    t.is(data.className, undefined)

    const method = data.methods[0]
    t.is(method.name, "newMethod")
    t.deepEqual(method.params, ["name"])
    t.deepEqual(method.loc, {start: { line: 1, column: 18 } , end: { line: 3, column: 1 } })
    t.truthy(method.body)
})

test('test can find FunctionExpression', t => {
    const parser = new AstParser()
    const extractor = new DataExtractor();

    const ast = parser.parse("./fixtures/original/function_expression.ts")
    const data = extractor.getClassMethods(ast)
    
    t.is(data.methods.length, 1)
    t.is(data.className, undefined)

    const method = data.methods[0]
    t.is(method.name, "hello")
    t.deepEqual(method.params, ["name"])
    t.deepEqual(method.loc, {start: { line: 1, column: 14 } , end: { line: 3, column: 1 } })
    t.truthy(method.body)
})

test('test can find all methods', t => {
	const parser = new AstParser()
    const extractor = new DataExtractor();

    const ast = parser.parse("./fixtures/original/episode.ts")
    const data = extractor.getClassMethods(ast)
    
    t.assert(data.methods.length === 16)
});

test('test can find arrow function', t => {
	const parser = new AstParser()
    const extractor = new DataExtractor();

    const ast = parser.parse("./fixtures/original/selectable-table.tsx")
    const data = extractor.getClassMethods(ast)
    
    t.assert(data.methods.length === 1)
});

test('test can find arrow function with call expression', t => {
	const parser = new AstParser()
    const extractor = new DataExtractor();

    const ast = parser.parse("./fixtures/original/arrow_function_call_expression.ts")
    const data = extractor.getClassMethods(ast)
    
    t.assert(data.methods.length === 1)

    t.is(data.className, undefined)

    const method = data.methods[0]
    t.is(method.name, "hello")
    t.deepEqual(method.params, ['name', '{ title, agent }'])
    t.deepEqual(method.loc, {start: { line: 3, column: 21 } , end: { line: 5, column: 2 } })
    t.truthy(method.body)
});

test('test can find only functions', t => {
	const parser = new AstParser()
    const extractor = new DataExtractor();

    const ast = parser.parse("./fixtures/original/single_bar.tsx")
    const data = extractor.getClassMethods(ast)
    
    t.assert(data.methods.length === 2)
});

test('test can find functions witf severalCall expr', t => {
	const parser = new AstParser()
    const extractor = new DataExtractor();

    const ast = parser.parse("./fixtures/original/side_bar.tsx")
    const data = extractor.getClassMethods(ast)
    
    t.assert(data.methods.length === 2)
});


test('test can find 2 function declarations', t => {
	const parser = new AstParser()
    const extractor = new DataExtractor();

    const ast = parser.parse("./fixtures/original/private_route.tsx")
    const data = extractor.getClassMethods(ast)
    
    t.assert(data.methods.length === 2)
});

test('test can exract vararg pararms', t => {
	const parser = new AstParser()
    const extractor = new DataExtractor();

    const ast = parser.parse("./fixtures/original/vararg_params.ts")
    const data = extractor.getClassMethods(ast)
    
    t.assert(data.methods.length === 1)

    const method = data.methods[0]
    t.truthy(method.params.length > 0)
});