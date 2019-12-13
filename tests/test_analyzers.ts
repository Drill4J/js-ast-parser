import test from 'ava';
import { AstParser } from 'src/parser';
import { DataExtractor } from 'src/extractor';

const parser = new AstParser()
const extractor = new DataExtractor();

test('test can find MethodDefinition', t => {
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
    t.is(data.className, "Test")

    const method = data.methods[0]
    t.is(method.name, "newMethod")
    t.deepEqual(method.params, ["name"])
    t.deepEqual(method.loc, {start: { line: 3, column: 8 } , end: { line: 5, column: 9 } })
    t.truthy(method.body)
})

test('test can find FunctionDeclaration', t => {
    const source = 
    `
    export function newMethod(name: string) {
        console.log(name)
    }
    `

    const ast = parser.parseSource(source)
    const data = extractor.getClassMethods(ast)
    
    t.is(data.methods.length, 1)
    t.is(data.className, undefined)

    const method = data.methods[0]
    t.is(method.name, "newMethod")
    t.deepEqual(method.params, ["name"])
    t.deepEqual(method.loc, {start: { line: 2, column: 11 } , end: { line: 4, column: 5 } })
    t.truthy(method.body)
})

test('test can find ArrowFunctionExpression', t => {
    const source = 
    `
    const newMethod = (name) => {
        console.log(name)
    }
    `

    const ast = parser.parseSource(source)
    const data = extractor.getClassMethods(ast)
    
    t.is(data.methods.length, 1)
    t.is(data.className, undefined)

    const method = data.methods[0]
    t.is(method.name, "newMethod")
    t.deepEqual(method.params, ["name"])
    t.deepEqual(method.loc, {start: { line: 2, column: 10 } , end: { line: 4, column: 5 } })
    t.truthy(method.body)
})

test('test can find FunctionExpression', t => {
        const source = 
        `
        const hello = function (name) {
            console.log(name)
        }
        `

    const ast = parser.parseSource(source)
    const data = extractor.getClassMethods(ast)
    
    t.is(data.methods.length, 1)
    t.is(data.className, undefined)

    const method = data.methods[0]
    t.is(method.name, "hello")
    t.deepEqual(method.params, ["name"])
    t.deepEqual(method.loc, {start: { line: 2, column: 14 } , end: { line: 4, column: 9 } })
    t.truthy(method.body)
})

test('test can find all methods', t => {
    const ast = parser.parse("./fixtures/original/episode.ts")
    const data = extractor.getClassMethods(ast)
    
    t.is(data.methods.length, 16)
});

test('test can find arrow function', t => {
    const ast = parser.parse("./fixtures/original/selectable-table.tsx")
    const data = extractor.getClassMethods(ast)
    
    t.assert(data.methods.length === 1)
});

test('test can find arrow function with call expression', t => {
    const source =
    `
    const dashboard = undefined;

    export const hello = dashboard((name, { title, agent }) => {

    })
    `

    const ast = parser.parseSource(source)
    const data = extractor.getClassMethods(ast)
    
    t.assert(data.methods.length === 1)

    t.is(data.className, undefined)

    const method = data.methods[0]
    t.is(method.name, "hello")
    t.deepEqual(method.params, ['name', '{ title, agent }'])
    t.deepEqual(method.loc, {start: { line: 4, column: 25 } , end: { line: 6, column: 6 } })
    t.truthy(method.body)
});

test('test can find only functions', t => {
    const ast = parser.parse("./fixtures/original/single_bar.tsx")
    const data = extractor.getClassMethods(ast)
    
    t.assert(data.methods.length === 5)
});

test('test can find functions witf severalCall expr', t => {
    const ast = parser.parse("./fixtures/original/side_bar.tsx")
    const data = extractor.getClassMethods(ast)
    
    t.is(data.methods.length, 4)
});


test('test can find 2 function declarations', t => {
    const ast = parser.parse("./fixtures/original/private_route.tsx")
    const data = extractor.getClassMethods(ast)
    
    t.is(data.methods.length, 2)
});

test('test can exract vararg pararms', t => {
    const source =
    `
    export function composeValidators(...validators: FormValidator[]): FormValidator {
        return (values) => Object.assign({}, ...validators.map((validator) => validator(values)));
    }
    `

    const ast = parser.parseSource(source)
    const data = extractor.getClassMethods(ast)
    
    t.assert(data.methods.length === 1)

    const method = data.methods[0]
    t.truthy(method.params.length > 0)
});